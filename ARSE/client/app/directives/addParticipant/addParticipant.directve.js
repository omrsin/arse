'use strict';

angular.module('arseApp')
  .directive('addParticipant', function ($http) {
    return {
      templateUrl: 'app/directives/addParticipant/addParticipant.html',
      restrict: 'E',
      scope: {
        participants: "=",
        callback: '&',
        currentStory: '=',
        isUpdatedOnSelection: '@'
      },
      link: function (scope, element, attrs) {;
        if (!scope.isUpdatedOnSelection) {
          scope.isUpdatedOnSelection = false;
        } else {
          scope.isUpdatedOnSelection = true;
        }
        scope.selectedUser = scope.currentStory.user;
        // Display the user working on the current story
        scope.$watch('currentStory', function (value) {
          if (value) {
            console.log("value: " + JSON.stringify(value));
            console.log("currentUser: " + scope.currentUser);
            if (value.hasOwnProperty('user')) {
              scope.item = scope.currentStory.user;
              scope.selectedUser = scope.item;
            } else {
              scope.selectedUser = {
                username: "Unassigned"
              };
            }
          }
        });
              
        // assign user to story based on the selection
        scope.assignUser = function (selected) {
          console.log('Selected user is:' + JSON.stringify(selected));
          var user = selected.user;
          var story = scope.currentStory;
          // Check if story exists if not do not assign the user on the backend
          if (!scope.isUpdatedOnSelection) {
            scope.currentStory.user = user;
            scope.showSelectBox = false;
            console.log('story not yet created');
            console.log(scope.currentStory);
          } else {
            $http.put('/api/projects/' + story.project + '/stories/' +
              story._id + '/assign/' + user._id)
              .then(function (res) {
                scope.currentStory.user = user;
                scope.showSelectBox = false;
                console.log('upadated the story');
              });
          }

        };

      }
    };
  });