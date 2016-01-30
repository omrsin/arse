'use strict';

var _ = require('lodash');
var Configuration = require('./configuration.model');

// Get list of configurations
exports.index = function(req, res) {
  Configuration.find(function (err, configurations) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(configurations);
  });
};

// Get a single configuration
exports.show = function(req, res) {
  Configuration.findById(req.params.id, function (err, configuration) {
    if(err) { return handleError(res, err); }
    if(!configuration) { return res.status(404).send('Not Found'); }
    return res.json(configuration);
  });
};

// Creates a new configuration in the DB.
exports.create = function(req, res) {
  Configuration.create(req.body, function(err, configuration) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(configuration);
  });
};

// Updates an existing configuration in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Configuration.findById(req.params.id, function (err, configuration) {
    if (err) { return handleError(res, err); }
    if(!configuration) { return res.status(404).send('Not Found'); }
    var updated = _.merge(configuration, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(configuration);
    });
  });
};

// Deletes a configuration from the DB.
exports.destroy = function(req, res) {
  Configuration.findById(req.params.id, function (err, configuration) {
    if(err) { return handleError(res, err); }
    if(!configuration) { return res.status(404).send('Not Found'); }
    configuration.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}