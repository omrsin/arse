'use strict';

angular.module('arseApp')
  .controller('ProjectNavbarCtrl', ['$scope', '$stateParams', '$state', "Project", function ($scope, $stateParams, $state, Project) {
    
    var project;

    project = Project.get({ id: $stateParams.project_id });

    $scope.showProductBacklog = function(){      
      $state.go("backlog", { project_id: project._id });
    };

    $scope.showSprintBoard = function(){
      $state.go("sprintBoard", { project_id: $stateParams.project_id, sprint_id: project.current_sprint });
    };

    $scope.showUserManagement = function(){
      $state.go("userManagement", { project_id: project._id });
    };

    $scope.showConfiguration = function(){
      $state.go("userManagement", { project_id: project._id });
    };
  }]);