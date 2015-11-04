'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PbiSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Pbi', PbiSchema);