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

      //restrict move across columns. move only within column.
      accept: function (sourceItemHandleScope, destSortableScope) {
       return true;// sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
       },
      itemMoved: function (event) {
        var oldStatus = event.source.itemScope.modelValue.status;
        event.source.itemScope.modelValue.status = event.dest.sortableScope.$parent.column.name;
        $scope.changeStory(event.source.itemScope.modelValue, oldStatus);
      },
      dragStart: function(event) {
        console.log("dragging");
        event.source.itemScope.modelValue.isDragged = true;
      },
      dragEnd: function(event) {
        console.log("dropping");

        event.source.itemScope.modelValue.isDragged = false;
      },
      orderChanged: function(event) {
        console.log("reordered");
      },
      additionalPlaceholderClass: 'placeholder'
      // containment: '#board'
    };

    $http({
      url: '/api/projects/' + $scope.project_id + '/sprints/current',
      method: "GET",
      params: { stories: true }
    }).then(function (res) {
      $scope.sprint = res.data;
      console.log(res.data);
    });

    $scope.closeSprint = function () {
      var unfinishedStories = false;
      var message = "Are you sure you want to close this sprint?";
      angular.forEach($scope.sprint.stories, function (value, index) {
        if (value.status != "Done")
          unfinishedStories = true;
      });
      if (unfinishedStories)
        message += " Some stories are still not done";
      Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl',
        { message: message }).result.then(function (res) {
          console.log('Deleting Item');
          // update the api PROPERLY
          $http.put('/api/projects/' + $scope.project_id + '/sprints/current/close').then(function () {
            // scope.$emit('updateView');
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
