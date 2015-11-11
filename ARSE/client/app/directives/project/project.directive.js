'use strict';

angular.module('arseApp')
  .directive('project', function () {
    return {
      templateUrl: 'app/directives/project/project.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });
