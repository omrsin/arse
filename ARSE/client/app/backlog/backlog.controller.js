'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Project', '$http', '$stateParams', 'Modal', 'Story', function ($scope, Project, $http, $stateParams, Modal, Story) {

    // This function is called every time we receive project data from the backend
    $scope.onProjectDataReceived = function (project) {
      // Add a delimiter according to the offset value of the project
      //project.offset = project.backlog.length;
      project.backlog.splice(project.offset, 0, {
        _id: -1,
        project: project._id,
        noSprintRunning: (!project.current_sprint)
      });

      $scope.project = project;

      console.log("current sprint");
      console.log(project.current_sprint);
    };

    $scope.data = {};
    $scope.allowReorder = true;
    $scope.showDetails = false;
    $scope.detailStory = {};
    // Error message if creating/editing a story failed
    $scope.failed = "";

    Project.get({ id: $stateParams.project_id }, $scope.onProjectDataReceived);

    $scope.showStoryDetails = function (item) {
      if ($scope.detailStory._id == item._id) {
        $scope.detailStory = {};
        $scope.showDetails = false;
      } else {
        $scope.detailStory = item;
        $scope.showDetails = true;
      }
    };

    $scope.editStory = function (item) {
      $scope.failed = "";
      Modal.open({}, 'app/backlog/storyForm.html', 'StoryFormCtrl', { story: item }).result.then(function (res) {

        // Show the updating icon
        $scope.$broadcast("storyUpdating", res);
        // Actually trigger the update on the server

        Story.update(res, function (httpRes) {
          // Update the table and remove updating icon
          // It is important to pass the local res, instead of the HTTP res, since
          // http returns a resource object whith circular dependencies that cannot be serialized.
          $scope.$broadcast("storyUpdated", res);
        }, function (err) {
          $scope.failed = err.data;
          $scope.$broadcast("storyUpdateFailed", item._id, res);
        });

      });
    };

    $scope.addStory = function () {
      $scope.failed = "";
      Modal.open({}, 'app/backlog/storyForm.html', 'StoryFormCtrl', { projectId: $stateParams.project_id })
        .result.then(function (res) {
          res.$save(function (httpRes) {
            console.log(httpRes);
            $scope.project.backlog.push(httpRes);
          }, function (err) {
            $scope.failed = err.data;
          });
        });
    };

    $scope.$on('updateView', function () {
      Project.get({ id: $stateParams.project_id }, $scope.onProjectDataReceived);
    });

    //XXX a bug on reordering
    $scope.dragControlListeners = {
      //override $scope.allowReorder to determine drag is allowed or not. default is true.
      accept: function (sourceItemHandleScope, destSortableScope) { return $scope.allowReorder },
      itemMoved: function (event) { },
      orderChanged: function (event) {
        $scope.allowReorder = false;
        if (event.source.itemScope.item._id !== -1) {
          // normal story moved
          
          var oldIndex = event.source.index;
          var newIndex = event.dest.index;
          var offset = $scope.project.offset;

          if (oldIndex > offset && newIndex <= offset) {
            offset++;
          }
          if (oldIndex < offset && newIndex >= offset) {
            offset--;
          }
          

          // Do math with the index to considerate the delimiter
          if (oldIndex > $scope.project.offset) oldIndex--;
          if (newIndex > $scope.project.offset) newIndex--;

          console.log("drag " + oldIndex + " to " + newIndex);

          $http.put('/api/projects/' + $scope.project._id + '/reorder', {
            oldIndex: oldIndex,
            newIndex: newIndex
          }).then(function (res) {
            $scope.allowReorder = true;
            Project.update({ _id: $scope.project._id, offset: offset }, function (res) {
              console.log("receiver http: " + JSON.stringify(res));
            }, function (err) {
              $scope.failed = err.data;
            }); 
          });
        } else {
          // delimiter moved
          // Update offset according to the new position
          $scope.project.offset = event.dest.index;
          // Issue a different request to update the offset of the delimiter
          console.log("drag last to " + $scope.project.offset);
          Project.update({ _id: $scope.project._id, offset: $scope.project.offset }, function (res) {
            $scope.allowReorder = true;
            console.log("receiver http res");
          }, function (err) {
            $scope.failed = err.data;
          });
        }
      }
    };

  }]);

angular.module('arseApp').controller('StoryFormCtrl',
  ['$scope', '$uibModalInstance', 'items', 'Story', function ($scope, $uibModalInstance, items, Story) {

    $scope.storyTypes = ["Feature", "Enhancement", "Fix"];
    $scope.availableSPs = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];

    $scope.story = {};
    if (items.story) {
      $scope.create = false;
      angular.copy(items.story, $scope.story);
      $scope.title = "Edit Story";
    } else {
      $scope.create = true;
      $scope.title = "Create Story";
    }

    $scope.createOrUpdateStory = function () {
      if ($scope.story.name && $scope.story.description) {
        if ($scope.create) {
          $scope.createStory();
        } else {
          $scope.updateStory();
        }
      }
    };

    // Use the original story, so that id, reference to project, etc. is staying the same
    $scope.updateStory = function () {
      $uibModalInstance.close($scope.story);
    };

    $scope.createStory = function () {
      $scope.story = new Story({
        name: $scope.story.name,
        project: items.projectId,
        description: $scope.story.description,
        points: $scope.story.points,
        type: $scope.story.type,
        orderId: items.orderId
      });
      $uibModalInstance.close($scope.story);
    };

    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);
