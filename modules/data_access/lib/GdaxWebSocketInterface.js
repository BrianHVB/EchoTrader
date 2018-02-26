// DEBUG
const oldDebug = console.debug;
console.debug = function(msg) {
	const DEBUG = false;
	if (DEBUG) {
		oldDebug(msg);
	}
};

// external imports
const WebSocketClient = require('websocket').client;
const EventEmitter = require('events');

// private symbols
const _config = require('../config');
let _client  = null;

class GdaxWebSocketInterface extends EventEmitter {
	constructor() {
		super();

		this.socket = null;
		this.channels = new Map();

		this.retryDelay = _config.webSocket.gdax.retryDelay;
		this.maxRetries = _config.webSocket.gdax.maxRetries;
		this.keepAlive = _config.webSocket.gdax.keepAlive;

		this.retryAttempts = 0;
		this.missingPingResponses = 0;

		this.typeMap = new Map([
			["subscriptions", this.onSubscriptions.bind(this)],
			["heartbeat", this.onHeartbeat.bind(this)],
			["ticker", this.onTicker.bind(this)],
			["snapshot", this.onSnapshot.bind(this)],
			["l2update", this.onL2Update.bind(this)]
		]);
	}

	connect() {
		if (this.socket) {
			return;
		}

		_client = new WebSocketClient();

		const remoteUrl = _config.webSocket.gdax.url;
		const requestedProtocols = _config.webSocket.gdax.requestedProtocols;
		_client.connect(remoteUrl, requestedProtocols);

		_client.on('connect', webSocket => this.onConnect(webSocket));
		_client.on('connectFailed', error => this.onConnectFailed(error));
	}

	close(reason = 1000) {
		if (!this.socket) {
			return;
		}

		console.debug(`:close() - calling socket.close()`);
		this.emit('clientClose', reason);
		this.socket.close(reason);
	}

	ping(payload = 'ping', responseHandler = function() {}) {
		if (!this.socket) {
			return;
		}

		console.debug(`sending ping: payload = [${payload}]`);
		this.socket.ping(payload);

		this.socket.once('pong', data => {
			console.debug(`ping reply: data = [${data}]`);
			responseHandler(data);
			this.emit('pong', data);
		})
	}

	setupKeepAlive() {
		console.debug(":setupKeepAlive()");

		let noReply = function() {
			this.missingPingResponses++;
			console.debug(`:keepAlive - noReply() -  [missing = ${this.missingPingResponses}]`);
		}.bind(this);

		let sendPing = function() {
			console.debug(`:keepAlive - sendPing() - starting timer`);
			let timer = setTimeout(noReply, this.keepAlive.timeToWait);
			const payload = Math.random();
			this.ping(payload, () => {
				console.debug(`:keepAlive - sendPing() - responseCallback() -- clearing timer`);
				clearTimeout(timer);
				this.missingPingResponses = 0;
			});
		}.bind(this);

		let interval = setInterval(() => {
			console.debug(`:keepAlive - interval() - checking missed responses`);
			if (this.missingPingResponses >= this.keepAlive.numMissedResponses) {
				console.debug(`:keepAlive - interval() - dead connection detected - clearing interval`);
				clearInterval(interval);
				this.socket = null;
				console.debug(`:keepAlive - interval() - socket closed - starting reconnection - calling connect()`);
				this.connect();
			}
			else {
				sendPing()
			}
		}, this.keepAlive.pollFrequency);

		this.on('clientClose', () => {
			clearInterval(interval);
		})
	}

	subscribe(channel, books) {
		console.debug(':subscribe()');
		if (books.constructor !== Array) {
			books = [books];
		}
		let subscriptionRequest = {
			type: 'subscribe',
			channels: [{
				name: channel,
				product_ids: books
			}]
		};

		let request = JSON.stringify(subscriptionRequest, null, 2);

		console.debug(`:subscribe() sending request\n${request}`);
		this.socket.send(request)
	}

	onConnect(webSocketConnection) {
		this.socket = webSocketConnection;
		this.retryAttempts = 0;
		this.missingPingResponses = 0;

		this.emit('connect', this.socket.remoteAddress);

		console.debug(':registering onMessage, onClose');
		this.socket.on('message', msg => this.onMessage(msg));
		this.socket.on('close', (reason, description) => this.onClose(reason, description));

		if (this.keepAlive && this.keepAlive.enabled) {
			this.setupKeepAlive();
		}
	}

	onConnectFailed(errorDescription) {
		console.error(`Connection Failed: ${errorDescription}`);
		this.socket = null;

		if (this.retryAttempts !== this.maxRetries || this.maxRetries === -1) {
			this.retryAttempts++;

			let boundConnect = this.connect.bind(this);

			console.debug(`Setting timeout of ${this.retryDelay} for connect(). ${this.maxRetries - this.retryAttempts} attempts remaining`);
			setTimeout(() => boundConnect(), this.retryDelay);
		}
		else {
			console.log(`Max connection attempts [${this.retryAttempts}] reached. Giving up`);
		}

		this.emit('connectFailed', errorDescription);
	}

	onClose(reason, description) {
		console.debug(`connection closed [reason = ${reason}]`);
		this.socket = null;
		this.emit('close', reason, description);
	}

	onMessage(message) {
		console.debug(`:onMessage() - [this] = ${this}`);
		if (message.type !== 'utf8') {
			console.error(`Message Error: Invalid message type from remote socket. Expected 'utf8' but received ${message.type}.`);
			return;
		}

		let dataObj = JSON.parse(message.utf8Data);
		let type = dataObj.type;

		if (this.typeMap.has(type)) {
			let handler = this.typeMap.get(type);
			console.debug(`:onMessage() invoke = ${handler}`);
			handler(dataObj);
		}
		else {
			console.log(`onMessage: Unknown message type [${type}]`);
		}

	}

	onSubscriptions(msgObj) {
		this.channels.clear();

		msgObj.channels.forEach(channel => {
			this.channels.set(channel.name, channel.product_ids)
		});

		this.emit('subscriptions')
	}

	onHeartbeat(msgObj) {
		this.emit('heartbeat', msgObj.product_id, msgObj);
	}

	onTicker(msgObj) {
		if (msgObj.side) {
			this.emit('tick', msgObj.product_id, msgObj);
		}
		else {
			this.emit('ticker-summary', msgObj.product_id, msgObj);
		}
	}

	onSnapshot(msgObj) {
		this.emit('l2-snapshot', msgObj.product_id, msgObj);
	}

	onL2Update(msgObj) {
		this.emit('l2-update', msgObj.product_id, msgObj);
	}

}

module.exports = GdaxWebSocketInterface;
