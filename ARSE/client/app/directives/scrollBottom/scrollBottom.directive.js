'use strict';

angular.module('arseApp')
  .directive('scrollBottom', function () {
    return {
      scope: {
        scrollBottom: "="
      },
      restrict: 'A',
      link: function (scope, element, attrs) {
        scope.$watchCollection('scrollBottom', function (newValue) {
          if (newValue) {
            $(element).scrollTop($(element)[0].scrollHeight);
          }
        });
      }
    };
  });
