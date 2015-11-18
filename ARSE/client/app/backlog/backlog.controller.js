'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Project', '$http', 'Modal', 'Story', function ($scope, Project, $http, Modal, Story) {
    $scope.data = {};
    $scope.stories = [];
    $scope.project_id = "563a329c1c4584de0ac59349";
    Project.get({ id: $scope.project_id }, function (project) {
      $scope.stories = project.backlog;
    });


    $scope.editStory = function(item) {
          var modalScope = $scope.$new();
          //angular.extend(modalScope, scope);
          Modal.open($scope, 'editStoryModalContent.html', 'EditModalInstanceCtrl', {story: item}).result.then(function (res) {

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
      Modal.open({}, 'app/pbi/pbi.html', 'PbiCtrl', $scope.project_id);
    };

    $scope.$on('updateView', function () {
      Project.get({ id: $scope.project_id }, function (project) {
        $scope.stories = project.backlog;
      });
    });

}]);

angular.module('arseApp').controller('EditModalInstanceCtrl', 
  ['$scope', '$uibModalInstance', 'items', function($scope, $uibModalInstance, items){


  $scope.editStory = {};
  angular.copy(items.story, $scope.editStory);
  
  $scope.updateStory = function(){
    $uibModalInstance.close($scope.editStory);
  };


  $scope.close = function(){
    $uibModalInstance.dismiss('cancel');
  };  

}]);
