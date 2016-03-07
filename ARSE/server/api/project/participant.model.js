'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;
    
var ParticipantSchema = new Schema({
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    role: {
      type: String,
      required: true,
      enum: ["PO", "Developer"],
      default: "Developer"
    }
    
});
module.exports = mongoose.model('Participant', ParticipantSchema);