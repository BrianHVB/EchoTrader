import config from './index';

let DEV = config.env === 'development';

export default class Logger {
	constructor(prefix) {
		this.prefix = prefix;
	}

	log(msg) {
		if (!DEV) return;

		console.log(`%c${this.prefix}: ` + `%c${msg}`, 'color: darkblue', 'color: black');
	}
}



