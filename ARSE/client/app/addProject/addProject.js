'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('addProject', {
        url: '/add-project',
        templateUrl: 'app/addProject/addProject.html',
        controller: 'AddProjectCtrl'
      });
  });
