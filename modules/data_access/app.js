// global imports
require('./lib/global_helpers');

// module imports
const config = require('./config');


const echo = function(str) {
	return toUpper(str);
};


const toUpper = function(str) {
	return str.toUpperCase();
};

let app = {
	echo: echo,

	prv: null
};

if (config.env === 'test') {
	app.prv = {};
	app.prv.toUpper = toUpper;
}


module.exports = app;