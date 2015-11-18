'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('projects', {
        url: '/projects',
        templateUrl: 'app/project/project.html',
        controller: 'ProjectCtrl'
      })
      .state('projects.new', {
        url: '/new',
        templateUrl: 'app/project/new.html',
        controller: 'ProjectCtrl'
      });
  });