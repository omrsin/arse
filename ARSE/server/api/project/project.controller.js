'use strict';

var _ = require('lodash');
var Project = require('./project.model');

// Get list of projects
exports.index = function(req, res) {
  Project.find(function (err, projects) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(projects);
  });
};

// Get a single project
exports.show = function(req, res) {
  // Project.findById(req.params.id, function (err, project) {
  //   if(err) { return handleError(res, err); }
  //   if(!project) { return res.status(404).send('Not Found'); }
  //   return res.json(project);
  // });
  
  Project.findOne({_id: req.params.id}).populate('backlog').exec(function (err, project){
    if(err) { return handleError(res, err); }
    if(!project) { return res.status(404).send('Not Found'); }
    return res.json(project);
  });
  
};

// Creates a new project in the DB.
exports.create = function(req, res) {
  if(!req.body.name || !req.body.description) {
    return res.status(500).send("Please specify name and description");
  }
  Project.create(req.body, function(err, project) {

    if(err) { return handleError(res, err); }
    return res.status(201).json(project);
  });
};

// Updates an existing project in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if(!project) { return res.status(404).send('Not Found'); }
    var updated = _.merge(project, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(project);
    });
  });
};

// Deletes a project from the DB.
exports.destroy = function(req, res) {
  Project.findById(req.params.id, function (err, project) {
    if(err) { return handleError(res, err); }
    if(!project) { return res.status(404).send('Not Found'); }
    project.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}