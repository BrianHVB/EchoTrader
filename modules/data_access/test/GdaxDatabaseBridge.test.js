// testing framework imports
const chai = require('chai');
const expect = require('chai').expect;
const should = require('chai').should();
const decache = require('decache');
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
chai.use(require('chai-things'));

// app and lib imports
const GdaxDatabaseBridge = require('../GdaxDatabaseBridge');
const config = require('../config');

// globals
let bridge;

before(function() {
	bridge = new GdaxDatabaseBridge();
});

after(function() {

});

describe('GdaxDatabaseBridge', function() {

	describe('#constructor', function() {
		it('Constructed object should have a MarketDatabaseInterface for each Postgres configuration in config', function() {
			let numberOfConfigurations = Object.keys(config.postgres.configurations).length ;
			[...bridge.databaseInterfaces.values()].should.all.exist;
			bridge.databaseInterfaces.size.should.equal(numberOfConfigurations);
		})
	});

});