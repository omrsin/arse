'use strict';

angular.module('arseApp')
  .controller('ConfigurationCtrl',['$scope', 'project', '$stateParams', '$http', function ($scope, project, $stateParams, $http) {
    $scope.project = project;
    // Set if we have the PO right
    $scope.hasPORights = $scope.project.role === "PO";
    $scope.storyTypeField = "";


    $scope.addStoryType = function (type) {
      $scope.failed = "";
      console.log("adding " + type);
      $http.post('/api/projects/'+$stateParams.project_id+'/config/addStoryType', {type: type}).then(function(res){
        console.log("added");
      },
      function(error) {
          console.log("not added: " + error.data);
          $scope.failed = error.data;
      });
    };

    $scope.deleteStoryType = function (type) {
      $scope.failed = "";
      console.log("delete " + type);
      $http.post('/api/projects/'+$stateParams.project_id+'/config/removeStoryType', {type: type}).then(function(res){
        console.log("deleted");
      },
      function(error) {
          console.log("not deleted: " + error.data);
          $scope.failed = error.data;
      });
    };
  }]);
