// external imports
const EventEmitter = require('events');

// internal imports
const _config = require('./config');
const _marketTables = _config.postgres.marketTables;
const GdaxWebSocketInterface = require('./lib/GdaxWebSocketInterface');
const MarketDatabaseInterface = require('./lib/MarketDatabaseInterface');

// DEBUG
const oldDebug = console.debug;
console.debug = function(msg) {
	const DEBUG = false;
	if (DEBUG) {
		oldDebug(msg);
	}
};


class GdaxDatabaseBridge extends EventEmitter {

	constructor() {
		super();

		this.gdaxInterface = new GdaxWebSocketInterface();
		this.databaseInterface = new MarketDatabaseInterface('GDAX');

		this.currentMarketData = new Map();
		this.setupMarketData();

		this.currentPriceData = new Map();
		this.currentVolumeData = new Map();
		this.setupPriceAndVolumeData();

		this.lastInsertedTradeIds = new Map();
		this.setupTradeIds();

		this.signalTableMap = new Map();
		this.setupSignalTableMap();

		this.registerSignalHandlers();

		this.setupTimers();

	}

	setupMarketData() {
		_marketTables.forEach(itm => {
			if (itm.key.exchange === 'GDAX') {
				this.currentMarketData.set(itm.signal, {
					exchange: itm.key.exchange,
					currency: itm.key.currency,
					base_currency: itm.key.baseCurrency,
					last_trade_id: 0,
					last_trade_side: null,
					last_trade_time: null,
					last_trade_price: 0,
					last_trade_volume: 0,
					time: null,
					high: 0,
					low: 0,
					average: 0,
					total_volume: 0,
					average_volume: 0
				})
			}
		})
	}

	setupPriceAndVolumeData() {
		_marketTables.forEach(itm => {
			this.currentPriceData.set(itm.signal, []);
			this.currentVolumeData.set(itm.signal, []);
		});
	}

	setupTradeIds() {
		_marketTables.forEach(itm => {
			this.lastInsertedTradeIds.set(itm.signal, -1);
		});
	}

	setupSignalTableMap() {
		_marketTables.forEach(itm => {
			this.signalTableMap.set(itm.signal, itm.table);
		});

	}

	clearPriceAndVolumeData(productId) {
		this.currentPriceData.set(productId, []);
		this.currentVolumeData.set(productId, []);
	}

	registerSignalHandlers() {
		this.gdaxInterface.on('tick', this.onTick.bind(this));
	}

	setupTimers() {
		let timers = _config.gdaxDatabaseBridge.dataIntervals;
		timers.forEach(itm => {
			setInterval(this.onInterval.bind(this, itm.productId), itm.interval);
		})
	}

	connectAndSubscribe() {
		this.gdaxInterface.connect();
		this.gdaxInterface.on('connect', () => {
			console.debug('::connectAndSubscribe() - Connected - Subscribing to channels');
			_config.gdaxDatabaseBridge.channels.forEach(entry => {
				this.gdaxInterface.subscribe(entry[0], entry[1]);
			})
		});

	}

	onTick(orderBook, msg) {
		setImmediate(() => {
			try {
				console.log(`Message from ${orderBook}`);
				this.updateCurrentDataFromTick(orderBook, msg);
			} catch(err) {
				console.error(`ERROR: Unknown error while trying to update tick data.\nDetails: ${err}\n${JSON.stringify(msg, null, 2)}`);
			}
		})
	}

	onInterval(productId) {
		let lastInsertedId = this.lastInsertedTradeIds.get(productId);
		let currentData = this.currentMarketData.get(productId);

		console.debug(`::onInterval() - product = ${productId}\t last id = ${lastInsertedId}\t current id = ${currentData.last_trade_id}`);

		if (currentData.last_trade_id === 0) {
			console.debug(`no data: last_trade_id = ${currentData.last_trade_id}`);
			return;
		}

		if (currentData.last_trade_id === lastInsertedId) {
			console.debug(`no change: last_trade_id = ${currentData.last_trade_id} \t lastInsertId = ${lastInsertedId} : inserting record`);
			this.insertRecord(productId);

		}
		else {
			setImmediate(() => {
				console.debug(`change detected: lastId = ${currentData.last_trade_id} \t lastInsert = ${lastInsertedId} : calculating...`);
				this.calculateAndUpdateTemporalData(productId);
				this.insertRecord(productId);
			});
		}


	}

	updateCurrentDataFromTick(productId, msg) {
		let dataObj = this.currentMarketData.get(productId);
		dataObj.last_trade_id = msg.trade_id;
		dataObj.last_trade_side = msg.side;
		dataObj.last_trade_time = msg.time;
		this.currentPriceData.get(productId).push(Number(msg.price));
		this.currentVolumeData.get(productId).push(Number(msg.last_size));

		console.debug(`::updateCurrentDataFromTick() - data updated`)
	}

	calculateAndUpdateTemporalData(productId) {
		console.debug(`::calculateTemporalData() - product = ${productId}`);

		let dataObj = this.currentMarketData.get(productId);

		let prices = this.currentPriceData.get(productId);
		let volumes = this.currentVolumeData.get(productId);
		dataObj.last_trade_price = prices[prices.length - 1];
		dataObj.last_trade_volume = volumes[volumes.length - 1];
		dataObj.high = Math.max(...prices);
		dataObj.low = Math.min(...prices);
		dataObj.average = prices.reduce((prev, current) => prev + current, 0) / prices.length;
		dataObj.total_volume = volumes.reduce((prev, current) => prev + current, 0);
		dataObj.average_volume = dataObj.total_volume / volumes.length;

		this.clearPriceAndVolumeData(productId);

		console.debug(`::calculateTemporalData() - complete`);
	}

	insertRecord(productId) {
		let currentData = this.currentMarketData.get(productId);
		currentData.time = new Date(Date.now());

		this.lastInsertedTradeIds.set(productId, currentData.last_trade_id);

		console.debug(`::onInterval() - inserting record`);

		let insertion = this.databaseInterface.insert(currentData, this.signalTableMap.get(productId));
		insertion.catch(err => {
			console.error(`Error: Promise rejection on database insertion\nDetails: ${err}\n${JSON.stringify(currentData, null, 2)}`)
		})
	}

}

module.exports = GdaxDatabaseBridge;

bridge = new GdaxDatabaseBridge();
bridge.connectAndSubscribe();


