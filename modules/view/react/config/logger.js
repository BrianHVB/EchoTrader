import config from './index';

let DEV = config.env === 'development';

const error = console.error.bind(window.console);
const table = console.table.bind(window.console);
const log = console.log.bind(window.console);

export default class Logger {
	constructor(prefix) {
		this.prefix = prefix;
	}

	log(msg) {
		if (!DEV) return;

		log(`%c${this.prefix}: ` + `%c${msg}`, 'color: darkblue', 'color: black');
	}

	error(msg) {
		error(`%c${this.prefix}: ` + `%c${msg}`, 'color: red', 'color: black');
	}

	table(msg) {
		if (!DEV) return;

		log(`%c${this.prefix}:\n`, 'color: darkblue');
		table(msg);
	}
}



