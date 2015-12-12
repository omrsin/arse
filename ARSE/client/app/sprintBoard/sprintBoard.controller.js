'use strict';

angular.module('arseApp')
  .controller('SprintBoardCtrl', ['$scope', '$stateParams', '$http', 'Modal', '$state', 'Story', function ($scope, $stateParams, $http, Modal, $state, Story) {
    $scope.project_id = $stateParams.project_id;
    $scope.sprint;
    $scope.statuses = [
      { name: "New" },
      { name: "In progress" },
      { name: "Done" },
    ];

    // Error message if something failed
    $scope.failed = "";

    // Sorting options for the sprint board
    $scope.sprintBoardOptions = {

      //restrict move across row. move only within row.
      accept: function (sourceItemHandleScope, destSortableScope) {
        return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
       },
      orderChanged: function(event) {
        var oldStatus = $scope.statuses[event.source.index].name;
        var newStatus = $scope.statuses[event.dest.index].name;
        var story = event.source.sortableScope.$parent.story;
        console.log("reordered from " + oldStatus +" to " + newStatus);
        story.status = newStatus;
        $scope.changeStory(story, oldStatus);
      },
      additionalPlaceholderClass: 'as-sortable-story-placeholder'
    };

    $http({
      url: '/api/projects/' + $scope.project_id + '/sprints/current',
      method: "GET",
      params: { stories: true }
    }).then(function (res) {
      $scope.sprint = res.data;
      console.log(res.data);
      for(var i = 0; i < $scope.sprint.stories.length; i++) {
        var story = $scope.sprint.stories[i];
        story.items = [];// [{isWithin: true}, {isWithin: false}, {isWithin: false}];
        for(var j = 0; j < $scope.statuses.length; j++) {
          story.items.push({isWithin: story.status === $scope.statuses[j].name})
        }
      }
    });

    $scope.closeSprint = function () {
      var unfinishedStories = false;
      var message = "Are you sure you want to close this sprint?";
      angular.forEach($scope.sprint.stories, function (value, index) {
        if (value.status != "Done")
          unfinishedStories = true;
      });
      if (unfinishedStories) {
        message += " Some stories are still not done.";
      }
      Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl',
        { message: message }).result.then(function (res) {
          console.log('Deleting Item');
          // update the api PROPERLY
          $http.put('/api/projects/' + $scope.project_id + '/sprints/current/close').then(function () {
            $state.go('backlog', { 'project_id': $scope.project_id });
          });
        });
    };

    $scope.changeStory = function(story, oldStatus) {
      Story.update(story, function (httpRes) {
          console.log("Update succeeded");
        }, function (err) {
          console.log("Update failed");
          $scope.failed = err.data;
          story.status = oldStatus;
        });
    }


  }]);
