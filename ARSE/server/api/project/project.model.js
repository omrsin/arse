'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;


var Chat = new Schema({
  user: String,
  text: String,
  date: {
    type: Date,
    default: Date.now()
  }
});

Chat.statics = {
  loadRecent: function (cb) {
    this.find({})
      .sort('-date')
      .limit(20)
      .exec(cb);
  }
};

var ProjectSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
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
    default: 0
  },
  past_sprints: ['Sprint'],
  sprint_counter: {
    type: Number,
    default: 0
  },
  story_types: {
    type: [String],
    default: ["Feature", "Enhancement", "Fix"]
  },
  story_statuses: {
    type: [String]
  },
  chat: [Chat],
  participants: ['Participant']
}, { strict: false });
ProjectSchema.index({ 'participants': 1 })


module.exports = mongoose.model('Project', ProjectSchema);
