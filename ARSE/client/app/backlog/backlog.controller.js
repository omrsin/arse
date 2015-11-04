'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Story', function($scope, Story){
    $scope.data = {};
    $scope.showStories = function(){
      $scope.data = Story.get();
    };
  }]);
