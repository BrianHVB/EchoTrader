const appRoot = require('app-root-path');
const logger = require(`${appRoot}/config/winston`);
const config = require(`${appRoot}/config`);

const MarketDatabaseInterface = require(config.MarketDatabaseInterface);
let instance = null;

if (!instance) {
	logger.info('dbConnection::instance\t creating new instance');
	instance = new MarketDatabaseInterface;
}

module.exports = instance;