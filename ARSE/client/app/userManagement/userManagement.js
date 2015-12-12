'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('userManagement', {
        // TODO make proper URLs e.g. /project/id/sprintBoard/id and /project/id/backlog, etc.
        url: '/projects/:project_id/userManagement',
        templateUrl: 'app/userManagement/userManagement.html',
        controller: 'UserManagementCtrl',
        authenticate: true
      });
  });
