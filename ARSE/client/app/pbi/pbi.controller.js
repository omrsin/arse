'use strict';

angular.module('arseApp')
  .controller('PbiCtrl', ['$scope', 'Story', '$location', '$stateParams', '$uibModalInstance', function($scope, Story, $location, $stateParams, $uibModalInstance) {
    $scope.message = 'Hello';
    console.log($scope);
    $scope.createStory = function(form) {
      console.log($scope.name);
      console.log($scope.description);
      console.log($scope.points);
      console.log($scope.summary);

      $scope.story = new Story({name:$scope.name, project:$stateParams.project_id, description: $scope.description, points: $scope.points, summary: $scope.summary})
      $scope.story.$save(function (res){
        console.log("Added this now");
        $uibModalInstance.dismiss('cancel');
      });
    }
  }]);
