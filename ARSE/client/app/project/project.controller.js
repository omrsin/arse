'use strict';

angular.module('arseApp')
  .controller('ProjectCtrl', ['$scope', '$state', 'Project', 'Modal', function ($scope, $state, Project, Modal) {
    
    $scope.projects = [];
    // Error message if creating a project failed
    $scope.failed = "";

    Project.query(function (projects) {
      $scope.projects = projects;
    });

    $scope.$on('updateView', function () {
      Project.query(function (projects) {
        $scope.projects = projects;
      });
    });

    $scope.new = function () {
      $scope.failed = "";
      Modal.open({}, 'app/project/new.html', 'ProjectModalCtrl', {}).result.then(function (project) {
        project.$save(function (res) {
          $scope.$emit('updateView');
        }, function(err) {
          $scope.failed = err.data;
        });        
      });
    };

    $scope.editProject = function(item) {
      $scope.failed = "";
      Modal.open({}, 'app/project/new.html', 'ProjectModalCtrl', {project: item}).result.then(function (project) {
        Project.update(project, function (res) {
          $scope.$emit('updateView');
        }, function(err) {
          $scope.failed = err.data;
        });        
      });
    };

    $scope.show = function(project){
      $state.go("backlog", { project_id: project._id });
    };
}]);

  // Modal controller
angular.module('arseApp').controller('ProjectModalCtrl', 
  ['$scope', '$uibModalInstance', 'items', 'Project', function($scope, $uibModalInstance, items, Project) {


  $scope.project = {};
  if(items.project){
    $scope.create = false;
    angular.copy(items.project, $scope.project);
    $scope.title = "Edit Project";
  }else{
    $scope.create = true;
    $scope.title = "Create Project";
  }

  $scope.createOrUpdateProject = function() {
    if ($scope.project.name && $scope.project.description) {
      if($scope.create) {
        $scope.createProject();
      } else {
        $scope.updateProject();
      }
    }
  };


  // Use the original story, so that id is staying the same
  $scope.updateProject = function(){
    $uibModalInstance.close($scope.project);
  };

  $scope.createProject = function () {      
    $scope.project = new Project({ 
      name: $scope.project.name, 
      description: $scope.project.description 
    });
    $uibModalInstance.close($scope.project);
  };

  $scope.cancel = function(){      
    $uibModalInstance.dismiss();
  };
}]);