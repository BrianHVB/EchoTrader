const appRoot = require('app-root-path');

const chai = require('chai');
const expect = require('chai').expect;
require('chai').should();
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);

const superTest = require('supertest');
const app = require('./../app');

const dbConnection = require(`${appRoot}/lib/dbConnection`);


let request;
let server;

before(function(done) {
	server = app.listen(done);
	request = superTest.agent(server);
});

after(function(done) {
	dbConnection.close()
	server.close(done);
});


describe('routes/api.js', function() {
	describe('general', function() {
		it('true should return true', function() {
			true.should.be.true;
		})
	});

	describe('#get_newest', function() {
		it('should return 1 record, when called with no query string', function(done) {
			request.get('/api/get_newest/gdax_btc_usd/')
				.expect(200)
				.expect(res => {
					let count = res.body.count;
					let data = res.body.data;

					expect(count).equals(1);
					data.length.should.equal(count);
				})
				.end(function(err, res) {
					if (err) {
						return done(err);
					}
					done();
				});
		});

		it('should return 1 record when called with no query string', function() {
			return request
				.get('/api/get_newest/gdax_btc_usd/')
				.set('Accept', 'application/json')
				.expect(200)
				.expect(response => {
					const data = response.body.data;
					const count = response.body.count;

					count.should.equal(1, '1 record should be returned');
					data.length.should.equal(count);
				})
				.should.be.fulfilled;

		});

		it('should return an object with the correct keys when called with a query string of 1', function() {
			 return request
				 .get('/api/get_newest/gdax_btc_usd')
				 .query({num: 1})
				 .expect(200)
				 .expect(res => {
				 	res.body.count.should.equal(1);
					res.body.data[0].should.be.an('object').that.includes.all
						.keys('id', 'time', 'market', 'open', 'high', 'low', 'close',
							   'volume_in', 'volume_out', 'total_trades','time_open', 'time_close')
				 })
				 .should.be.fulfilled;
		});

		it('should return a response code of 400 and an appropriate message when an invalid market name is passed as a parameter', function() {
			let badMarket = 'bleep';

			return request
				.get(`/api/get_newest/${badMarket}`)
				.expect(400)
				.expect(res => {
					res.body.message.should.include('not a valid market');
				})
				.should.be.fulfilled;
		})

	});
});
