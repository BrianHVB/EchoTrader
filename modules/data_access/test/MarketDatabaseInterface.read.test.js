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

	describe('#getLastId()', function() {
		it('should return the ID of the record with the newest time', function() {
			di.getLastId().should.eventaully.be(52191);
		})
	})
});


