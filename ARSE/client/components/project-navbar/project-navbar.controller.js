'use strict';

angular.module('arseApp')
  .controller('ProjectNavbarCtrl', ['$scope', '$stateParams', '$state', "Project", function ($scope, $stateParams, $state, Project) {
    

    Project.get({ id: $stateParams.project_id }, function (p) {
      $scope.nav_project = p;
      console.log("Project:")
      console.log($scope.nav_project);
    });

    $scope.showProductBacklog = function(){
      $state.go("backlog", { project_id: $scope.nav_project._id });
    };

    $scope.showSprintBoard = function(){
      if($scope.nav_project.current_sprint) {        
        $state.go("sprintBoard", { project_id: $stateParams.project_id, sprint_id: $scope.nav_project.current_sprint });
      }
    };

    $scope.showUserManagement = function(){
      $state.go("userManagement", { project_id: project._id });
    };

    $scope.showConfiguration = function(){
      $state.go("userManagement", { project_id: project._id });
    };
  }]);