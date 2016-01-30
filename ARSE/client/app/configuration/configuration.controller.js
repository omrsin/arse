'use strict';

angular.module('arseApp')
  .controller('ConfigurationCtrl',['$scope', 'project', '$stateParams', function ($scope, project, $stateParams) {
    $scope.project = project;
    // Set if we have the PO right
    $scope.hasPORights = $scope.project.role === "PO";
  }]);
