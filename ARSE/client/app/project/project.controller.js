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
      // FIXME WTF!?
      $scope.project_id = "Bitch";
      $scope.modal = Modal.open({}, 'app/project/new.html', 'ProjectModalCtrl', {}).result.then(function (project) {
        // TODO include my nice alerts on failure!     
        project.$save(function (res) {
          console.log(res);
          $scope.$emit('updateView');
        });        
      });
    };

    $scope.show = function(project){
      $state.go("backlog", { project_id: project._id });
    };
  }])
  .controller('ProjectModalCtrl', ['$scope', '$uibModalInstance', 'items', 'Project', '$rootScope', function($scope, $uibModalInstance, items, Project, $rootScope) {

    $scope.create = function () {      
      if ($scope.name && $scope.description) {
        var project = new Project({ name: $scope.name, description: $scope.description });
        $uibModalInstance.close(project);
      } else {
        //TODO error message
      }
    };

    $scope.cancel = function(){      
      $uibModalInstance.dismiss();
    };
  }]);