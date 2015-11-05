'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Project',  function($scope, Project){
    $scope.data = {};
    $scope.stories = [];
    $scope.project_id = "563a2b327947c0cd2c3d7c2b";
    Project.get({id: $scope.project_id},function(project){
      $scope.stories = project.stories;
    });
  }]);

