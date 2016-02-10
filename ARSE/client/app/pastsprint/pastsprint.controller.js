'use strict'

angular.module('arseApp')
	.controller('PastSprintCtrl', ['$scope', '$state', 'Project', '$stateParams', function ($scope, $state, Project, $stateParams) {
		$scope.project;
		
		// check current state
		console.log(JSON.stringify($state.current.name));

		Project.get({ id: $stateParams.project_id, pastsprints: true }, function (project) {
			$scope.project = project;
			console.log("projects with past sprints; " + JSON.stringify(project));
		});

	}]);