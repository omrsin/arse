'use strict';

angular.module('arseApp')
  .controller('ProjectCtrl', ['$scope', 'Project', function ($scope, Project) {

    $scope.projects = [];
    
    Project.query( function (projects) {
      $scope.projects = projects;
    });
    
    $scope.newProject = function () {
      console.log("Add Project");
    }

  }]);
