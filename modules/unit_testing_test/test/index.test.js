const assert = require('assert');
const should = require('chai').should();
const expect = require('chai').expect;

let add = require("../src/index.js");

describe('index functions', () => {
	describe('#add()', function() {
		it("should equal 8", () => {
			add(3, 5).should.equal(8);
		});

		it("should equal 0", function() {
			expect(add(0, 0)).to.equal(0);
		});
	})
});

describe('some sample tests using chai', function() {
	it("multiply(3, 5) is pending");

	it("basic tests", function() {

		"3".should.be.a('string');

		Number(3).should.be.a('number');


		[3, 5].should.not.be.empty;
		(new Map([['abc', 3]])).should.contain(3);

	})
});