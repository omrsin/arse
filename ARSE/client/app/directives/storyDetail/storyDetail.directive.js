'use strict';

angular.module('arseApp')
  .directive('storyDetail', function ($http) {
    return {
      templateUrl: 'app/directives/storyDetail/storyDetail.html',
      restrict: 'E',
      scope: {
        storyItem: '=',
        callback: '&',
        participants: '='
      },
      link: function (scope, element, attrs) {
        console.log(scope.detailStory);
        scope.item = scope.storyItem;
        // Show the currently selected story in the story detail view
        scope.$watch('storyItem', function(value){
          if(value){
              scope.item = value;
              scope.selectedUser = scope.item.user;
          }
        });

        scope.hideItem = function () {
          console.log(scope.item.user);
          scope.callback({ item: scope.item });
        };
      }
    };
  });