'use strict';

angular.module('arseApp')
  .directive('story', function ($http, Project, $uibModal, Modal) {
    return {
      templateUrl: 'app/directives/story/story.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.item = angular.fromJson(attrs.storyItem);
        // Don't show the isRefreshing icon by default
        scope.isRefreshing = false;
        scope.errorMessage = "";
        scope.hasUpdateFailed = false;

        scope.deleteItem = function (item) {
          console.log('Deleting Item');
          $http.delete('/api/stories/' + item._id).then(function () {
              scope.$emit('updateView');
          });
        };


        scope.callOpenModal = function (item) {
          scope.editStory(item);
        }

        
        scope.$on('storyUpdating', function (event, story) {
          if(scope.item._id == story._id) {
            scope.isRefreshing = true;
          }
        });

        scope.$on('storyUpdated', function (event, story) {
          if(scope.item._id == story._id) {
            scope.isRefreshing = false;
            scope.item = story;
          }
        });

        scope.$on('storyUpdateFailed', function (event, id, err) {
          if(scope.item._id == id) {
            scope.isRefreshing = false;
            scope.hasUpdateFailed = true;
            scope.errorMessage = err.data;
          }
        });

      }
    };
  });
