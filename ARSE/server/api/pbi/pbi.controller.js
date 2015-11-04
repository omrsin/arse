'use strict';

var _ = require('lodash');
var Pbi = require('./pbi.model');

// Get list of pbis
exports.index = function(req, res) {
  Pbi.find(function (err, pbis) {
    if(err) { return handleError(res, err); }
    return res.status(200).json(pbis);
  });
};

// Get a single pbi
exports.show = function(req, res) {
  Pbi.findById(req.params.id, function (err, pbi) {
    if(err) { return handleError(res, err); }
    if(!pbi) { return res.status(404).send('Not Found'); }
    return res.json(pbi);
  });
};

// Creates a new pbi in the DB.
exports.create = function(req, res) {
  Pbi.create(req.body, function(err, pbi) {
    if(err) { return handleError(res, err); }
    return res.status(201).json(pbi);
  });
};

// Updates an existing pbi in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Pbi.findById(req.params.id, function (err, pbi) {
    if (err) { return handleError(res, err); }
    if(!pbi) { return res.status(404).send('Not Found'); }
    var updated = _.merge(pbi, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(pbi);
    });
  });
};

// Deletes a pbi from the DB.
exports.destroy = function(req, res) {
  Pbi.findById(req.params.id, function (err, pbi) {
    if(err) { return handleError(res, err); }
    if(!pbi) { return res.status(404).send('Not Found'); }
    pbi.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}