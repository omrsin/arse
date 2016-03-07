'use strict';

angular.module('arseApp')
  .controller('ConfigurationCtrl', ['$scope', 'project', '$stateParams', '$http', 'Modal', function ($scope, project, $stateParams, $http, Modal) {
    $scope.project = project;
    // Set if we have the PO right
    $scope.hasPORights = $scope.project.role === "PO";
    $scope.storyTypeField = "";
    
    $scope.statusToAdd = "";


    $scope.addStoryType = function (type) {
      $scope.failed = "";
      console.log("adding " + type);
      $http.post('/api/projects/' + $stateParams.project_id + '/config/addStoryType', { type: type }).then(function (res) {
        $scope.project = res.data;
        $scope.storyTypeField = "";
      },
        function (error) {
          $scope.failed = error.data;
        });
    };

    $scope.deleteStoryType = function (type) {
      Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl',
        { message: "Are you sure you want to delete the story type?" }).result.then(function (res) {
          $scope.failed = "";
          console.log("deleting " + type);
          $http.post('/api/projects/' + $stateParams.project_id + '/config/removeStoryType', { type: type }).then(function (res) {
            $scope.project = res.data;
          },
            function (error) {
              $scope.failed = error.data;
            });
        });
    };

    $scope.addStatus = function (status) {
      $scope.status_failed = "";
      console.log("adding status");
      $http.post('/api/projects/' + $stateParams.project_id + '/config/addStoryStatus', { status: status }).then(function (res) {
        $scope.project = res.data;
        $scope.statusToAdd = "";
      },
        function (error) {
          $scope.status_failed = error.data;
        });
    };

    $scope.deleteStatus = function (status) {
      Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl',
        { message: "Are you sure you want to delete this story status?" }).result.then(function (res) {
          $scope.status_failed = "";
          console.log("deleting " + status);
          $http.post('/api/projects/' + $stateParams.project_id + '/config/removeStoryStatus', { status: status }).then(function (res) {
            $scope.project = res.data;
          },
            function (error) {
              $scope.status_failed = error.data;
            });
        });
    };
  }]);
