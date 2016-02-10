'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('project', {
        url: '/projects',
        templateUrl: 'app/project/project.html',
        controller: 'ProjectCtrl',
        authenticate: true
      })
      .state('project.new', {
        url: '/new',
        templateUrl: 'app/project/new.html',
        controller: 'ProjectCtrl',
        authenticate: true
      })
      .state('showPastSprints', {
        url: '/projects/:project_id/pastsprints',
        templateUrl: 'app/project/past_sprints.html',
        controller: 'ProjectCtrl',
        authenticate: true
      });
  });