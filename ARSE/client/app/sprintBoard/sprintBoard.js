'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sprintBoard', {
        url: '/sprintBoard',
        templateUrl: 'app/sprintBoard/sprintBoard.html',
        controller: 'SprintBoardCtrl'
      });
  });
