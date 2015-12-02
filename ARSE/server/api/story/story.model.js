'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
    enum: ["New", "In progess", "Done"],
    default: "New"
  },
  points: {
    type: Number
  },
  created_at: Date,
  updated_at: Date
});

module.exports = mongoose.model('Story', StorySchema);
