// external imports
const {Pool} = require('pg');


// private members
const _config = Symbol('_config');
const _query = Symbol('_query');
const _pool = Symbol('_pool');

class DataInterface {
	constructor(name = '') {
		this.name = name;
		this[_config] = require('../config');

		this[_pool] = new Pool(this[_config].postgres.connection);
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

	async insert(tableName, record) {
		let {query, values} = await this.buildInsertQuery(tableName, record);

		let result = await this.query(query, values);
		return result[0].id;

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

	async getDatabaseTime() {
		const result = await this.query('SELECT now()');
		return result[0].now;
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


	async buildInsertQuery(tableName, record) {
		await this.checkValidInsertion(tableName, record);

		let template = DataInterface.buildInsertTemplate(record);
		let primaryKey = await this.getPrimaryKeyColumnName(tableName);
		let query = `INSERT INTO ${tableName} (${template.columnString})
						VALUES (${template.valueString})
						RETURNING ${primaryKey};`;

		return {query: query, values: template.values};
	}


	async checkValidInsertion(tableName, record) {
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





