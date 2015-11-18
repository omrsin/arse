'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Project', '$http', '$uibModal', '$rootScope', function ($scope, Project, $http, $uibModal, $rootScope) {
    $scope.data = {};
    $scope.stories = [];
    $scope.project_id = "564c45cee63398eb102348b5";
    Project.get({ id: $scope.project_id }, function (project) {
      $scope.stories = project.backlog;
    });

    $scope.$on('updateView', function () {
      Project.get({ id: $scope.project_id }, function (project) {
        $scope.stories = project.backlog;
      });
    });

    // TODO This is called twice atm
    $rootScope.$on('storyUpdated', function (event, story) {
      //angular.foreach()
      // This is not printed NOOOOOO!
      $scope.story = story;
      console.log("broadcast: " + JSON.stringify(story));
    });

}]);

angular.module('arseApp').controller('EditModalInstanceCtrl', 
  ['$scope', '$uibModalInstance', 'story', 'Story', '$rootScope', function($scope, $uibModalInstance, story, Story, $rootScope){
  $scope.editStory = {};
  //var editStory = {};
  angular.copy(story, $scope.editStory);

  $scope.updateStory = function(){
    
    console.log("edit2: " + JSON.stringify($scope.editStory));

    Story.update($scope.editStory, function(res){
      console.log("res: " + JSON.stringify(res));
      // Broadcast
      $rootScope.$emit("storyUpdated", res);
    });

    $uibModalInstance.close();
  };


  $scope.close = function(){
    $uibModalInstance.dismiss('cancel');
  };  

}]);
