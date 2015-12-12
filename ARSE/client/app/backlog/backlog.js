'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('backlog', {
        url: '/projects/:project_id/backlog',
        templateUrl: 'app/backlog/backlog.html',
        controller: 'BacklogCtrl'
      });
  });