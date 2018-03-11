// external imports
const EventEmitter = require('events');

// internal imports
const _config = require('../config/index');
const _marketTables = _config.postgres.marketTables;
const GdaxWebSocketInterface = require('./GdaxWebSocketInterface');
const MarketDatabaseInterface = require('./MarketDatabaseInterface');

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
					time: null,
					market: `${itm.key.exchange}-${itm.key.currency}-${itm.key.baseCurrency}`,
					open: 0,
					high: 0,
					low: 0,
					close: 0,
					volume_in: 0,
					volume_out: 0,
					total_trades: 0,
					time_open: new Date(Date.now()),
					time_close: null,
					last_trade_id: null
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

	clearPriceData(productId) {
		this.currentPriceData.set(productId, []);
	}

	clearVolumeData(productId) {
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

		if (currentData.last_trade_id === null) {
			console.debug(`no data: last_trade_id = ${currentData.last_trade_id}`);
		}
		else {
			setImmediate(() => {
				console.debug(`:onInterval():update() lastId = ${currentData.last_trade_id} \t lastInsert = ${lastInsertedId} : calculating...`);
				this.calculateAndUpdateTemporalData(productId);
				this.insertRecord(productId);
			});

		}

	}

	updateCurrentDataFromTick(productId, msg) {
		let dataObj = this.currentMarketData.get(productId);

		dataObj.last_trade_id = msg.trade_id;
		this.currentPriceData.get(productId).push(Number(msg.price));

		if (msg.side.toLowerCase() === 'buy') {
			this.currentVolumeData.get(productId).push(Number(msg.last_size));
		}
		else if (msg.side.toLowerCase() === 'sell') {
			this.currentVolumeData.get(productId).push(-1 * Number(msg.last_size));
		}
		else {
			console.debug(`:updateCurrentDataFromTick() - unknown value for 'side' [side = ${msg.side}`);
		}

		console.debug(`::updateCurrentDataFromTick() - data updated`)
	}

	calculateAndUpdateTemporalData(productId) {
		console.debug(`::calculateTemporalData() - product = ${productId}`);

		let dataObj = this.currentMarketData.get(productId);

		let prices = this.currentPriceData.get(productId);
		let volumes = this.currentVolumeData.get(productId);

		// only update prices if there has been activity during the last interval
		if (prices.length > 0) {
			dataObj.open = prices[0];
			dataObj.high = Math.max(...prices);
			dataObj.low = Math.min(...prices);
			dataObj.close = prices[prices.length - 1];
		}

		dataObj.volume_in = volumes.filter(itm => itm < 0).map(Math.abs).reduce((prev, current) => prev + current, 0);
		dataObj.volume_out = volumes.filter(itm => itm > 0).reduce((prev, current) => prev + current, 0);

		dataObj.total_trades = prices.length;

		dataObj.time_close = new Date(Date.now());

		this.clearPriceAndVolumeData(productId);

		console.debug(`::calculateTemporalData() - complete`);
	}

	updateTimeOpen(productId) {
		let dataObj = this.currentMarketData.get(productId);
		dataObj.time_open = new Date(Date.now());
	}

	insertRecord(productId) {
		let currentData = this.currentMarketData.get(productId);
		currentData.time = new Date(Date.now());

		this.lastInsertedTradeIds.set(productId, currentData.last_trade_id);

		console.debug(`::onInterval() - inserting record`);

		let insertion = this.databaseInterface.insert(currentData, this.signalTableMap.get(productId));
		insertion.catch(err => {
			console.error(`Error: Promise rejection on database insertion\nDetails: ${err}\n${JSON.stringify(currentData, null, 2)}`)
		}).then(() => this.updateTimeOpen(productId));

	}

}

module.exports = GdaxDatabaseBridge;




