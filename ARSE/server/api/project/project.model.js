'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: String,
  description: String,
  stories: [{
    type: Schema.Types.ObjectId,
    ref: 'Story'
  }]
});

module.exports = mongoose.model('Project', ProjectSchema);
