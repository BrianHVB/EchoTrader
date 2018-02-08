const assert = require('assert');
let add = require("../src/index.js");

describe('index functions', () => {
	describe('#add()', function() {
		it("should equal 8", () => {
			assert.equal(add(3, 5), 8);
		});

		it("should equal 0", function() {
			assert.equal(add(0, -0), 0);
		});
	})
});