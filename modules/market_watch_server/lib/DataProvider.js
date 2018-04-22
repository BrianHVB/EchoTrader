const appRoot = require('app-root-path');
const config = require(`${appRoot}/config`);
const logger = require(`${appRoot}/config/winston`);

const dbInterface = require(`${appRoot}/lib/dbConnection`);



module.exports =  class DataProvider {
	static async getNewestEntries(market, params) {
		const numRecordsRequested = params.numRecordsRequested || 1;

		logger.verbose(`lib::DataProvider::getNewest()\t market: [${market}] numRequested: [${numRecordsRequested}]`);


		logger.verbose('lib::DataProvider::getNewest()\t querying database');

		return await dbInterface.getNewestRecords(numRecordsRequested, market);

	};


	static async getCandles(market, numPoints, interval) {


		return [{market: market, numPoints: numPoints, interval: interval}];
	}
};