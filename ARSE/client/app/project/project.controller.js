'use strict';

angular.module('arseApp')
  .controller('ProjectCtrl', ['$scope', '$state', 'Project', 'Modal', function ($scope, $state, Project, Modal) {
    
    $scope.projects = [];

    Project.query(function (projects) {
      $scope.projects = projects;
    });

    $scope.$on('updateView', function () {
      Project.query(function (projects) {
        $scope.projects = projects;
      });
    });

    $scope.new = function () {
      console.log("New");
      $scope.project_id = "Bitch";
      $scope.modal = Modal.open({}, 'app/project/new.html', 'ProjectModalCtrl', $scope.project_id);      
    };

    $scope.show = function(project){
      $state.go("backlog", { project_id: project._id });
    };
  }])
  .controller('ProjectModalCtrl', ['$scope', '$uibModalInstance', 'items', 'Project', '$rootScope', function($scope, $uibModalInstance, items, Project, $rootScope) {

    $scope.create = function () {      
      if ($scope.name && $scope.description) {
        var newProject = new Project({ name: $scope.name, description: $scope.description });
        newProject.$save(function (res) {
          console.log(res);
          $uibModalInstance.close();
        });
      } else {
        //TODO error message
      }
    };

    $scope.cancel = function(){      
      $uibModalInstance.dismiss();
    };
  }]);