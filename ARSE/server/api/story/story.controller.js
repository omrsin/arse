'use strict';

var _ = require('lodash');
var Story = require('./story.model');
var Project = require('../project/project.model');

// Get list of storys
exports.index = function(req, res) {
  Story.find(function (err, storys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(storys);
  });
};

// Get a single story
exports.show = function(req, res) {
  Story.findOne({'_id': req.params.id},function(err, story){
      if(err) { return handleError(res, err); }
      if(!story) { return res.status(404).send('Not Found'); }

      return res.json(story);
    });
};

// Creates a new story in the DB.
exports.create = function(req, res) {
  Story.create(req.body, function(err, story) {
    //TODO:: remember to pass project id in project field of story
    if(err) { return handleError(res, err); }
    Project.findById(req.params.project_id, function (project_find_error, project) {
      if(project_find_error) { return handleError(res, project_find_error); }
      project.backlog.push(story);
      project.save(function (error_on_save) {
        if(error_on_save) { return handleError(res,error_on_save); }
      });
    });
    return res.status(201).json(story);
  });
};

// Updates an existing story in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Story.findById(req.params.id, function (err, story) {
    if (err) { return handleError(res, err); }
    if(!story) { return res.status(404).send('Not Found'); }
    var updated = _.merge(story, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(story);
    });
  });
};

// Deletes a story from the DB.
// needs to propagate the deletion to the project.
// TODO need to revise and make it functional
exports.destroy = function(req, res) {
  Project.findById(req.params.project_id, function (project_find_error, project) {
    if(project_find_error) { return handleError(res, project_find_error); }
    Story.findById(req.params.id, function(story_find_error, story) {
      if(story_find_error) { return handleError(res, story_find_error); }
      if(!story) { return res.status(404).send('Not Found'); }
      project.backlog.pull(story);
      story.remove(function(err){
        if(err) { return handleError(res,err); }
        project.save(function (error_on_project_save) {
          if(error_on_project_save) { return handleError(res,error_on_project_save); }
          return res.status(204).send('No Content');
        });
      });
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
