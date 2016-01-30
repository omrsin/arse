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
    ref: 'Sprint',
    default: null
  },
  offset: {
    type: Number, 
    default:0
  },
  sprint_counter: {
    type: Number,
    default:0
  },
  story_types: {
    type: [String],
    default: ["Feature", "Enhancement", "Fix"]
  },
  participants: ['Participant']
}, {strict: false});
ProjectSchema.index({'participants':1})

module.exports = mongoose.model('Project', ProjectSchema);
