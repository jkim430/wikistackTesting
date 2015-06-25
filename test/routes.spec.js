var supertest = require('supertest');
var app = require('../app');
var agent = supertest(app);
var expect = require('chai').expect;
var Page = require("../models").Page;

describe('http requests', function() {
	before(function(done){
		Page.find().remove(function(){
			Page.create({title: "page", body: "page", url_name: "page", tags: ["test"]})
			.then(function(result){
				done();
			});
		});
    });


    describe('GET /', function() {
        it('should get 200 on index', function(done) {
        	agent
          .get('/')
          .expect(200, done)
        })
    })

    describe('GET /wiki/:title', function() {
        it('should get 404 on page that doesnt exist', function(done) {
        	agent
          .get('/wiki/nopage')
          .expect(404, done)
        })
        it('should get 200 on page that does exist', function(done) {
        	agent
          .get('/wiki/page')
          .expect(200, done)
        })
    })

    describe('GET /wiki/tags/:tag', function() {
        it('should get 200', function(done) {
        	agent
          .get('/wiki/tags/test')
          .expect(200, done)
        })
    })

    describe('GET /wiki/:title/similar', function() {
        it('should get 404 for page that doesn\'t exist', function(done) {
        	agent
          .get('/wiki/nopage/similar')
          .expect(404, done)
        })
        it('should get 200 for similar page', function(done) {
        	agent
          .get('/wiki/page/similar')
          .expect(200, done)
        })
    })

    describe('GET /wiki/:title/edit', function() {
        it('should get 404 for page that doesn\'t exist', function(done) {
        	agent
          .get('/wiki/nopage/edit')
          .expect(404, done)
        })
        it('should get 200 for similar page', function(done) {
        	agent
          .get('/wiki/page/edit')
          .expect(200, done)
        })
    })

    describe('GET /add', function() {
        it('should get 200', function(done) {
        	agent
          .get('/add')
          .expect(200, done)
        })
    })

    describe('POST /wiki/:title/edit', function() {
        it('should get 404 for page that doesn\'t exist', function(done) {
        	agent
          .get('/wiki/nopage/edit')
          .expect(404, done)
        })
        it('should update db', function(done) {
        	agent
          .post('/wiki/page/edit')
          .send({title: "page", body: "page", tags: "gat"})
          .end(function(){
          	agent.get("/wiki/page")
          	.expect(200, done)
          });
        })
    })

    describe('POST /add/submit', function() {
        it('should create in db', function(done) {
        	agent
          .post('/add/submit')
          .send({title: "newTestt", body: "newTest2", tags: "gat"})
          .end(function(){
          	agent.get("/wiki/newTestt")
          	.expect(200, done)
          });
        })
    })

})