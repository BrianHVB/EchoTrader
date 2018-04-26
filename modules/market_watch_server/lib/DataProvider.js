const appRoot = require('app-root-path');
const config = require(`${appRoot}/config`);
const logger = require(`${appRoot}/config/winston`);

const dbInterface = require(`${appRoot}/lib/dbConnection`);
const _ = require('lodash');



module.exports =  class DataProvider {

	constructor() {
		this.rawData = [];
		this.candleData = [];
	}

	async getCandles({market, numPoints, interval}) {
		logger.verbose(`lib::DataProvider::getCandles()\tgetting raw data from DB`);
		const rawData = await this.getNewestEntries({market: market, numRecordsRequested: numPoints * interval});

		logger.verbose(`lib::DataProvider::getCandles()\tconverting to candlesticks`);
		const candleData = await this.generateCandleData(market, rawData);

		logger.verbose(`lib::DataProvider::getCandles()\taggregating candles`);
		return this.generateAggregateData(interval, candleData);

	}


	async getNewestEntries({market, numRecordsRequested}) {

		logger.verbose(`lib::DataProvider::getNewest()\t market: [${market}] numRequested: [${numRecordsRequested}]`);

		logger.verbose('lib::DataProvider::getNewest()\t querying database');

		const rawData = await dbInterface.getNewestRecords(numRecordsRequested, market);

		this.rawData = rawData;
		return this.rawData;

	};

	async generateCandleData(market, rawData) {
		const candleData =  rawData.map(row => {
			const timeAsNumber = Date.parse(row.time);
			return {
				key: timeAsNumber,
				date: new Date(timeAsNumber),
				open: Number(row.open),
				high: Number(row.high),
				low: Number(row.low),
				close: Number(row.close),
				volume: (Number(row.volume_in) + Number(row.volume_out)),
				trades: (Number(row.total_trades))
			}
		}).reverse();

		this.candleData = candleData;
		return this.candleData;
	}

	async generateAggregateData(interval, candleData) {

		const data = this.candleData;
		const newData = [];

		// holds the data for the current frame. Each frame is (periods) * base_unit long
		const initializeWindow = function() {
			return {
				openTime: null,
				closeTime: null,
				open: 0,
				prices: [],
				close: 0,
				volume: 0,
				trades: 0,
			};
		};

		let frame = initializeWindow();

		// cycle counter. 1 = start of cycle, 0 = end of cycle, all others = middle
		let i = 1;

		// loop from end to start
		_.forEachRight(data, current => {
			let cycle = i % interval;

			// at start of cycle
			// this is the latest period of the cycle and will determine the closing time and price
			if (cycle === 1 || interval === 1) {
				frame.closeTime = current.key;
				frame.close = current.close;
			}

			// on every step in the cycle
			// update prices (for determining high/low), volume, and trades
			frame.prices.push(current.high);
			frame.prices.push(current.low);
			frame.volume += current.volume;
			frame.trades += current.trades;

			// at end of cycle
			// this is the first period of the cycle and will determine opening time and price
			// the cycle is ready to be turned into a candlestick
			if (cycle === 0) {
				frame.openTime = current.key;
				frame.open = current.open;

				let dateAsNumber = Date.parse(frame.closeTime);
				newData.push({
					key: frame.closeTime,
					date: new Date(frame.closeTime),
					open: frame.open,
					high: Math.max(...frame.prices),
					low: Math.min(...frame.prices),
					close: frame.close,
					volume: frame.volume,
					trades: frame.trades,
				});

				// prepare for a new frame
				frame = initializeWindow();

			}
			i++;
		});

		//logger.verbose(newData.reverse());
		return newData.reverse();
	}
};