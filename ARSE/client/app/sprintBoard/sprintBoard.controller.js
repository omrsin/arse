'use strict';

angular.module('arseApp')
  .controller('SprintBoardCtrl', ['$scope', '$stateParams', '$http', function ($scope, $stateParams, $http) {
    $scope.project_id = $stateParams.project_id;
    $scope.sprint_id = $stateParams.sprint_id;

    $http({
      url: '/api/projects/' + $scope.project_id + '/sprints/current', 
      method: "GET",
      params: {stories: true}
    }).then(function(res) {
      $scope.sprint = res.data;
      console.log(res.data);
    });


  }]);
