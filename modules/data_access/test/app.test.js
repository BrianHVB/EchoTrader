// testing framework imports
const expect = require('chai').expect;
const should = require('chai').should();
const decache = require('decache');

// app and lib imports
decache('../app');
const app = require('../app');

describe('App', function() {
	describe('private functions', function() {
		it('should be in uppercase', function() {
			app.prv.toUpper('hello').should.equal('HELLO');
		})
	});

	describe('public functions', function() {
		it ('should echo back in uppercase', function() {
			app.echo('abc').should.equal('ABC');
		})
	})
});