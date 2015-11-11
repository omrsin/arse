'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Project', '$http', function ($scope, Project, $http) {
    $scope.data = {};
    $scope.stories = [];
    $scope.project_id = "56407df1696d89ff090d9de7";
    Project.get({ id: $scope.project_id }, function (project) {
      $scope.stories = project.backlog;
    });
    
//     $scope.addStory = function () {
//       
//       var modalInstance = $uibModal.open( {
//         animation: true,
//         templateUrl: 'backlog.html',
//         controller: 'BacklogCtrl'
// 
//       });
//       
//     }

    $scope.$on('updateView', function () {

      Project.get({ id: $scope.project_id }, function (project) {
        $scope.stories = project.backlog;

      });

    })
  }]);

