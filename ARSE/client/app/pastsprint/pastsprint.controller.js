'use strict'

angular.module('arseApp')
	.controller('PastSprintCtrl', ['$scope', '$state', 'project', '$stateParams', function ($scope, $state, project, $stateParams) {
		$scope.project = project;
    $scope.showDetails = false;

    $scope.showSprintDetails = function (item) {
      // if ($scope.detailStory._id == item._id) {
      //   $scope.detailStory = {};
      //   $scope.showDetails = false;
      // } else {
      //   $scope.detailStory = item;
      //   $scope.showDetails = true;
      // }
      console.log($scope.showDetails);
      $scope.showDetails = !$scope.showDetails;
    };

	}]);