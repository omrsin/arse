'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Project', '$http', 'Modal', function ($scope, Project, $http, Modal) {
    $scope.data = {};
    $scope.stories = [];
    $scope.project_id = "564363fd8e2091333754b608";
    Project.get({ id: $scope.project_id }, function (project) {
      //TODO remove the stories after merging with the other features
      $scope.stories = project.backlog;
      $scope.project = project;
    });

    $scope.addStory = function () {
      Modal.open({}, 'app/pbi/pbi.html', 'PbiCtrl', $scope.project_id);
    };

    $scope.$on('updateView', function () {

      Project.get({ id: $scope.project_id }, function (project) {
        $scope.stories = project.backlog;

      });

    })
  }]);
