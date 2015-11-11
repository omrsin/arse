'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');

describe('Story API', function () {

  describe('GET /api/stories', function () {
    it('should respond with JSON array', function (done) {
      request(app)
        .get('/api/stories')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function (err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('POST /api/stories', function () {
    it('should respont with an object that represents a story and it should', function (done) {
      request(app)
        .post("/api/stories")
        .send({
          name: "TestStory",
          description: "String2",
          project: "563a2b327947c0cd2c3d7c2b"
        })
        .set('Content-Type', 'application/json')
        .expect(201)
        .expect('Content-Type', /json/)
        .end(function(err,res){
          if(err) return done(err);
          res.body.name.should.equal('TestStory');
          res.body.project.should.equal('563a2b327947c0cd2c3d7c2b');
          res.body.description.should.equal('String2');
          done();
        });
    });
    
    it('should not accept empty body', function(done) {
      request(app)
      .post('/api/stories')
      .set('Content-Type', 'application/json')
      .expect(500)
      .end(function(err, res) {
        if (err) return done(err);
        done();
      });
    });
  });

  describe('GET /api/projects/project_id', function(){
    it('should respond with a JSON array', function(done){
      request(app)
      .get('/api/projects/563a16a77dfdb43e4d53efa7')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function(err, res){
        if(err) return done(err);
        res.body.should.be.instanceof(Array);
        done();
      });
    });
  });
  
  

});