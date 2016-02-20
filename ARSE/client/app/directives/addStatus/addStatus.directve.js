'use strict';

angular.module('arseApp')
  .directive('addStatus', ['$http', '$filter', 'Story', function ($http, $filter, Story) {
    return {
      templateUrl: 'app/directives/addStatus/addStatus.html',
      restrict: 'E',
      scope: {
        statuses: "=",
        callback: '&',
        currentElement: '=',
        isUpdatedOnSelection: '@'
      },
      link: function (scope, element, attrs) {
        scope.status = scope.currentElement.inprogress_status;
        
        // Display the user working on the current story
        scope.$watch('status', function (newValue, oldValue) {
          if (!angular.equals(newValue, oldValue)) {
            scope.setStatus(newValue);
          }
        });

        scope.showStatus = function () {
          return (scope.currentElement.inprogress_status) ? scope.currentElement.inprogress_status : 'Not Set';
        };
              
        // assign status 
        scope.setStatus = function (selected) {

          if (selected === 'Not Set') {
            scope.currentElement.inprogress_status = null;
          } else {
            scope.currentElement.inprogress_status = selected;
          }
          Story.update(scope.currentElement, function (httpRes) {
            console.log("Update succeeded");
            scope.currentElement.__v = httpRes.__v;
          }, function (err) {
            console.log("Update failed");
            // $scope.failed = err.data;
          });

          // TODO create the endpoint API and modify this code.
          // var uid = 0;
          // // if Unassigned set the id to 0
          // if (selected.username !== 'Unassigned') {
          //   uid = user._id;
          // }
          // $http.put('/api/projects/' + story.project + '/stories/' +
          //   story._id + '/assign/' + uid)
          //   .then(function (res) {
          //     scope.currentStory.user = user;
          //   });
        };

      }
    };
  }]);