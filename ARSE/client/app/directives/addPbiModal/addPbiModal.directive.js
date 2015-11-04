'use strict';

angular.module('arseApp')
  .directive('addPbiModal', function () {
    return {
      templateUrl: 'app/directives/addPbiModal/addPbiModal.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
      }
    };
  });