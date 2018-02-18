// external imports
const {Pool} = require('pg');


// private members
const _config = Symbol('_config');
const _query = Symbol('_query');
const _pool = Symbol('_pool');

let dataConnection = {
	config: require('../config'),
	pool: null,

	initialize: function() {
		this.pool = new Pool(this.config.postgres.connection);
	}
};

let configurations = {
	gdax_btc_usd: {
		exchange: 'GDAX',
		currency: 'BTC',
		baseCurrency: 'USD'
	},
	gdax_eth_usd: {
		exchange: 'GDAX',
		currency: 'ETH',
		baseCurrency: 'USD'
	}
};

let tableMap = new Map([
	[JSON.stringify(configurations.gdax_btc_usd), 'gdax_basic'],
	[JSON.stringify(configurations.gdax_eth_usd), 'gdax_basic']
]);


class DataInterface {
	constructor(name = '', marketType = null) {
		this.name = name;
		this[_config] = require('../config');

		if (!dataConnection.pool) {
			dataConnection.initialize();
		}

		this[_pool] = dataConnection.pool;

		if (marketType) {
			this.table = DataInterface.setDefaultTable(marketType);
		}
		else {
			this.table = ''
		}

	}

	static setDefaultTable(marketType) {
		let key = JSON.stringify(marketType);
		if (tableMap.has(key)) {
			return tableMap.get(key);
		}

		throw `Construction Error: There is no table associated with ${marketType}`;
	}

	async close() {
		console.debug('calling pool.end()');
		await this[_pool].end();
		console.debug('pool has drained');
	}

	async query(text, values) {
		const pool = this[_pool];

		console.debug('starting async query');
		const result = await pool.query(text, values);
		console.debug('async query finished');

		return result.rows;
	}

	async insert(record, tableName = this.table) {
		let {query, values} = await this.buildInsertQuery(record, tableName);

		let result = await this.query(query, values);
		return result[0].id;

	}

	async checkValidInsertion(record, tableName) {
		let map = await this.getInsertionObj(tableName);

		if (Object.entries(map).length === 0) {
			throw `Insert Error: Table ${tableName} doesn't exist`;
		}

		Object.entries(record).forEach(([key]) => {
			if (map[key] === undefined) {
				throw `Insert Error: Object property ['${key}'] does not correspond to a column in table '${tableName}'`;
			}
		});


	}

	async isTable(tableName) {
		let text = `SELECT table_name, table_schema
						FROM information_schema.tables
						WHERE table_schema = 'public';`;

		let result = await this.query(text, null);

		for (let row of result) {
			if (row.table_name === tableName) {
				return true;
			}
		}

		return false;
	}

	async buildInsertQuery(record, tableName) {
		await this.checkValidInsertion(record, tableName);

		let template = DataInterface.buildInsertTemplate(record);
		let primaryKey = await this.getPrimaryKeyColumnName(tableName);
		let query = `INSERT INTO ${tableName} (${template.columnString})
						VALUES (${template.valueString})
						RETURNING ${primaryKey};`;

		return {query: query, values: template.values};
	}

	async getInsertionObj(tableName) {
		let query = `SELECT a.column_name, b.constraint_name
						FROM information_schema.columns AS a
                  FULL OUTER JOIN information_schema.key_column_usage b
                  ON a.column_name = b.column_name
                  WHERE a.table_name = $1
                  AND (b.constraint_name IS NULL OR b.constraint_name NOT LIKE '%pkey%')
						ORDER BY column_name ASC;`;
		let values = [tableName];

		let result = await this.query(query, values);

		let map = {};
		result.forEach(itm => {
			map[itm.column_name] = null;
		});

		return map;
	}

	static buildInsertTemplate(record) {
		let result = {};
		result.columnString = '';
		result.valueString = '';
		result.values = [];

		let recordMap = new Map(Object.entries(record));
		let count = 1;
		let size = recordMap.size;

		recordMap.forEach((val, key) => {
			result.columnString += key;
			result.valueString += '$' + count;

			if (count !== size) {
				result.columnString += ', ';
				result.valueString += ', ';
			}

			result.values[count - 1] = val;
			count++;
		});

		return result;
	}

	async getPrimaryKeyColumnName(tableName) {
		let query = `SELECT column_name, constraint_name
						FROM information_schema.key_column_usage
						WHERE table_name = $1 AND constraint_name LIKE '%pkey%'
						ORDER BY column_name ASC;`;
		let values = [tableName];

		let result = await this.query(query, values);

		return result[0].column_name;
	}

	async getDatabaseTime() {
		const result = await this.query('SELECT now()');
		return result[0].now;
	}

	async getRecordById(id, tableName = this.table) {
		await this.throwErrorIfInvalidTable(tableName);

		let query = `SELECT * FROM ${tableName} WHERE id = $1`;
		let values = [id];

		let result = await this.query(query, values);
		return result[0];
	}

	async throwErrorIfInvalidTable(tableName) {
		let valid = await this.isTable(tableName);
		if (!valid) {
			throw `Query Error: [${tableName}] is not a valid table`;
		}
	}

	async getRecordsBetweenTime(start, end, tableName = this.table) {
		await this.throwErrorIfInvalidTable(tableName);

		let text = `SELECT *
						FROM ${tableName}
						WHERE time BETWEEN $1 AND $2;`;
		let values = [start, end];

		return this.query(text, values);

	}

	async getRecordsSinceTradeTime(start, tableName = this.table) {
		await this.throwErrorIfInvalidTable(tableName);

		let text = `SELECT *
						FROM ${tableName}
						WHERE last_trade_time >= $1`;
		let values = [start];

		return this.query(text, values);
	}

	async getRecordsSinceId(id, tableName = this.table) {
		await this.throwErrorIfInvalidTable(tableName);

		let text = `SELECT *
						FROM ${tableName}
						WHERE id >= $1`;
		let values = [id];

		return this.query(text, values);
	}

}

module.exports = DataInterface;


// const di = new DataInterface();
// di.getInsertionObj('gdax_basic').then(data => {
// 	console.log(data);
// 	di.close();
// });


// const di = new DataInterface();
// di.getPrimaryKeyColumnName('gdax_basic').then(data => console.log(data));
// di.close().then(() => {});

// test
// const di = new DataInterface('GDAX');
// di.test('SELECT now()').then(data => {
// 	console.log(data);
// 	di.close(() => {});
// });

// di.getDatabaseTime().then(data => {
// 	console.log(data);
// 	di.close().then(() => console.log('closed'))
// });

// (async function() {
// 	await di.close();
// })();

// di.getDatabaseTime().then(data => {
// 	console.log(data);
// 	//di.close();
// });





