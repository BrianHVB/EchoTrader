const appRoot = require('app-root-path');
const express = require('express');
const router = express.Router();

const config = require(`${appRoot}/config`);

const DatabaseInterface = require(config.MarketDatabaseInterface);

let marketConfig = {
	exchange: 'GDAX',
	currency: 'BTC',
	baseCurrency: 'USD'
};

const dbInterface = new DatabaseInterface('GDAX', marketConfig);


const logger = require(`${appRoot}/config/winston`);


router.get('/get_newest/:market', function(req, res, next) {
	const market = req.params.market;
	const numRecordsRequested = req.query.num || 1;

	logger.info(`api::get_newest::\t market: [${market}] numRequested: [${numRecordsRequested}]`);

	// invalid market name
	if (!config.markets.map(obj => obj.name).includes(market)) {
		const errorMsg = `Invalid request: [${market}] is not a valid market`;
		res.status(400).json({
			message: errorMsg,
			data: null,
			records: 0
		});

		logger.error(errorMsg);
		return;
	}

	logger.info('api::get_newest::processing querying database');

	dbInterface.getNewestRecords(numRecordsRequested, market)
		.then(data => {
			res.status(200).json({
				data: data,
				records: data.length,
				message: 'hhh'
				});

			logger.info(`api::get_newest::response message: ok records: ${data.length}`);
			logger.debug(res.message);


		})
		.catch(err => {
			res.status(400).json({
				message: err,
				data: err,
				records: 0
			});

			logger.error(err);

		})




});





//logger.debug(config.MarketDatabaseInterface);
//logger.debug(config);


module.exports = router;


