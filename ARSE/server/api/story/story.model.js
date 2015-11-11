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
    ref: 'Project'
  },
  story_points: Number,
  summary: String,
  created_at: Date,
  updated_at: Date
});

module.exports = mongoose.model('Story', StorySchema);
