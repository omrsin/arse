'use strict'

angular.module('arseApp')
	.controller('PastSprintCtrl', ['$scope', '$state', 'project', '$stateParams', function ($scope, $state, project, $stateParams) {
		$scope.project = project;
	}]);