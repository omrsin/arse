'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Project', '$http', '$stateParams', 'Modal', 'Story', function ($scope, Project, $http, $stateParams, Modal, Story) {
    $scope.data = {};
    $scope.stories = [];
    Project.get({ id: $stateParams.project_id }, function (project) {
      //TODO remove the stories after merging with the other features
      $scope.stories = project.backlog;
      $scope.project = project;
    });


    $scope.editStory = function(item) {
          var modalScope = $scope.$new();
          //angular.extend(modalScope, scope);
          Modal.open({}, 'app/backlog/storyForm.html', 'StoryFormCtrl', {story: item}).result.then(function (res) {

            // Show the updating icon
            $scope.$broadcast("storyUpdating", res);
            // Actually trigger the update on the server

            Story.update(res, function(httpRes){
              // Update the table and remove updating icon
              // It is important to pass the local res, instead of the HTTP res, since
              // http resturn a resource object whith circular dependencies that cannot be serialized.
              $scope.$broadcast("storyUpdated", res);              
            }, function(err) {
              $scope.$broadcast("storyUpdateFailed", res._id, err);
            });

          });
        };

    $scope.addStory = function () {
      Modal.open({}, 'app/backlog/storyForm.html', 'StoryFormCtrl', {projectId: $stateParams.project_id, orderId: $scope.stories.length})
      .result.then(function (res) {
        //TODO handle network latencies and errors pleaseee
        res.$save(function (httpRes){
          console.log(httpRes);
          $scope.stories.push(httpRes);
        });
      });
    };

    $scope.$on('updateView', function () {
      Project.get({ id: $stateParams.project_id  }, function (project) {
        $scope.stories = project.backlog;
      });
    });

    $scope.dragControlListeners = {
      accept: function (sourceItemHandleScope, destSortableScope) {return true},//override to determine drag is allowed or not. default is true.
      itemMoved: function (event) {},
      orderChanged: function(event) {
        $scope.$broadcast('orderChanged');
      },
   };

}]);

angular.module('arseApp').controller('StoryFormCtrl', 
  ['$scope', '$uibModalInstance', 'items', 'Story', function($scope, $uibModalInstance, items, Story){

  $scope.story = {};

  $scope.storyTypes = ["Feature", "Enhancement", "Fix"];
  $scope.availableSPs = [0, 1, 2, 3, 5, 8, 13, 20, 40, 100];

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
