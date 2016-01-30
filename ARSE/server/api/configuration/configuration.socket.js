/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Configuration = require('./configuration.model');

exports.register = function(socket) {
  Configuration.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Configuration.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('configuration:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('configuration:remove', doc);
}