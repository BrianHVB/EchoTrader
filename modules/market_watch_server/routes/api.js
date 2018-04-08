const appRoot = require('app-root-path');
const logger = require(`${appRoot}/config/winston`);

const express = require('express');
const router = express.Router();

const config = require(`${appRoot}/config`);

const DatabaseInterface = require(config.MarketDatabaseInterface);
const dbInterface = new DatabaseInterface('GDAX');


// get_newest
router.get('/get_newest/:market', function(req, res, next) {
	const market = req.params.market;
	const numRecordsRequested = req.query.num || 1;

	logger.info(`api::get_newest::\t market: [${market}] numRequested: [${numRecordsRequested}]`);

	const invalidResponseBody = {
		message: `Invalid request: [${market}] is not a valid market`,
		data: null,
		count: 0
	};

	// invalid market name
	if (!config.markets.map(obj => obj.name).includes(market)) {
		const errorMsg = `Invalid request: [${market}] is not a valid market`;
		res.status(400).json(invalidResponseBody);

		logger.error(invalidResponseBody.message);
		return;
	}

	logger.info('api::get_newest::processing\t querying database');

	dbInterface.getNewestRecords(numRecordsRequested, market)
		.then(data => {
			const validResponseBody = {
				message: 'success',
				data: data,
				count: data.length,
			};

			res.status(200).json(validResponseBody);

			logger.info(`api::get_newest::response\t message: [${validResponseBody.message}]\t records: [${data.length}]`);

		})
		.catch(err => {
			res.status(400).json({
				message: err,
				data: err,
				count: 0
			});

			logger.error(`api::get_newest::response\t ${err}`);
		});

});



module.exports = router;


