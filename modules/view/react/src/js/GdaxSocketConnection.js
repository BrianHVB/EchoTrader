// logging
import Logger from 'config/logger';
const log = new Logger('GdaxSocketConnection');

//config
import config from 'config'

// other imports
import websocket from 'websocket';
const W3CWebSocket = websocket.w3cwebsocket;
import EventEmitter from 'eventemitter3';

let client = null;
let _singleton = null;
export default class GdaxSocketConnection extends EventEmitter{



	constructor() {
		super();
		if (!_singleton) {
			_singleton = this;
		}

		return _singleton;

	}

	connect() {
		if (!client) {
			const remote = config.gdax.host;

			log.log(`Connecting to ${remote}`);
			client = new W3CWebSocket(remote);


			client.onopen = () => {
				if (client.readyState === client.OPEN) {
					log.log("Client connected");
					this.emit("connected");
				}
				else {
					log.log(`readyState = ${client.readyState}`);
				}


			};

			client.onerror = (err) => {
				log.log(`Connection error: ${err}`);
			};

			client.onclose = () => {
				log.log("Connection closed");
				client = null;
			};

			client.onmessage = (e) => {
				const data = JSON.parse(e.data);
				if (data.type === "ticker") {
					log.log("Emitting tick...");
					this.emit("tick", data.product_id, data);
				}
			};

			return;

		}

		log.log("Client connection already established");
		if (client.readyState === client.OPEN) {
			this.emit("connected");
		}


	}

	// noinspection JSMethodCanBeStatic
	subscribe(market, channel) {
		if (!client) {
			throw(`Cannot subscribe to ${market} ${channel}. Client is null`);
		}

		const subscribeMessage = {
			type: 'subscribe',
			channels: [
				{
					name: channel,
					product_ids: [market]
				}
			]
		};
		client.send(JSON.stringify(subscribeMessage));
	}

	// noinspection JSMethodCanBeStatic
	close() {
		client.close();
	}



}