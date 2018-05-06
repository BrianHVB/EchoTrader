// global defaults - this file SHOULD be committed to source control

const config = {
	env: `development`,

	gdax: {
		host: `wss://ws-feed.gdax.com`,
		channels: [
			{name: 'BTC-USD', type: 'ticker'},
			{name: 'ETH-USD', type: 'ticker'},
			{name: 'BCH-USD', type: 'ticker'},
			{name: 'ETH-BTC', type: 'ticker'},
			{name: 'LTC-USD', type: 'ticker'},

		]
	}
};

const production = {
	dataSource: "http://echogy.net:8090",

};

const development = {
	dataSource: "http://localhost:8090",
};


Object.assign(config,
	config.env === 'production' ? production : development
);






module.exports = config;