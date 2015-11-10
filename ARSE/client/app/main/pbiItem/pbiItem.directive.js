'use strict';

angular.module('arseApp')
  .directive('pbiItem', function () {
    return {
      templateUrl: 'app/directives/pbiItem/pbiItem.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });