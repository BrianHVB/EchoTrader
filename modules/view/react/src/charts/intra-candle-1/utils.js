

import { tsvParse, csvParse } from  "d3-dsv";
import { timeParse } from "d3-time-format";
import request from 'superagent';
import Logger from "../../../config/logger";

const log = new Logger('marketTable');

function parseData2(parse) {
	return function(d) {
		d.date = parse(d.date);
		d.open = +d.open;
		d.high = +d.high;
		d.low = +d.low;
		d.close = +d.close;
		d.volume = +d.volume;



		return d;
	};
}


function parseData() {}

export function getData() {
	return request
		.get('http://localhost:8090/api/get_newest/gdax_btc_usd')
		.query({num: 5000})
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
					volume: (Number(row.volume_in) + Number(row.volume_out))
				}
			}).sort((a, b) => a.key - b.key)
		})
		// .then(newData => log.table(newData))
		.catch(err => log.error(err));


	// return fetch("//rrag.github.io/react-stockcharts/data/MSFT_INTRA_DAY.tsv")
	// 	.then(response => response.text())
	// 	.then(data =>{
	// 		let x = tsvParse(data, parseData2(d => new Date(+d)));
	// 		log.table(x[5]);
	// 		log.log(x[5].date);
	// 		return x;
	// 	});
}

export function getData2() {
	return fetch("//rrag.github.io/react-stockcharts/data/MSFT_INTRA_DAY.tsv")
		.then(response => response.text())
		.then(data =>{

			let x = tsvParse(data, parseData2(d => new Date(+d)));

			return x;
		});
}
