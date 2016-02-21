'use strict'

angular.module('arseApp')
	.controller('PastSprintCtrl', ['$scope', '$state', 'project', '$stateParams', function ($scope, $state, project, $stateParams) {
		$scope.project = project;
		
		// check current state
		console.log(JSON.stringify($state.current.name));

		// Project.get({ id: $stateParams.project_id, pastsprints: true }, function (project) {
		// 	$scope.project = project;
		// });

	}]);