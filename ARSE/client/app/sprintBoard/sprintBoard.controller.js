'use strict';

angular.module('arseApp')
  .controller('SprintBoardCtrl', ['$scope', '$stateParams', '$http', 'Modal', '$state', 'Story', 'project', 'Task', function ($scope, $stateParams, $http, Modal, $state, Story, project, Task) {
    $scope.project_id = $stateParams.project_id;
    $scope.sprint;
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

    $scope.selectedUser = {};

    $scope.selectedParticpant = {};
    $scope.showAddParticipant = false;
    
    //statuses available
    $scope.statuses_available = project.story_statuses;
    $scope.statuses_available.splice(0, 0, "Not Set");

    $scope.participants = project.participants;
    // Make unassign available on the drowpdown
    $scope.participants.splice(0, 0, {
      role: '',
      user: {
        username: 'Unassigned'
      }
    });

    // Error message if something failed
    $scope.failed = "";
    // Informative messages go here
    $scope.infoMessage = "";

    $http({
      url: '/api/projects/' + $scope.project_id + '/sprints/current',
      method: "GET",
      params: { stories: true }
    }).then(function (res) {
      $scope.sprint = res.data;
      for (var i = 0; i < $scope.sprint.stories.length; i++) {
        var story = $scope.sprint.stories[i];
        story.inColumn = [];
        // For each story, save in a boolean array, if it belongs to the corresponding column
        for (var j = 0; j < $scope.statuses.length; j++) {
          story.inColumn.push({ isWithin: story.status === $scope.statuses[j].name });
        }
        // Create 3 arrays for the tasks for the three statuses
        story.tasksByStatus = [[], [], []];
        for (var j = 0; j < $scope.sprint.stories[i].tasks.length; j++) {
          var task = $scope.sprint.stories[i].tasks[j];
          for (var k = 0; k < $scope.statuses.length; k++) {
            if (task.status === $scope.statuses[k].name) {
              story.tasksByStatus[k].push(task);
            }
          }
        }
      }
    });

    // Sorting options for the sprint board when sorting stories
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
      additionalPlaceholderClass: 'as-sortable-placeholder'
    };

    // Sorting options for the sprint board when sorting tasks
    $scope.sprintBoardTaskOptions = {
      //restrict move across row. move only within row.
      accept: function (sourceItemHandleScope, destSortableScope) {
        var sourceID = sourceItemHandleScope.itemScope.sortableScope.$parent.$parent.$id;
        var destID = destSortableScope.$parent.$parent.$id;

        return sourceID === destID;
      },
      itemMoved: function (event) {
        var story = event.dest.sortableScope.$parent.$parent.story;
        var task = event.dest.sortableScope.modelValue[event.dest.index];
        var newStatus = $scope.statuses[event.dest.sortableScope.element[0].id].name;
        var oldStatus = $scope.statuses[event.source.sortableScope.element[0].id].name

        task.status = newStatus;
        $scope.changeTask(task, story, oldStatus);
      },
      additionalPlaceholderClass: 'as-sortable-placeholder'
    };

    $scope.closeSprint = function () {
      var unfinishedStories = false;
      var message = "Are you sure you want to close this sprint?";
      angular.forEach($scope.sprint.stories, function (value, index) {
        if (value.status !== "Done")
          unfinishedStories = true;
      });
      if (unfinishedStories) {
        message += " Some stories are still not done.";
      }
      Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl',
        { message: message }).result.then(function (res) {
          $http.put('/api/projects/' + $scope.project_id + '/sprints/current/close').then(function (res) {
            $state.go('backlog', { 'project_id': $scope.project_id });
          }, function (error) {
            $scope.failed = error.data;
          });
        });
    };

    $scope.cancelSprint = function () {
      var message = "Are you sure you want to cancel this sprint?";
      Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl',
        { message: message }).result.then(function (res) {
          $http.put('/api/projects/' + $scope.project_id + '/sprints/current/cancel').then(function (res) {
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
        // Update desktop view
        var temp = story.inColumn[1];
        story.inColumn[1] = story.inColumn[0];
        story.inColumn[0] = temp;
      } else if (oldStatus === $scope.statuses[2].name) {
        story.status = $scope.statuses[1].name;
        // Update desktop view
        var temp = story.inColumn[2];
        story.inColumn[2] = story.inColumn[1];
        story.inColumn[1] = temp;
      }
      console.log(story.inColumn);


      $scope.changeStory(story, oldStatus);
    }


    // Move an item right in the sprint board (called on mobile)
    $scope.moveStoryRight = function (story) {
      var oldStatus = story.status;
      if (oldStatus === $scope.statuses[0].name) {
        story.status = $scope.statuses[1].name;
        // Update desktop view
        var temp = story.inColumn[1];
        story.inColumn[1] = story.inColumn[0];
        story.inColumn[0] = temp;
      } else if (oldStatus === $scope.statuses[1].name) {
        story.status = $scope.statuses[2].name;
        // Update desktop view
        var temp = story.inColumn[2];
        story.inColumn[2] = story.inColumn[1];
        story.inColumn[1] = temp;
      }
      $scope.changeStory(story, oldStatus);
    }

    //moves a task to left (called on mobile)
    $scope.moveTaskLeft = function (task, story) {
      var oldStatus = task.status;
      if (oldStatus === $scope.statuses[1].name) {
        task.status = $scope.statuses[0].name;
      } else if (oldStatus === $scope.statuses[2].name) {
        task.status = $scope.statuses[1].name;
      }
      // save it in the array of the corresponding status
      for (var i = 0; i < $scope.statuses.length; i++) {
        if ($scope.statuses[i].name === oldStatus) {
          // remove
          story.tasksByStatus[i].splice(story.tasksByStatus[i].indexOf(task), 1);
        }
        if ($scope.statuses[i].name === task.status) {
          story.tasksByStatus[i].push(task);
        }
      }

      $scope.changeTask(task, story, oldStatus);
    }
    
    //moves a task to right (called on mobile)
    $scope.moveTaskRight = function (task, story) {
      var oldStatus = task.status;
      if (oldStatus === $scope.statuses[0].name) {
        task.status = $scope.statuses[1].name;
      } else if (oldStatus === $scope.statuses[1].name) {
        task.status = $scope.statuses[2].name;
      }
      // save it in the array of the corresponding status
      for (var i = 0; i < $scope.statuses.length; i++) {
        if ($scope.statuses[i].name === oldStatus) {
          // remove
          story.tasksByStatus[i].splice(story.tasksByStatus[i].indexOf(task), 1);
        }
        if ($scope.statuses[i].name === task.status) {
          story.tasksByStatus[i].push(task);
        }
      }

      $scope.changeTask(task, story, oldStatus);
    }

    // Collapse and expand to see tasks of a story
    $scope.expand = function (story) {
      story.isExpanded = true;
    }
    $scope.collapse = function (story) {
      story.isExpanded = false;
    }

    // Update a story in the backend
    $scope.changeStory = function (story, oldStatus) {
      $scope.failed = "";
      $scope.infoMessage = "";
      if (story.status === "Done") {
        // TODO display a warning if there are tasks undone.
        // Check if there is a task which is not done
        console.log("Story:");
        console.log(story);
        for (var i = 0; i < story.tasks.length; i++) {
          console.log(story.tasks[i].status);
          if (story.tasks[i].status !== "Done") {
            $scope.infoMessage = "Please note that there are still tasks of this story, which are not done yet.";
            break;
          }
        }
      }

      console.log(story);
      Story.update(story, function (httpRes) {
        console.log("Update succeeded");
        story.__v = httpRes.__v;
      }, function (err) {
        console.log("Update failed");
        $scope.failed = err.data;
        story.status = oldStatus;
      });
    }
    
    //Update a task in the backend
    $scope.changeTask = function (task, story, oldStatus) {
      $scope.failed = "";
      $scope.infoMessage = "";

      $http.put('/api/projects/' + $scope.project_id + '/stories/' + story._id + '/tasks/' + task._id, task)
        .success(function (data, status, headers, config) {
          console.log("Task updated successfully");
          task.__v = data.__v;
        })
        .error(function (data, status, header, config) {
          console.log("Update of the task failed");
          $scope.failed = data;
          task.status = oldStatus;
        });
    }
    
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

    // Add a task to the story
    $scope.addTask = function (story) {
      $scope.failed = "";
      $scope.infoMessage = "";

      Modal.open({}, 'app/sprintBoard/taskForm.html', 'TaskFormCtrl', { projectId: $stateParams.project_id, storyId: story._id })
        .result.then(function (res) {
          res.$save(function (httpRes) {
            story.tasks.push(httpRes);
            // save it in the array of the corresponding status
            for (var i = 0; i < $scope.statuses.length; i++) {
              if ($scope.statuses[i].name === httpRes.status) {
                story.tasksByStatus[i].push(httpRes);
              }
            }
            // Expand story in desktop view to see the task
            $scope.expand(story);
            // Switch to "New" tab in mobile view to see the task
            console.log($scope.statuses);
            $scope.statuses[0].active = true;
          }, function (err) {
            $scope.failed = err.data;
          });
        });
    };

    $scope.removeTask = function (task, story) {
      $scope.failed = "";
      $scope.infoMessage = "";

      var message = "Are you sure you want to delete this task?";
      Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl',
        { message: message }).result.then(function (res) {
          // update the api PROPERLY
          $http.delete('/api/projects/' + $scope.project_id + '/stories/' + story._id + '/tasks/' + task._id)
            .success(function (data, status, headers, config) {
              console.log("Task deleted successfully");
              story.tasks.splice(story.tasks.indexOf(task), 1);
              // delete it in the array of the corresponding status
              for (var i = 0; i < $scope.statuses.length; i++) {
                if ($scope.statuses[i].name === task.status) {
                  story.tasksByStatus[i].splice(story.tasksByStatus[i].indexOf(task), 1);
                }
              }
            })
            .error(function (data, status, header, config) {
              console.log("Delete of the task failed");
              $scope.failed = data;
            });
        });
    };

    $scope.editTask = function (task, story) {
      $scope.failed = "";
      $scope.infoMessage = "";

      Modal.open({}, 'app/sprintBoard/taskForm.html', 'TaskFormCtrl', { projectId: $stateParams.project_id, storyId: story._id, task: task })
        .result.then(function (res) {
          $http.put('/api/projects/' + $scope.project_id + '/stories/' + story._id + '/tasks/' + task._id, res)
            .success(function (data, status, headers, config) {
              console.log("Task updated successfully");
              angular.copy(data, task);
              // task = angular.copy(data);
            })
            .error(function (data, status, header, config) {
              console.log("Update of the task failed");
              $scope.failed = data;
            });
        }, function (err) {
          $scope.failed = err.data;
        });
    };

    $scope.countByStatus = function (tasks, stat) {
      var filteredTasks = tasks.filter(function (elem) {
        return elem.status === stat;
      });
      return filteredTasks.length > 0;
    };

  }]);

angular.module('arseApp').controller('TaskFormCtrl',
  ['$scope', '$uibModalInstance', 'items', 'Task', function ($scope, $uibModalInstance, items, Task) {


    $scope.task = {};
    if (items.task) {
      $scope.create = false;
      angular.copy(items.task, $scope.task);
      $scope.title = "Edit Task";
    } else {
      $scope.create = true;
      $scope.title = "Create Task";
    }

    $scope.createOrUpdateTask = function () {
      if ($scope.task.name && $scope.task.description) {
        if ($scope.create) {
          $scope.createTask();
        } else {
          $scope.updateTask();
        }
      }
    };

    // Use the original story, so that id, reference to project, etc. is staying the same
    $scope.updateTask = function () {

      $uibModalInstance.close($scope.task);
    };

    $scope.createTask = function () {
      $scope.task = new Task({
        name: $scope.task.name,
        description: $scope.task.description,
        project: items.projectId,
        story: items.storyId
      });
      $uibModalInstance.close($scope.task);
    };

    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    };
  }]);
