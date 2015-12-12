'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sprintBoard', {
        // TODO make proper URLs e.g. /project/id/sprintBoard/id and /project/id/backlog, etc.
        url: '/projects/:project_id/sprintBoard',
        templateUrl: 'app/sprintBoard/sprintBoard.html',
        controller: 'SprintBoardCtrl',
        authenticate: true
      });
  });
