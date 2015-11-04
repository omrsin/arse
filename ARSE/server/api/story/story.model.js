'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var StorySchema = new Schema({
  name: String,
  description: String,
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
