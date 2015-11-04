'use strict';

angular.module('arseApp')
  .controller('PbiCtrl', ['$scope', 'Story', function($scope, Story) {
    $scope.message = 'Hello';
    $scope.createStory = function(form) {
      console.log($scope.name);
      console.log($scope.description);
      console.log($scope.points);
      console.log($scope.summary);
      $scope.story = new Story({name:$scope.name, project:"563a2b49fbc778f12656a4cf", description: $scope.description, points: $scope.points, summary: $scope.summary})
      $scope.story.$save();
    }
  }]);
