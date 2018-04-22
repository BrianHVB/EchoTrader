const appRoot = require('app-root-path');
const Winston = require('winston');

const winstonConfig = require('./index').logging.winston;

const logger = new Winston.Logger(winstonConfig);

logger.stream = {
	write: function(message, encoding) {
		logger.silly('morgan: ' + message);
	}
};

module.exports = logger;