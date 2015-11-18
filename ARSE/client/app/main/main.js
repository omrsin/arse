'use strict';

angular.module('arseApp')
  .config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('/', '/projects');
    $stateProvider
      .state('main', {
        url: '/',
        redirectTo: '/projects'/*,
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'*/
      });
  });
