'use strict';
angular.module('arseApp')
  .controller('ProjectNavbarCtrl', ['$scope', '$stateParams', '$state', "Project", function ($scope, $stateParams, $state, Project) {
    
    $scope.project = $scope.theproject;
    var l = $scope.project.role.length;
    $scope.hasPORights = $scope.project.role === "PO";

    $scope.showProductBacklog = function(){
      $state.go("backlog", { project_id: $scope.project._id });
    };

    $scope.showSprintBoard = function(){
      if($scope.project.current_sprint) {        
        $state.go("sprintBoard", { project_id: $stateParams.project_id, sprint_id: $scope.project.current_sprint });
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