'use strict';

angular.module('arseApp')
  .controller('ProjectCtrl',[ '$scope', 'Project',  function ($scope, Project) {
    $scope.message = 'Hello';

    $scope.insertProject = function () {
        $scope.isCreated = false;
        $scope.creationFailed = "";

    	if($scope.name && $scope.description){
    		var newProject = new Project({name: $scope.name, description: $scope.description});
			newProject.$save(
                // success
                function(res) {
                    $scope.isCreated = true;
                },
                // failure
                function(res) {
                    $scope.creationFailed = res.data;
                });
     	}
    }
  }]);
