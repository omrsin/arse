'use strict';

angular.module('arseApp')
  .directive('addParticipant', function ($http, $filter) {
    return {
      templateUrl: 'app/directives/addParticipant/addParticipant.html',
      restrict: 'E',
      scope: {
        participants: "=",
        callback: '&',
        currentStory: '=',
        isUpdatedOnSelection: '@'
      },
      link: function (scope, element, attrs) {
        scope.assigned = {
          user: scope.currentStory.user
        };
        
        // Display the user working on the current story
        scope.$watch('assigned', function (value) {
          if (value.user != null) {
            console.log('Value changed');
            scope.assignUser(scope.assigned.user);
          }
        });

        scope.showAssignee = function () {
          return (scope.assigned.user) ? scope.assigned.user.username : 'Unassigned';
        };
              
        // assign user to story based on the selection
        scope.assignUser = function (selected) {
          console.log('Selected user is:' + JSON.stringify(selected));
          var user = selected;
          var story = scope.currentStory;
          var uid = 0;
          // if Unassigned set the id to 0
          if (selected.username !== 'Unassigned') {
            uid = user._id;
          }
          $http.put('/api/projects/' + story.project + '/stories/' +
            story._id + '/assign/' + uid)
            .then(function (res) {
              scope.currentStory.user = user;
              console.log('upadated the story');
            });
        };

      }
    };
  });