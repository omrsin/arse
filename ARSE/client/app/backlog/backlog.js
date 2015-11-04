'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('backlog', {
        url: '/backlog',
        templateUrl: 'app/backlog/backlog.html',
        controller: 'BacklogCtrl'
      });
  });