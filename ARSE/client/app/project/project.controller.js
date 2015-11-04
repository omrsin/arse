'use strict';

angular.module('arseApp')
  .controller('ProjectCtrl',[ '$scope', 'Project',  function ($scope, Project) {
    $scope.message = 'Hello';

    $scope.insertProject = function () {
    	if($scope.name && $scope.description){
    		console.log($scope.name);

    		var newProject = new Project({name: $scope.name, description: $scope.description});
			newProject.$save();
     	} else {
     		//TODO error message
     	}
    }
  }]);
