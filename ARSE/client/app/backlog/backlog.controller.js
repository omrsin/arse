'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Project', '$http', '$stateParams', 'Modal', 'Story', function ($scope, Project, $http, $stateParams, Modal, Story) {
    
    // This function is calles every time we receive project data from the backend
    $scope.onProjectDataReceived = function(project) {
      // Add a delimiter TODO according to the offset value of the project
      project.offset = project.backlog.length;
      project.backlog.push({
        _id: -1
      });

      //TODO remove the stories after merging with the other features
      $scope.stories = project.backlog;
      $scope.project = project;
    };

    $scope.data = {};
    $scope.stories = [];
    $scope.allowReorder = true;
    Project.get({ id: $stateParams.project_id }, $scope.onProjectDataReceived);

    // Error message if creating/editing a story failed
    $scope.failed = "";


    $scope.editStory = function(item) {
      $scope.failed = "";
      Modal.open({}, 'app/backlog/storyForm.html', 'StoryFormCtrl', {story: item}).result.then(function (res) {

        // Show the updating icon
        $scope.$broadcast("storyUpdating", res);
        // Actually trigger the update on the server

        Story.update(res, function(httpRes){
          // Update the table and remove updating icon
          // It is important to pass the local res, instead of the HTTP res, since
          // http returns a resource object whith circular dependencies that cannot be serialized.
          $scope.$broadcast("storyUpdated", res);              
        }, function(err) {
          $scope.failed = err.data;
          $scope.$broadcast("storyUpdateFailed", item._id, res);  
        });

      });
    };

    $scope.addStory = function () {
    $scope.failed = "";
    Modal.open({}, 'app/backlog/storyForm.html', 'StoryFormCtrl', {projectId: $stateParams.project_id})
      .result.then(function (res) {
        res.$save(function (httpRes){
          console.log(httpRes);
          $scope.stories.push(httpRes);
        }, function(err) {
          $scope.failed = err.data;
        });
      });
    };

    $scope.$on('updateView', function () {
      Project.get({ id: $stateParams.project_id  }, $scope.onProjectDataReceived);
    });

    //XXX a bug on reordering
    $scope.dragControlListeners = {
      //override $scope.allowReorder to determine drag is allowed or not. default is true.
      accept: function (sourceItemHandleScope, destSortableScope) {return $scope.allowReorder},
      itemMoved: function (event) {},
      orderChanged: function(event) {
        $scope.allowReorder = false;
        if(event.source.itemScope.item._id !== -1) {
          // normal story
          
          var oldIndex = event.source.index;
          var newIndex = event.dest.index;
          // Do math with the index to considerate the delimiter
          if(oldIndex > $scope.project.offset) oldIndex--;
          if(newIndex > $scope.project.offset) newIndex--;

          console.log("drag " + oldIndex + " to " + newIndex);

          $http.put('/api/projects/'+ $scope.project._id + '/reorder', {
            oldIndex: oldIndex,
            newIndex: newIndex
          }).then(function(res) {
            $scope.allowReorder = true;
          });
        } else {
          // delimiter
          // Update offset according to the new position
          $scope.project.offset = event.dest.index;

          // TODO issue a different request
          console.log("drag last to " + $scope.project.offset);
          $scope.allowReorder = true;
        }
      }
   };

}]);

angular.module('arseApp').controller('StoryFormCtrl', 
  ['$scope', '$uibModalInstance', 'items', 'Story', function($scope, $uibModalInstance, items, Story){

  $scope.storyTypes = ["Feature", "Enhancement", "Fix"];
  $scope.availableSPs = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];

  $scope.story = {};
  if(items.story){
    $scope.create = false;
    angular.copy(items.story, $scope.story);
    $scope.title = "Edit Story";
  }else{
    $scope.create = true;
    $scope.title = "Create Story";
  }

  $scope.createOrUpdateStory = function() {
    if ($scope.story.name && $scope.story.description) {
      if($scope.create) {
        $scope.createStory();
      } else {
        $scope.updateStory();
      }
    }
  };

  // Use the original story, so that id, reference to project, etc. is staying the same
  $scope.updateStory = function(){
    $uibModalInstance.close($scope.story);
  };

  $scope.createStory = function() {
    $scope.story = new Story({
      name:$scope.story.name, 
      project:items.projectId, 
      description: $scope.story.description, 
      points: $scope.story.points, 
      summary: $scope.story.summary, 
      type: $scope.story.type,
      orderId: items.orderId
    });
    $uibModalInstance.close($scope.story);
  };

  $scope.close = function(){
    $uibModalInstance.dismiss('cancel');
  };  
}]);
