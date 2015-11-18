'use strict';

angular.module('arseApp')
  .controller('AddProjectCtrl', ['$scope', 'Project', '$location', function ($scope, Project, $location) {

    $scope.insertProject = function () {
      console.log("clicked");
      if ($scope.name && $scope.description) {
        console.log($scope.name);

        var newProject = new Project({ name: $scope.name, description: $scope.description });
        newProject.$save(function (res) {
          console.log(res);
          $location.path("/projects")

        });
     	} else {
        //TODO error message
     	}


    }
  }]);
