'use strict'

angular.module('arseApp')
	.controller('PastSprintCtrl', ['$scope', '$state', 'project', '$stateParams', function ($scope, $state, project, $stateParams) {
		$scope.project = project;
    $scope.showDetails = false;
    $scope.detailSprint = {};

    $scope.showSprintDetails = function (item) {
      if ($scope.detailSprint._id == item._id) {
        $scope.detailSprint = {};
        $scope.showDetails = false;
      } else {
        $scope.detailSprint = item;
        $scope.showDetails = true;
      }
      console.log($scope.showDetails);
      console.log($scope.detailSprint);
    };

	}]);