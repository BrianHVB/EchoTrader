const chai = require('chai');
const expect = require('chai').expect;
require('chai').should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const request = require('supertest');

const app = require('./../app');

describe('routes/api.js', function() {
	describe('general', function() {
		it('true should return true', function() {
			true.should.be.true;
		})
	});

	describe('#get_newest', function(done) {
		it('should return 1 record, when called with no query string', function() {
			request(app)
				.get('/api/get_newest/gdax_btc_usds/')
				.expect(200)
				.end(function(err, res) {
					if (err) {
						return done(err);
					}
					done();
				});
		});

		it('test', function(done) {
			request(app)
				.get('/api/get_newest/gdax_btc_usd')
				.expect(200)
				.end(function(err, res) {
					if (err) {
						return done(err);
					}
					done();
				})
		})

	});
});
