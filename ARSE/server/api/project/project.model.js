'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  stories: [{
    type: Schema.Types.ObjectId,
    ref: 'Story'
  }]
});

module.exports = mongoose.model('Project', ProjectSchema);
