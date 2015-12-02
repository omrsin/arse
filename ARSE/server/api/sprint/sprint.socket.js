/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Sprint = require('./sprint.model');

exports.register = function(socket) {
  Sprint.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Sprint.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('sprint:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('sprint:remove', doc);
}