const chai = require('chai');
const expect = require('chai').expect;
require('chai').should();
const chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

describe('app.js', function() {
	describe('general', function() {
		it('true should return true', function() {
			true.should.be.true;
		})
	})
});