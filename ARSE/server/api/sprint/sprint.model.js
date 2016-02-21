'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var SprintSchema = new Schema({
  name: {
    type: String
  }, 
  start_date: { 
    default: Date.now, 
    type: Date 
  },
  end_date: { 
    type: Date 
  },
  updated_at: {
    type: Date,
    default: Date.now
  },
  total_points: {
    type: Number,
    default: 0
  }
}, {strict: false});

module.exports = mongoose.model('Sprint', SprintSchema);