var chai = require("chai");
var expect = chai.expect;
var spies = require("chai-spies");
chai.use(spies);


describe("+", function(){

	it("adds 2 + 2", function(){
		expect(2 + 2).to.equal(4);	
	});

});

describe("set timeout / async", function(){

	it("sets a timeout and waits", function(done){
		var start = new Date();
		setTimeout(function(){
			var duration = new Date() - start;
			expect(duration).to.be.closeTo(1000, 50);
			done();
		}, 1000);
	});

});

describe("spies", function(){
	it("counts forEach cycles", function(){
		var nothing = function(){
			return true;
		};
		var nothingSpy = chai.spy(nothing);
		[1,2,3,4,5].forEach(nothingSpy);
		expect(nothingSpy).to.have.been.called.exactly(5);
	})
});