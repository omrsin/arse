'use strict';
//TODO pass the project instead of fetching it!
angular.module('arseApp')
  .controller('ProjectNavbarCtrl', ['$scope', '$stateParams', '$state', "Project", function ($scope, $stateParams, $state, Project) {
    
    Project.get({ id: $stateParams.project_id, role: true }, function (project) {
      $scope.nav_project = project;
      $scope.hasPORights = project.role === "PO";
    });

    $scope.showProductBacklog = function(){
      $state.go("backlog", { project_id: $scope.nav_project._id });
    };

    $scope.showSprintBoard = function(){
      if($scope.nav_project.current_sprint) {        
        $state.go("sprintBoard", { project_id: $stateParams.project_id, sprint_id: $scope.nav_project.current_sprint });
      }
    };

    $scope.showChat = function(){
      $state.go("chat", { project_id: $stateParams.project_id });
    }

    $scope.showUserManagement = function(){
      $state.go("userManagement", { project_id: $stateParams.project_id });
    };
    
    $scope.showPastSprints = function(){
      $state.go("showPastSprints", {project_id: $stateParams.project_id});
    };

    $scope.showConfiguration = function(){
      $state.go("configuration", { project_id: $stateParams.project_id });
    };
  }]);