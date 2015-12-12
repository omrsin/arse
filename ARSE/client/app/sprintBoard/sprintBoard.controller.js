'use strict';

angular.module('arseApp')
  .controller('SprintBoardCtrl', ['$scope', '$stateParams', '$http', 'Modal', '$state', function ($scope, $stateParams, $http, Modal, $state) {
    $scope.project_id = $stateParams.project_id;
    $scope.sprint;

    $http({
      url: '/api/projects/' + $scope.project_id + '/sprints/current',
      method: "GET",
      params: { stories: true }
    }).then(function (res) {
      $scope.sprint = res.data;
      console.log(res.data);
    });

    $scope.closeSprint = function () {
      var unfinishedStories = false;
      var message = "Are you sure you want to close this sprint?";
      angular.forEach($scope.sprint.stories, function(value, index){
        if(value.status != "Done")
          unfinishedStories = true;
      });
      if(unfinishedStories)
        message += " Some stories are still not done";
      Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl', 
      { message:  message}).result.then(function (res) {
        console.log('Deleting Item');
        // update the api PROPERLY
        $http.put('/api/projects/'+ $scope.project_id +'/sprints/current/close').then(function () {
          // scope.$emit('updateView');
          $state.go('backlog', { 'project_id':$scope.project_id });
          
        });
      });
    };


  }]);
