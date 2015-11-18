'use strict';

angular.module('arseApp')
  .controller('ProjectCtrl', ['$scope', 'Project', '$state', function ($scope, Project, $state) {

    $scope.projects = [];

    Project.query(function (projects) {
      $scope.projects = projects;
    });

    $scope.$on('updateView', function () {

      Project.query(function (projects) {
        $scope.projects = projects;
      });

    });

    $scope.newProject = function () {
      console.log("Add Project");
    };

    $scope.showProject = function(project){
      $state.go("backlog", { project_id: project._id })
    };

  }]);
