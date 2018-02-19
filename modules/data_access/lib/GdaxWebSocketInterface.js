// DEBUG
const DEBUG = false;
if (!DEBUG) {
	console.debug = function() {};
}

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

		this.typeMap = new Map([
			["subscriptions", this.onSubscriptions.bind(this)],
			["heartbeat", this.onHeartbeat.bind(this)],
			["ticker", null],
			["snapshot", null],
			["l2update", null]
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

		_client.on('connect', webSocket => {
			this.socket = webSocket;
			this.emit('connect', this.socket.remoteAddress);

			console.debug(':registering onMessage');
			this.socket.on('message', msg => this.onMessage(msg));

		});

	}

	close(reason = 1000) {

		if (!this.socket) {
			return;
		}

		this.socket.close(reason);

		this.socket.on('close', (reason, description) => {
			console.debug(`connection closed [reason = ${reason}]`);
			this.socket = null;
			this.emit('close', reason, description);
		})
	}

	onMessage(message) {
		console.debug(`:onMessage() - [this] = ${this}`);
		if (message.type !== 'utf8') {
			console.error(`Message Error: Invalid message type from remote socket. Expected 'utf8' but received ${message.type}.`)
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

	subscribe(channel, books) {
		console.debug(':subscribe()');
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




}



let sock = new GdaxWebSocketInterface();

sock.on('connect', function(remoteAddress) {
	console.log(`connected to ${remoteAddress}`);

	console.log('subscribing to heartbeat');
	sock.subscribe('heartbeat', ['BTC-USD']);

	setTimeout(() => sock.close(), 5000);
});

sock.on('close', function(reason, description) {
	console.log(`connection closed - ${reason} - ${description}`);
});

sock.on('heartbeat', (product, msgObj) => {
	console.log(`Heartbeat from ${product}\n${msgObj}`)
});

sock.connect();













// let print = function(msg) {console.log(msg);};
// let sprintf = require('sprintf-js').sprintf;
// let WebSocketClient = require('websocket').client;
//
// let client = new WebSocketClient();
//
// client.on('connect', webSocketConnection => {
// 	let wc = webSocketConnection;
// 	print(`connected: \tserver: ${wc.remoteAddress}\tversion: ${wc.webSocketVersion}`);
//
// 	wc.on('message', (msg) => {
// 		if (msg.type !== 'utf8') {
// 			log.error(`Unexpected message type (${msg.type})`)
// 		}
//
// 		let data = JSON.parse(msg.utf8Data);
//
// 		if (data.type === 'ticker') {
// 			processTickerMessage(data);
// 		}
//
// 	});
//
//
// 	print('sending subscribe message');
// 	let subscribeMsg = {
// 		"type": "subscribe",
// 		"product_ids": ["BTC-USD"],
// 		"channels": ["ticker"]
// 	};
// 	wc.send(JSON.stringify(subscribeMsg));
//
// 	setTimeout(closeConnection, 6000000, wc);
//
// });
//
//
// let closeConnection = function(webSocketConnection) {
// 	print("closing connection");
// 	webSocketConnection.close();
// };
//
//
// const currentData = {
// 	prices: [],
// 	volumes: [],
// 	high: 0,
// 	low: 0,
// 	totalVolume: 0,
// 	averageVolume: 0,
// 	averagePrice: 0,
// 	lastTime: "",
// 	lastPrice: 0,
// 	lastVolume: 0,
// 	lastId: "",
// 	lastSide: ""
// };
// let processTickerMessage = function(data) {
// 	if (data.side) {  // if there is no side, then the ticker is just an update but doesn't have an actual trade
// 		let price = Number(data.price);
// 		let volume = Number(data.last_size);
// 		let time = new Date(data.time);
// 		let formattedTime = `${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}:${time.getMilliseconds()}`;
// 		currentData.prices.push(price);
// 		currentData.volumes.push(volume);
// 		currentData.lastTime = formattedTime;
// 		currentData.lastPrice = price;
// 		currentData.lastVolume = volume;
// 		currentData.lastId = data.trade_id;
// 		currentData.lastSide = data.side;
//
// 		prettyPrintTicker(currentData);
// 	}
// };
//
// let prettyPrintTicker = function(data) {
// 	let w = 12; // width of price and volume fields
// 	let result = sprintf('%5$-9i\t%1$-15s\t%2$-5s\t%3$-12f\t%4$-12f\t%6$-12f\t%7$-12f\t%8$-12.8f\t%9$-12.8f\t%10$-12.8f',
// 								data.lastTime, data.lastSide, data.lastPrice, data.lastVolume, data.lastId,
// 								data.low, data.high, data.averagePrice, data.totalVolume, data.averageVolume);
// 	print(result);
// };
//
// let calculateTemporalStats = function() {
// 	let cd = currentData;
// 	cd.high = Math.max(...cd.prices);
// 	cd.low = Math.min(...cd.prices);
// 	cd.totalVolume = cd.volumes.reduce((prev, current) => prev + current, 0);
// 	cd.averageVolume = cd.totalVolume / cd.volumes.length;
// 	cd.averagePrice = cd.prices.reduce((prev, current) => prev + current, 0) / cd.prices.length;
//
// 	cd.prices = [];
// 	cd.volumes = [];
//
// };
//
//
// setInterval(calculateTemporalStats, 30 * 1000);
//
// client.connect("wss://ws-feed.gdax.com", ['JSON'], null, null);
