'use strict';

var should = require('should');
var app = require('../../app');
var request = require('supertest');
var config = require('../../config/environment/test.js');

var proxyquire = require('proxyquire').noPreserveCache();
var chai = require("chai");
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.should();
chai.use(sinonChai);

var db = require("mongoose");
var projectModel = db.model('Project');

describe('Project API:', function() {

  beforeEach(function(done) {    
    projectModel.remove({}, function(){});  
    return done();
  });

  describe('GET /api/projects', function() {
    it('should respond with JSON array', function(done) {
      request(app)
        .get('/api/projects')
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) return done(err);
          res.body.should.be.instanceof(Array);
          done();
        });
    });
  });

  describe('POST /api/projects', function() {
    describe('Successful scenarios', function() {
      it('should respond with an object with same name and description', function(done) {
        request(app)
          .post('/api/projects')
          .send({ name: 'MyProj', description: 'Fancy' })
          .set('Content-Type', 'application/json')
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);
            res.body.name.should.equal('MyProj');
            res.body.description.should.equal('Fancy');
            done();
          });
      });

      it('should increment the number of projects by one', function(done){
        request(app)
          .post('/api/projects')
          .send({ name: 'MyProj', description: 'Fancy' })
          .set('Content-Type', 'application/json')
          .expect(201)
          .expect('Content-Type', /json/)
          .end(function(err, res) {
            if (err) return done(err);            
            projectModel.find({}).should.eventually.have.length(1);              
            done();
          });  
      });
    });
    
    describe('Failure scenarios', function() { 
      it('should not accept empty body', function(done) {
        request(app)
          .post('/api/projects')
          .set('Content-Type', 'application/json')
          .expect(500)
          .end(function(err, res) {
            if (err) return done(err);
            done();
          });
      });

      it('should not accept a project without a name', function (done) {
        request(app)
          .post('/api/projects')
          .send({name: '', description:'noname'})
          .set('Content-Type', 'application/json')
          .expect(500)
          .end(function(err, res){
            if (err) return done(err);
            done();
          });
      });

      it('should not accept a project without a description', function (done){
        request(app)
          .post('/api/projects')
          .send({name: 'nodescription', description:''})
          .set('Content-Type', 'application/json')
          .expect(500)
          .end(function(err, res){
            if (err) return done(err);
            done();
          });
      });
    });
  });

});