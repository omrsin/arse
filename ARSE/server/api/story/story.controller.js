'use strict';

var _ = require('lodash');
var Story = require('./story.model');

// Get list of storys
exports.index = function(req, res) {
  Story.find(function (err, storys) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(storys);
  });
};

// Get a single story
exports.show = function(req, res) {
  Story.findOne({'_id': req.params.id})
    .populate('project')
    .exec(function(err, story){
      if(err) { return handleError(res, err); }
      if(!story) { return res.status(404).send('Not Found'); }

      return res.json(story);
    });
};

// Creates a new story in the DB.
exports.create = function(req, res) {
  Story.create(req.body, function(err, story) {
    if(err) { return handleError(res, err); }
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
exports.destroy = function(req, res) {
  Story.findById(req.params.id, function (err, story) {
    if(err) { return handleError(res, err); }
    if(!story) { return res.status(404).send('Not Found'); }
    story.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}
