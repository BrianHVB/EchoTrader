const chai = require('chai');
const expect = require('chai').expect;
const should = require('chai').should();
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

const DataInterface = require('../lib/MarketDatabaseInterface');

let di;

before(function() {
	let marketConfig = {
		exchange: 'GDAX',
		currency: 'BTC',
		baseCurrency: 'USD'
	};

	di = new DataInterface('GDAX', marketConfig);
});

after(function() {
	di.close();
});


describe('Read market data', function() {

	describe('Utility tests', function() {
		it('getDatabaseTime() should return the correct hours and minutes', function() {
			di.getDatabaseTime().then(result => {
				let dbTime = new Date(result);
				let localTime = new Date();

				return (dbTime.getUTCHours() === localTime.getUTCHours()
							&& dbTime.getUTCMinutes() === localTime.getUTCMinutes())
			}).should.eventually.be.true;
		})
	});

	describe('#getLatestRecordByTimeClose()', function() {
		it('should return a record with the same id as getLastId()', function() {

			let testEqual = async function() {
				let lastRecord = await di.getNewestRecordByTimeClose();
				let lastId = await di.getLastId();

				return lastRecord.id === lastId;
			};

			return testEqual().should.eventually.be.true;
		})
	});

	describe(`#getNewestRecords()`, function() {

		it('should return 100 records when one hundred records are requested', function() {
			let targetNum = 100;
			return di.getNewestRecords(targetNum).then(res => res.length).should.eventually.equal(targetNum);
		});

		it ('should return the 1 newest record when no number is specified', function() {

			let checkEqual = async function() {
				let noParamResult = await di.getNewestRecords();
				let lastId = await di.getLastId();

				return noParamResult[0].id === lastId;
			};

			return checkEqual().should.eventually.be.true;

		})

	})
});


