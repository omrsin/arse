'use strict';

angular.module('arseApp')
  .controller('PbiCtrl', function ($scope) {
    $scope.message = 'Hello';
    $scope.createStory = function(form) {
      console.log($scope.name);
      console.log($scope.description);
      console.log($scope.points);
      console.log($scope.summary);
    }
  });
