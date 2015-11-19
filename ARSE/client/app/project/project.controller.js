'use strict';

angular.module('arseApp')
  .controller('ProjectCtrl', ['$scope', '$state', 'Project', 'Modal', function ($scope, $state, Project, Modal) {
    
    $scope.projects = [];
    // Error message if creating a project failed
    $scope.creationFailed = "";

    Project.query(function (projects) {
      $scope.projects = projects;
    });

    $scope.$on('updateView', function () {
      Project.query(function (projects) {
        $scope.projects = projects;
      });
    });

    $scope.new = function () {
      $scope.modal = Modal.open({}, 'app/project/new.html', 'ProjectModalCtrl', {}).result.then(function (project) {
        project.$save(function (res) {
          console.log(res);
          $scope.$emit('updateView');
        }, function(err) {
          $scope.creationFailed = err.data;
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
      }
    };

    $scope.cancel = function(){      
      $uibModalInstance.dismiss();
    };
  }]);