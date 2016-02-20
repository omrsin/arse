'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('showPastSprints', {
        url: '/projects/:project_id/pastsprints',
        templateUrl: 'app/pastsprint/past_sprints.html',
        controller: 'PastSprintCtrl',
        authenticate: true
      });
  });