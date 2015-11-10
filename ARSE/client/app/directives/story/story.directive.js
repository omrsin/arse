'use strict';

angular.module('arseApp')
  .directive('story', function ($http, Project) {
    return {
      templateUrl: 'app/directives/story/story.html',
      restrict: 'E',
      scope: {
        item: '='
      },
      link: function (scope, element, attrs) {

        scope.deleteItem = function (item) {
          console.log('Deleting Item');
          $http.delete('/api/stories/' + item._id).then(function () {
              scope.$emit('updateView');
          });
        }
      }
    };
  });
