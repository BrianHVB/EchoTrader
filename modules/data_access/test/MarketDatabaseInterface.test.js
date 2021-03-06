// testing framework imports
const chai = require('chai');
const expect = require('chai').expect;
const should = require('chai').should();
const decache = require('decache');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

// app and lib imports
const DataInterface = require('../lib/MarketDatabaseInterface');

// setup
let dataInt;
let testRecord;

let testTable = 'gdax_test';

before(function() {

	let marketConfig = {
		exchange: 'TEST',
		currency: 'TEST',
		baseCurrency: 'TEST'
	};

	dataInt = new DataInterface('GDAX', marketConfig);

	testRecord = {
		'market': 'TEST',
		'time': new Date(Date.now()).toISOString(),
		'last_trade_id': 0,
		'time_open': new Date(Date.now() - 50000).toISOString(),
		'time_close': new Date(Date.now() - 50000).toISOString(),
		'open': 12.002,
		'high': 51.8,
		'low': 10.2,
		'close': 25.2,
		'volume_in': 38.2,
		'volume_out': 40.3,
		'total_trades': 10
	}
});

after(function() {
	dataInt.close();
});



describe('DataInterface', function() {

	describe('Construction', function() {
		it('should have the passed in name', function() {
			let myDataInt = new DataInterface('GDAX');
			myDataInt.name.should.equal('GDAX');
		});

		it('should have an empty name when no parameter is passed', function() {
			let dataInt = new DataInterface();
			expect(dataInt.name).to.equal("");
		});

		it('should throw an error when an invalid market configuration is provided', function() {

			let invalidMarketConfig = {foo: 'bar'};

			function badConstructorCall() {
				return new DataInterface('TEST', invalidMarketConfig);
			}

			expect(badConstructorCall).to.throw("Construction Error");
		});

	});

	describe('Utility', function() {
		it ('getDatabaseTime() should be within 2 seconds of local time', function() {
			let localTime = Date.now();

			let res = dataInt.getDatabaseTime();

			return res.then(data => {
				return Math.abs(localTime - Date.parse(data));
			}).catch(err => console.error(err)
			).should.eventually.be.within(0, 2000);
		});

		it ('buildInsertTemplate() should return an object with as many values as the test record', function() {
			let result = DataInterface.buildInsertTemplate(testRecord);

			let entriesInTestRecord = Object.entries(testRecord).length;

			result.values.length.should.equal(entriesInTestRecord);

		});

	});

	describe('gdax schema', function() {
		describe("#getPrimaryKeyColumnName()", function() {
			it ('should identify the primary key field in the testTable table', function() {
				let queryResult = dataInt.getPrimaryKeyColumnName(testTable);

				return queryResult.should.eventually.equal('id');

			});
		});

		// describe('#getInsertionObj()', function() {
		// 	it ('should identify all of the fields in the gdax table that accept values on insertion', function() {
		// 		let fields = dataInt.getInsertionObj(testTable);
		//
		// 		return fields.should.eventually.include.all.keys(
		// 			'market', 'time', 'open', 'high', 'low', 'close',
		// 			'volume_in', 'volume_out', 'last_trade_id', 'total_trades',
		// 			'time_open', 'time_close');
		// 	})
		// });

	});

	describe('gdax insert', function() {
		describe('#buildInsertQuery()', function() {
			it(`should throw an error when the provided table doesn't exist`, function() {
				let invalidTable = 'foobar';

				let result = dataInt.buildInsertQuery(testRecord, invalidTable);

				result.should.eventually.be.rejectedWith(`Insert Error: Table ${invalidTable} doesn't exist`);
			});

			it(`should throw an error when a record key doesn't match any columns in the table`, function() {
				let tableName = testTable;
				let invalidColumn = 'foobar';

				let testRecord2 = Object.assign({}, testRecord);
				testRecord2[invalidColumn] = 'test data';

				let result = dataInt.buildInsertQuery(testRecord2, testTable);

				testRecord2.should.include({[invalidColumn]: 'test data'});

				return result.should.be.rejectedWith(
					`Insert Error: Object property ['${invalidColumn}'] does not correspond to a column in table '${tableName}'`);
			});

			it('should return a values object that has the same number of entries as columns in the query', function() {

				let numberOfKeys = Object.entries(testRecord).length;

				let result = dataInt.buildInsertQuery(testRecord, testTable);

				return result.then(data => {
					let {query, values} = data;
					let wordsFollowedByAComma = /[a-zA-Z]\w*[,)]/g;
					let matchingWordList = query.match(wordsFollowedByAComma);

					return matchingWordList ? (matchingWordList.length) : 0;

				}).should.eventually.equal(numberOfKeys);
			});


		});

		describe('#insert()', function() {
			it('insert() should insert the test record and return a numeric id', function() {

				let result = dataInt.insert(testRecord);

				return result.then(data => Number(data)).should.eventually.be.a('number');
			})
		});
	});

	describe("read from database", function() {

		describe('#isTable()', function() {
			it('should return false when the table does not exist', function() {
				let fakeTable = 'foo';
				return dataInt.isTable(fakeTable).should.eventually.be.false;
			});

			it('should return true when the table does not exist', function() {
				let realTable = testTable;
				return dataInt.isTable(realTable).should.eventually.be.true;
			})
		});

		describe('#getRecordById()', function() {
			it('should create a test record, then get the same record using the id', function() {
				let rtnRecordId = 0;
				return dataInt.insert(testRecord)
					.then(recordId => {
						rtnRecordId = recordId;
						return dataInt.getRecordById(recordId);
					})
					.then(record => {
						return record.id.should.equal(rtnRecordId);
					})

			});

			it('should throw an error when an invalid table is provided', function() {
				let invalidName = 'foo';
				return dataInt.getRecordById(0, invalidName).should.be.rejected;
			})
		});

		describe('#getRecordsBetweenTime()', function() {
			it('should mark time, create three records, end time, then return the three', function() {
				const tableName = testTable;
				const milisecondDelay = 200;
				let start = new Date(Date.now()).toISOString();
				let insertions = [];

				// Immediately creates three promises and inserts them into list
				// Each promise contains a nested promise that will be the eventual result of the record insertion.
				// These sub-promises are created using a timer
				for (let i = 1; i <= 3; i++) {
					insertions.push(new Promise(resolve => {
						let recordCopy = Object.assign({}, testRecord);
						recordCopy.time = new Date(Date.now()).toISOString();
						setTimeout(() => resolve(dataInt.insert(recordCopy)), milisecondDelay * i)
					}))
				}

				async function getNumRecordsReturned(){
					await Promise.all(insertions);
					let end = new Date(Date.now()).toISOString();

					let rows = await dataInt.getRecordsBetweenTime(start, end);
					return rows.length;
				}

				return getNumRecordsReturned().should.eventually.equal(3);

			})
		});

		describe('#getRecordsSinceTime()', function() {
			it('should create 3 records with an artificial time, ' +
				'then return two of those records', function () {
				let mark = Date.now();
				let insertions = [];

				for (let i = 1; i <= 3; i++) {
					let testCopy = Object.assign({}, testRecord);
					testCopy.time = new Date(mark + i * 1000).toISOString();
					let promiseFromInsert = dataInt.insert(testCopy);
					insertions.push(promiseFromInsert)
				}

				return Promise.all(insertions)
					.then(() => dataInt.getRecordsSinceTime(new Date(mark + 1001).toISOString()))
					.then(rows => rows.length)
					.should.eventually.equal(2);
			})
		});

		describe('#getRecordsSinceId()', function() {
			it('should create 4 records, then use the id of the first record to return the 4', function() {
				const tableName = testTable;

				let insertions = [];

				insertions[0] = dataInt.insert(testRecord);
				for (let i = 1; i <= 3; i++) {
					insertions[i] = dataInt.insert(testRecord);
				}


				// async function getResults() {
				// 	let results = await Promise.all(insertions);
				// 	let minId = Math.min(...results);
				// 	let query = await dataInt.getRecordsSinceId(tableName, minId);
				//
				// 	console.log(query.length);
				//
				// 	return query.length;
				// }
				// return getResults().should.eventually.equal(4);

				let results = Promise.all(insertions)
					.then(completed => Math.min(...completed))
					.then(minId => dataInt.getRecordsSinceId(minId))
					.then(rows => rows.length);

				return results.should.eventually.equal(4);

			})
		})
	})


});





