// testing framework imports
const chai = require('chai');
const expect = require('chai').expect;
const should = require('chai').should();
const decache = require('decache');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

// app and lib imports
const DataInterface = require('../lib/DataInterface');

// setup
let dataInt;
let testRecord;

before(function() {
	dataInt = new DataInterface('GDAX');

	testRecord = {
		'exchange': 'TEST',
		'currency': 'BTC',
		'base_currency': 'USD',
		'time': new Date(Date.now()),
		'last_trade_id': 0,
		'last_trade_time': new Date(Date.now() - 50000),
		'last_trade_side': 'buy',
		'last_trade_price': 32.34,
		'last_trade_volume': 0.002,
		'low': 10.2,
		'high': 51.8,
		'average': 25.2,
		'total_volume': 38.2,
		'average_volume': 40.3
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
		it ('should have an empty name when no parameter is passed', function() {
			let dataInt = new DataInterface();
			expect(dataInt.name).to.equal("");
		})
	});

	describe('Utility', function() {
		it ('getDatabaseTime() should be within 1 second of local time', function() {
			let localTime = Date.now();

			let res = dataInt.getDatabaseTime();

			return res.then(data => {
				return Math.abs(localTime - Date.parse(data));
			}).catch(err => console.error(err)
			).should.eventually.be.within(0, 1000);
		});

		it ('buildInsertTemplate() should return an object with as many values as the test record', function() {
			let result = DataInterface.buildInsertTemplate(testRecord);

			let entriesInTestRecord = Object.entries(testRecord).length;

			result.values.length.should.equal(entriesInTestRecord);

		});



	});

	describe('gdax schema', function() {
		it ('should identify the primary key field in the gdax_basic table', function() {
			let queryResult = dataInt.getPrimaryKeyColumnName('gdax_basic');

			return queryResult.should.eventually.equal('id');

		});

		it ('should identify all of the fields in the gdax table that accept values on insertion', function() {
			let fields = dataInt.getInsertionObj('gdax_basic');

			return fields.should.eventually.include.all.keys(
				'average', 'average_volume', 'base_currency', 'currency', 'exchange', 'high',
				'last_trade_id', 'last_trade_price', 'last_trade_side', 'last_trade_time', 'last_trade_volume',
				'low', 'time', 'total_volume');
		})
	});

	describe('gdax insert', function() {

		it(`buildInsertQuery() should throw an error when the provided table doesn't exist`, function() {
			let invalidTable = 'foobar';

			let result = dataInt.buildInsertQuery(invalidTable, testRecord);

			result.should.eventually.be.rejectedWith(`Insert Error: Table ${invalidTable} doesn't exist`);
		});

		it(`buildInsertQuery() should throw an error when a record key doesn't match any columns in the table`, function() {
			let tableName = 'gdax_basic';
			let invalidColumn = 'foobar';

			let testRecord2 = Object.assign({}, testRecord);
			testRecord2[invalidColumn] = 'test data';


			let result = dataInt.buildInsertQuery('gdax_basic', testRecord2);

			testRecord2.should.include({[invalidColumn]: 'test data'});

			return result.should.be.rejectedWith(
				`Insert Error: Object property ['${invalidColumn}'] does not correspond to a column in table '${tableName}'`);
		});

		it('buildInsertQuery() should return a values object that has the same number of entries as columns in the query', function() {

			let numberOfKeys = Object.entries(testRecord).length;

			let result = dataInt.buildInsertQuery('gdax_basic', testRecord);

			return result.then(data => {
				let {query, values} = data;
				let wordsFollowedByAComma = /[a-zA-Z]\w*[,)]/g;
				let matchingWordList = query.match(wordsFollowedByAComma);

				return matchingWordList ? (matchingWordList.length) : 0;

			}).should.eventually.equal(numberOfKeys);



		});


		it('insert() should insert the test record and return a numeric id', function() {

			let result = dataInt.insert('gdax_basic', testRecord);

			//return result.then(data => console.log(data));
			return result.then(data => Number(data)).should.eventually.be.a('number');
		})
	})


});





