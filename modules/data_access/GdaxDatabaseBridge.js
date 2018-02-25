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
		this.databaseInterfaces = new Map();

		this.createDatabaseInterfaces();
		this.gdaxInterface.connect();
		this.subscribeToChannelsAndRegisterHandlers();

	}

	createDatabaseInterfaces() {
		Object.entries(_config.postgres.configurations).forEach(entryArray => {
			this.databaseInterfaces.set(entryArray[0], new MarketDatabaseInterface('GDAX', entryArray[1]));
		});

	}

	subscribeToChannelsAndRegisterHandlers() {
		
	}

}

module.exports = GdaxDatabaseBridge;


