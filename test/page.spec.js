var Page = require("../models").Page;
var chai = require('chai');
var expect = chai.expect;
chai.should();
chai.use(require('chai-things'));
var spies = require("chai-spies");
chai.use(spies);

describe("methods", function(){
	describe("computeUrlName", function(){
		it("computes a url name from a title with only [A-Za-z0-9_]", function(){
			var p = new Page({title: 'Single_title', body: 'Hey'});
			p.computeUrlName();
			expect(p.url_name).to.equal("Single_title");
		});
		it("computes a correct url name from a title with other characters", function(){
			var p = new Page({title: 'Single-title !@#a', body: 'Hey'});
			p.computeUrlName();
			expect(p.url_name).to.equal("Single_title____a");
		});
	});
	describe("getSimilar", function(){
		var p;
		beforeEach(function(done){
			Page.create({title: 'Single_title1', body: 'Hey', tags: ['fullstack', 'academy']})
			.then(function(result){
				p = result;
				Page.create({title: 'Single_title2', body: 'Hey', tags: ['fullstack', 'dog']});
			})
			.then(function(){
				Page.create({title: 'Single_title3', body: 'Hey', tags: ['boop', 'moop']});
			})
			.then(function(){
				done();
			});	
		});
		it("should never get itself", function(done){	
			p.getSimilar(function(err, result){
				result.should.not.contain.a.thing.with.property({_id: p._id});
				done();
			})
		});
		it("finds pages with any shared tag", function(done){
			p.getSimilar(function(err, results){
				results.forEach(function(page) {
					page.tags.should.include('fullstack');
				});
				done();
			})
		});
		// xit("shouldn't find pages without any shared tags", function(){
		// 	p.getSimilar(function(err, results){
		// 		results.forEach(function(page) {
		// 			page.tags.should.not.include('fullstack');
		// 		});
		// 		done();
		// 	})
		// });
	});

});

describe("validations", function(){
	var p;
	beforeEach(function(){
		p = new Page();
	});
	it("should err without title", function(done){
		p.body = "hello";
		p.validate(function(err) {
			expect(err.errors).to.have.property("title");
			done();
		});
		
	});
	it("should err with an empty title '' ", function(done){
		p.title = "";
		p.body = "hello";
		var title = p.save(function(err) {
			expect(err.errors).to.have.property("title");
			done();
		})
		
	});
	it("should err without body", function(done){
		p.title = "Title";
		p.save(function(err) {
			expect(err.errors).to.have.property("body");
			done()
		})
		
	});
});

describe("statics", function(){
	describe("findByTag", function(){
		beforeEach(function(done){
			Page.create({
				title: "Test1", url_name: "Test_1",
			 	owner_id:"ab", body: "test body", tags: ["tag1", "tag2", "tag3"]
			}, done);
		});
		it("finds an array of pages with the search tag", function(done){
			Page.findByTag("tag2", function(err, result){
				expect(result).to.be.an("array");
				done();
			});
		});
		it("shouldn't find pages without the search tag", function(done){
			Page.findByTag("tag4", function(err, result){
				expect(result).to.be.empty;
				done();
			});
		});
	});
});

describe("hooks", function(){
	describe("save", function(){
		it("computes the url name before saving", function(){
			var p = new Page({title: 'New title', body: 'Hellooo'});
			 computeUrlSpy = chai.spy(p.computeUrlName);
			 p.save();
			 expect(computeUrlSpy).to.have.been.called;
		});
	});
});

describe("virtuals", function(){
	describe("full_route", function(){
		it("returns full_route: /wiki/ + url_name", function(){
			var p = new Page({title: 'This title', body: 'Hello'})
			p.computeUrlName();
			expect(p.full_route).to.equal('/wiki/This_title');
		});
	});
});