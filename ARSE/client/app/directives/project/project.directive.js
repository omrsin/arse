'use strict';

angular.module('arseApp')
  .directive('project', function ($http) {
    return {
      templateUrl: 'app/directives/project/project.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {

        scope.deleteItem = function (item) {
          console.log('Deleting Item');
          $http.delete('/api/projects/' + item._id).then(function () {
            scope.$emit('updateView');
          });
        };

        scope.callOpenModal = function (item) {
          scope.editProject(item);
        };
      }
    };
  });
