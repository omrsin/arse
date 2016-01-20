'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TaskSchema = new Schema({
  name: { 
    type: String,
    required: true
    },
  description: { 
    type: String,
    required: true
  },  
  status: {
    type: String,
    required: true,
    enum: ["New", "In progress", "Done"],
    default: "New"
  }    
});    

var StorySchema = new Schema({
  name: { 
    type: String,
    required: true
    },
  description: { 
    type: String,
    required: true
    },
  project: {
    type: Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ["Feature", "Enhancement", "Fix"]
  },
  status: {
    type: String,
    required: true,
    enum: ["New", "In progress", "Done"],
    default: "New"
  },
  points: {
    type: Number
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  tasks: [TaskSchema],
  created_at: Date,
  updated_at: Date
}, {strict: false});

module.exports = mongoose.model('Story', StorySchema);
