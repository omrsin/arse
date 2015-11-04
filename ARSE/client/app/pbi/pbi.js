'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('pbi', {
        url: '/pbi',
        templateUrl: 'app/pbi/pbi.html',
        controller: 'PbiCtrl'
      });
  });