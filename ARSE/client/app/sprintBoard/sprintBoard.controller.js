'use strict';

angular.module('arseApp')
  .controller('SprintBoardCtrl', ['$scope', '$stateParams', '$http', 'Modal', '$state', 'Story', 'project', function ($scope, $stateParams, $http, Modal, $state, Story, project) {
    $scope.project_id = $stateParams.project_id;
    $scope.sprint;
    $scope.project;
    $scope.participants;
    $scope.statuses = [
      { name: "New" },
      { name: "In progress" },
      { name: "Done" },
    ];

    // Set if we have the PO right
    $scope.hasPORights = project.role === "PO";

    $scope.showDetails = false;
    $scope.detailStory = {};

    $scope.selectedParticpant = {};
    $scope.showAddParticipant = false;

    // Error message if something failed
    $scope.failed = "";

    $http({
      url: '/api/projects/' + $scope.project_id + '/sprints/current',
      method: "GET",
      params: { stories: true }
    }).then(function (res) {
      $scope.sprint = res.data;
      console.log(res.data);
      for (var i = 0; i < $scope.sprint.stories.length; i++) {
        var story = $scope.sprint.stories[i];
        story.items = [];
        for (var j = 0; j < $scope.statuses.length; j++) {
          story.items.push({ isWithin: story.status === $scope.statuses[j].name })
        }
      }
    });
    
    // request users/participants
    $http({
      url: '/api/projects/' + $scope.project_id,
      method: 'GET',
    }).then(function (res) {
      $scope.project = res.data;
      $scope.participants = res.data.participants;
      // Make unassign available on the drowpdown
      $scope.participants.splice(0, 0, {
        role: '',
        user: {
          username: 'Unassigned'
        }
      });
      console.log("project participants: " + JSON.stringify($scope.participants));
    });

    // Sorting options for the sprint board
    $scope.sprintBoardOptions = {
      //restrict move across row. move only within row.
      accept: function (sourceItemHandleScope, destSortableScope) {
        return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
      },
      orderChanged: function (event) {
        var oldStatus = $scope.statuses[event.source.index].name;
        var newStatus = $scope.statuses[event.dest.index].name;
        var story = event.source.sortableScope.$parent.story;
        console.log("reordered from " + oldStatus + " to " + newStatus);
        story.status = newStatus;
        $scope.changeStory(story, oldStatus);
      },
      additionalPlaceholderClass: 'as-sortable-story-placeholder'
    };

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
          $http.put('/api/projects/' + $scope.project_id + '/sprints/current/close').then(function (res) {
            $state.go('backlog', { 'project_id': $scope.project_id });
          }, function (error) {
            $scope.failed = error.data;
          });
        });
    };

    // Move an item left in the sprint board (called on mobile)
    $scope.moveStoryLeft = function (story) {
      var oldStatus = story.status;
      if (oldStatus === $scope.statuses[1].name) {
        story.status = $scope.statuses[0].name;
      } else if (oldStatus === $scope.statuses[2].name) {
        story.status = $scope.statuses[1].name;
      }
      $scope.changeStory(story, oldStatus);
    }


    // Move an item right in the sprint board (called on mobile)
    $scope.moveStoryRight = function (story) {
      var oldStatus = story.status;
      if (oldStatus === $scope.statuses[0].name) {
        story.status = $scope.statuses[1].name;
      } else if (oldStatus === $scope.statuses[1].name) {
        story.status = $scope.statuses[2].name;
      }
      $scope.changeStory(story, oldStatus);
    }

    // Update a story in the backend
    $scope.changeStory = function (story, oldStatus) {
      Story.update(story, function (httpRes) {
        console.log("Update succeeded");
      }, function (err) {
        console.log("Update failed");
        $scope.failed = err.data;
        story.status = oldStatus;
      });
    }

    $scope.selectedUser = {};
    // Displays details of the story in a side view
    $scope.showItem = function (item) {
      if ($scope.detailStory._id == item._id) {
        $scope.detailStory = {};
        $scope.showDetails = false;
      } else {
        $scope.detailStory = item;
        $scope.showDetails = true;
      }
    };

    $scope.closeShowItem = function () {
      $scope.showDetails = false;
    };



  }]);
