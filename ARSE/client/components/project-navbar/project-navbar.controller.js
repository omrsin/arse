'use strict';

angular.module('arseApp')
  .controller('ProjectNavbarCtrl', ['$scope', '$stateParams', '$state', "Project", function ($scope, $stateParams, $state, Project) {
    

    Project.get({ id: $stateParams.project_id }, function (p) {
      $scope.project = p;
      console.log("Project:")
      console.log($scope.project);
    });

    $scope.showProductBacklog = function(){      
      console.log("This is working");
      $state.go("backlog", { project_id: $scope.project._id });
    };

    $scope.showSprintBoard = function(){
      if($scope.project.current_sprint) {
        console.log("Entered there");
        $state.go("sprintBoard", { project_id: $stateParams.project_id, sprint_id: $scope.project.current_sprint });
      }
    };

  }]);