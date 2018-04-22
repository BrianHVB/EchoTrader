const appRoot = require('app-root-path');
const config = require(`${appRoot}/config`);
const logger = require(`${appRoot}/config/winston`);
const express = require('express');

const dbInterface = require(`${appRoot}/lib/dbConnection`);
const DataProvider = require(`${appRoot}/lib/DataProvider`);

const router = express.Router();
const dataProvider = new DataProvider();


const isMarketValid = function(market) {
	return config.markets.map(obj => obj.name).includes(market);
};


const invalidMarketError = function(market) {
	return {
		message: `Invalid request: [${market}] is not a valid market`,
		data: null,
		count: 0
	};
};



const handleMarketDataRequest =  function(req, res, next, dataMethod, params) {
	const market = params.market;


	// invalid market name
	if (!isMarketValid(market)) {
		const invalidResponseBody = invalidMarketError(market);
		res.status(400).json(invalidResponseBody);
		logger.error(invalidResponseBody.message);
		return;
	}

	dataMethod(market, params)
		.then(data => {
			const validResponseBody = {
				message: 'success',
				data: data,
				count: data.length,
			};

			res.status(200).json(validResponseBody);

			logger.verbose(`api::${dataMethod.name}::response\t message: [${validResponseBody.message}]\t records: [${data.length}]`);

		})
		.catch(err => {
			res.status(400).json({
				message: err,
				data: err,
				count: 0
			});

			logger.error(`api::${dataMethod.name}::response\t ${err}`);
		});

};

// get_newest
router.get('/get_newest/:market', (req, res, next) => {

	const params = {
		market: req.params.market,
	   numRecordsRequested: req.query.num || 1
	};

	logger.verbose(`api::get_newest::request\t market=[${params.market}]\t numRequested=[${params.numRecordsRequested}]`);
	handleMarketDataRequest(req, res, next, DataProvider.getNewestEntries, params)
});

// get_candles
router.get('/get_candles/:market', (req, res, next) => {
	const params = {
		market: req.params.market,
		numPoints: req.query.num_points || 1,
		interval: req.query.interval || 1,

	};

	logger.verbose(`api::get_candles::request\t market=[${params.market}]\t ` +
		`numPoints=[${params.numPoints}]\t interval=[${params.interval}]`);
	handleMarketDataRequest(req, res, next, DataProvider.getCandles, params)
});



module.exports = router;


