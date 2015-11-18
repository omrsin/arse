'use strict';

angular.module('arseApp')
  .controller('PbiCtrl', ['$scope', 'Story', '$location', '$stateParams', '$uibModalInstance', 'items',  function($scope, Story, $location, $stateParams, $uibModalInstance, items) {
    $scope.message = 'Hello';
    var orderId = items;
    console.log('The order ID is currently: ' +orderId);
    $scope.createStory = function(form) {

      $scope.story = new Story({name:$scope.name, project:$stateParams.project_id, description: $scope.description, points: $scope.points, summary: $scope.summary, orderId: orderId})
      $scope.story.$save(function (res){
        console.log(res);
        $uibModalInstance.close(res);
      });
    };
  }]);
