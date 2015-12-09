'use strict';

angular.module('arseApp')
  .controller('SprintBoardCtrl', ['$scope', '$stateParams', '$http', 'Modal', '$state', function ($scope, $stateParams, $http, Modal, $state) {
    $scope.project_id = $stateParams.project_id;
    $scope.sprint_id = $stateParams.sprint_id;

    $http({
      url: '/api/projects/' + $scope.project_id + '/sprints/' + $scope.sprint_id,
      method: "GET",
      params: { stories: true }
    }).then(function (res) {
      $scope.sprint = res.data;
      console.log(res.data);
    });

    $scope.closeSprint = function () {
      Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl', { message: "Are you sure you want to close this sprint?" }).result.then(function (res) {
        console.log('Deleting Item');
        // update the api PROPERLY
        $http.put('/api/projects/'+ $scope.project_id +'/sprints/'+ $scope.sprint_id +'/close').then(function () {
          // scope.$emit('updateView');
          $state.go('backlog', { 'project_id':$scope.project_id });
          
        });
      });
    };


  }]);
