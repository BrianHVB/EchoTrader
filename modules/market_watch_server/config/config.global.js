// global defaults - this file SHOULD be committed to source control

let config = {};

config.env = process.env.NODE_ENV  || 'development';

config.express = {
	host: 'localhost',
	port: 8090
};



config.MarketDatabaseInterface = 'D:\\gdrive\\Projects\\EchoTrader\\modules\\data_access\\lib\\MarketDatabaseInterface.js';

module.exports = config;