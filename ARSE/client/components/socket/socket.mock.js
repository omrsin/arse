'use strict';

angular.module('arseApp', [])
  .factory('socket', function() {
    return {
      socket: {
        connect: function() {},
        on: function() {},
        emit: function() {},
        receive: function() {}
      },

      syncUpdates: function() {},
      unsyncUpdates: function() {}
    };
  });
