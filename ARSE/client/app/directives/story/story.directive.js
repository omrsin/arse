'use strict';

angular.module('arseApp')
  .directive('story', function ($http, Project, $uibModal, Modal) {
    return {
      templateUrl: 'app/directives/story/story.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.item = angular.fromJson(attrs.storyItem);
        console.log(scope.item);
        // Don't show the isRefreshing icon by default
        scope.isRefreshing = false;

        scope.deleteItem = function (item) {
          console.log('Deleting Item');
          $http.delete('/api/stories/' + item._id).then(function () {
              scope.$emit('updateView');
          });
        };


        scope.callOpenModal = function (item) {
          scope.editStory(item);
        }

        scope.$on('storyUpdated', function (event, story) {
          console.log("inside the event");
        });

      }
    };
  });
