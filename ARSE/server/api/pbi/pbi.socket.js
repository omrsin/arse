/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Pbi = require('./pbi.model');

exports.register = function(socket) {
  Pbi.schema.post('save', function (doc) {
    onSave(socket, doc);
  });
  Pbi.schema.post('remove', function (doc) {
    onRemove(socket, doc);
  });
}

function onSave(socket, doc, cb) {
  socket.emit('pbi:save', doc);
}

function onRemove(socket, doc, cb) {
  socket.emit('pbi:remove', doc);
}