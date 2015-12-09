'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sprintBoard', {
        // TODO make proper URLs e.g. /project/id/sprintBoard/id and /project/id/backlog, etc.
        url: '/sprintBoard/:project_id/:sprint_id',
        templateUrl: 'app/sprintBoard/sprintBoard.html',
        controller: 'SprintBoardCtrl'
      });
  });
