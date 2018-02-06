const Client = require('pg').Client;
const Pool = require('pg').Pool;

const print = console.log;
const {promisify} = require('util');
const fs = require('fs');

fs.readFileAsync = promisify(fs.readFile);

const path = process.argv[2];    // first user supplied argument


fs.readFileAsync(path, 'utf8').then(
	data => {
		let config = JSON.parse(data);
		testConnection2(config)
	},
	error => {
		console.error(error);
	}
);

async function testConnection(config) {
	const client = new Client(config);
	await client.connect();
	const res = await client.query('SELECT NOW()');
	print(res);
}

function testConnection2(config) {
	const client = new Client(config);
	client.connect();
	let q = client.query('SELECT NOW()');

	q.then(data => print(data)).catch(err => console.error(err));
}

//
// pool.query("SELECT NOW()", (err, res) => {
// 	console.log(err, res);
// 	pool.end();
// });