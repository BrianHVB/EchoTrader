// external imports
const EventEmitter = require('events');

// internal imports
const _config = require('./config');
const GdaxWebSocketInterface = require('./lib/GdaxWebSocketInterface');
const MarketDatabaseInterface = require('./lib/MarketDatabaseInterface');

class GdaxDatabaseBridge extends EventEmitter {

	constructor() {
		super();

		this.gdaxInterface = new GdaxWebSocketInterface();
		this.databaseInterface = new MarketDatabaseInterface('GDAX');

		this.signalTableMap = new Map();
		this.setupSignalTableMap();

		this.registerSignalHandlers();


	}

	setupSignalTableMap() {
		_config.postgres.configurations.forEach(itm => {
			this.signalTableMap.set(itm.signal, itm.table);
		});

	}

	connectAndSubscribe() {
		this.gdaxInterface.connect();
		this.gdaxInterface.on('connect', () => {
			_config.gdaxDatabaseBridge.channels.forEach(entry => {
				this.gdaxInterface.subscribe(entry[0], entry[1]);
			})
		});

	}

	registerSignalHandlers() {
		this.gdaxInterface.on('tick', this.onTick.bind(this));
	}

	static getConfigByProductId(signal) {
		for (let itm of _config.postgres.configurations) {
			if (itm.signal === signal) {
				return itm
			}
		}
		return null;
	}

	onTick(orderBook, msg) {
		setImmediate(() => {
			try {
				let dataObj = GdaxDatabaseBridge.createDataObject(msg);
				dataObj = this.calculateStats(dataObj);
				let insert = this.databaseInterface.insert(dataObj, this.signalTableMap.get(msg.product_id));
				insert.catch(err => console.error(`ERROR: Record [product=${msg.product_id}] not added to database. ${err}`));
			} catch (err) {
				console.error(`ERROR: Unknown error while trying to insert a record.\nDetails: ${err}\n${JSON.stringify(msg, null, 2)}`);
			}
		})
	}

	static createDataObject(msg) {
		let config = GdaxDatabaseBridge.getConfigByProductId(msg.product_id);
		return {
			time: new Date(Date.now()),
			exchange: config.key.exchange,
			currency: config.key.currency,
			base_currency: config.key.baseCurrency,
			last_trade_id: msg.trade_id,
			last_trade_side: msg.side,
			last_trade_time: msg.time,
			last_trade_price: Number(msg.price),
			last_trade_volume: Number(msg.last_size),
			high: 0,
			low: 0,
			average: 0,
			total_volume: 0,
			average_volume: 0
		}
	}

	calculateStats(dataObj) {
		return dataObj;
	}

}

module.exports = GdaxDatabaseBridge;

bridge = new GdaxDatabaseBridge();
bridge.connectAndSubscribe();

