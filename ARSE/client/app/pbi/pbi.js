'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pbi', {
        url: '/pbi/:project_id',
        templateUrl: 'app/pbi/pbi.html',
        controller: 'PbiCtrl'
      });
  });