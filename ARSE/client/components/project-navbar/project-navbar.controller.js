'use strict';

angular.module('arseApp')
  .controller('ProjectNavbarCtrl', ['$scope', '$stateParams', '$state', "Project", function ($scope, $stateParams, $state, Project) {
    
    var project;

    project = Project.get({ id: $stateParams.project_id });

    $scope.showProductBacklog = function(){      
      console.log("This is working");
      $state.go("backlog", { project_id: project._id });
    };

    $scope.showSprintBoard = function(){
      console.log("Entered there");
      $state.go("sprintBoard", { project_id: $stateParams.project_id, sprint_id: project.current_sprint });
    };

  }]);