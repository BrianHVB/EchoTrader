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
		it('Constructed object should have a SignalDatabase entry for each Postgres configuration in config', function() {
			let numberOfConfigurations = config.postgres.configurations.length ;

			bridge.signalTableMap.size.should.equal(numberOfConfigurations);
		})
	});

	describe('connection', function() {
		it('should connect without error', function() {
			bridge.connectAndSubscribe();
		})
	})

});