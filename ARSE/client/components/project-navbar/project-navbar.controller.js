'use strict';

angular.module('arseApp')
  .controller('ProjectNavbarCtrl', ['$scope', '$stateParams', '$state', "Project", function ($scope, $stateParams, $state, Project) {
    

    Project.get({ id: $stateParams.project_id }, function (p) {
      $scope.nav_project = p;
      console.log("Project:")
      console.log($scope.nav_project);
    });

    $scope.showProductBacklog = function(){      
      console.log("This is working");
      $state.go("backlog", { project_id: $scope.nav_project._id });
    };

    $scope.showSprintBoard = function(){
      if($scope.nav_project.current_sprint) {
        console.log("Entered there");
        $state.go("sprintBoard", { project_id: $stateParams.project_id, sprint_id: $scope.nav_project.current_sprint });
      }
    };

  }]);