import Logger from 'config/logger';
import config from 'config';

const log = new Logger('dataProvider');


import request from "superagent";
import _ from 'lodash';






export default class DataProvider {

	constructor() {
		this.rawData = [];
	}

	getData(market, numberOfDataPoints = 1000, interval = 1) {
		const remoteUrl = config.dataSource;
		return request
			.get(`${remoteUrl}/api/get_candles/${market}`)
			.query({num_points: numberOfDataPoints, interval: interval})
			.then(res => {
				res.body.data.forEach(itm => itm.date = new Date(itm.date));
				//log.table(res.body.data);
				return res.body.data;
			})
	}

	// getData2(numberOfDataPoints = 1000, interval = 1) {
	// 	log.log(`getData(points=${numberOfDataPoints}, interval=${interval}`);
	// 	return this.getRawData(numberOfDataPoints)
	// 		.then(rawData => {
	// 			log.log("rawData");
	// 			log.table(rawData);
	// 			const aggData = (interval === 1) ? (rawData) : (DataProvider.aggregateData(rawData, interval));
	// 			log.log("aggData");
	// 			log.table(aggData);
	// 			return aggData;
	// 		});
	//
	// }


	getRawData(points) {
		const remoteUrl = config.dataSource;
		return request
			.get(`${remoteUrl}/api/get_newest/gdax_btc_usd`)
			.query({num: points})
			.then(res => {

				return res.body.data;
			})
			.then(data => {
				return data.map(row => {
					return {
						key: Date.parse(row.time),
						date: new Date(Date.parse(row.time)),
						open: Number(row.open),
						high: Number(row.high),
						low: Number(row.low),
						close: Number(row.close),
						volume: (Number(row.volume_in) + Number(row.volume_out)),
						trades: (Number(row.total_trades))
					}
				}).sort((a, b) => a.key - b.key)
			})
			// .then(newData => log.table(newData))
			.catch(err => log.error(err));
	}

	/*
		Aggregates raw OHLCV data into lower-resolution candle-sticks.
		Starts with the most current bar and works backwards in time creating new candle stick entries
	*/
	static aggregateData(data, periods) {
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
			let cycle = i % periods;

			// at start of cycle
			// this is the latest period of the cycle and will determine the closing time and price
			if (cycle === 1 || periods === 1) {
				frame.closeTime = current.date;
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
				frame.openTime = current.date;
				frame.open = current.open;

				let dateAsNumber = Date.parse(frame.closeTime);
				newData.push({
					key: dateAsNumber,
					date: new Date(dateAsNumber),
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

		return newData.reverse();
	}
}