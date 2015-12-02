'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ProjectSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  backlog: [{
    type: Schema.Types.ObjectId,
    ref: 'Story'
  }],
  current_sprint: {
    type: Schema.Types.ObjectId,
    ref: 'Sprint'
  },
  offset: {
    type: Number, 
    default:0
  },
  sprint_counter: {
    type: Number,
    default:0
  }
});

module.exports = mongoose.model('Project', ProjectSchema);
