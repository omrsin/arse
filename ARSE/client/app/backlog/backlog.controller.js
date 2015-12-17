'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Project', '$http', '$stateParams', 'Modal', 'Story', '$state', 'project', function ($scope, Project, $http, $stateParams, Modal, Story, $state, project) {
  
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
    };

    $scope.onProjectDataReceived(project);

    var sprintRunning = true;
      
    $scope.updateView = function() {
      Project.get({ id: $stateParams.project_id }, $scope.onProjectDataReceived);
    };

    $scope.$on('updateView', function () {
      $scope.updateView();
    });

    $scope.data = {};
    $scope.allowReorder = true;
    $scope.showDetails = false;
    $scope.detailStory = {};
    // Error message if creating/editing a story failed
    $scope.failed = "";
    $scope.updateView();

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
            $scope.project.backlog.push(httpRes);
          }, function (err) {
            $scope.failed = err.data;
          });
        });
    };

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
          var offsetMoved = false;
          
          // Check if item moved above or below offset
          if (oldIndex > offset && newIndex <= offset) {
            offset++;
            offsetMoved = true;
          }
          if (oldIndex < offset && newIndex >= offset) {
            offset--;
            offsetMoved = true;
          }

          //show modal if item moved above or below offset and sprint is in progress
          if ($scope.project.current_sprint && offsetMoved) {
            Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl', { message: "Sprint running, are you sure you want to change the scope?" }).result.then(function (res) {              
              updateOrder(newIndex, oldIndex, offset, $scope.project._id, offsetMoved);
            }, function () {
              revertReorder(event);
              $scope.allowReorder = true;
            });

          } else {
            updateOrder(newIndex, oldIndex, offset, $scope.project._id, offsetMoved);
          }
        } else {
          // delimiter moved
          console.log("drag delimiter to " + event.dest.index);
          // Update offset according to the new position
          if ($scope.project.current_sprint) {
            Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl', 
              { message: "Sprint running, are you sure you want to change the scope?" }).result.then(function (res) {
              $scope.project.offset = event.dest.index;
              updateOffset($scope.project.offset, $scope.project._id);
            }, function () {
              revertReorder(event);
              $scope.allowReorder = true;
            });

          } else {
            $scope.project.offset = event.dest.index;
            updateOffset($scope.project.offset, $scope.project._id);
          }
        }
      }
    };

    // Revert order if user cancels order change on the case of running sprint
    // Safest: just "refresh"
    var revertReorder = function (event) {
      $scope.updateView();
      //event.dest.sortableScope.removeItem(event.dest.index);
      //event.source.itemScope.sortableScope.insertItem(event.source.index, event.source.itemScope.item);
    };
    
    // update offset on the backend
    var updateOffset = function (offset, projectId) {
      console.log("Updating the offset on the server to " + offset);
      Project.update({ _id: projectId, offset: offset }, function (res) {
        $scope.allowReorder = true;
      }, function (err) {
        $scope.failed = err.data;
      });
    };

    // update order on the backend
    var updateOrder = function (newIndex, oldIndex, offset, projectId, offsetMoved) {
      var oldOffset = $scope.project.offset;
      console.log("drag " + oldIndex + " to " + newIndex);
      // Do math with the index to considerate the delimiter
      if (oldIndex >= oldOffset) oldIndex--;
      if (newIndex >= offset) newIndex--;
      console.log("offset old " + $scope.project.offset + " vs. new " + offset);

      if(oldIndex != newIndex) {
      console.log("Updating the order on the server:" + oldIndex + "->" + newIndex);
        // Issue a PUT request on the server
        $http.put('/api/projects/' + projectId + '/reorder', {
          oldIndex: oldIndex,
          newIndex: newIndex
        }).then(function (res) {
          $scope.allowReorder = true;
        });
      }
      // Update if offset moved
      if (offsetMoved) {
        updateOffset(offset, projectId);
      }
    }
      

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