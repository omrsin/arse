'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('configuration', {
        url: '/projects/:project_id/configuration',
        templateUrl: 'app/configuration/configuration.html',
        controller: 'ConfigurationCtrl',
        authenticate: true,
        resolve: {
          project: function(Project, $stateParams){
            return Project.get({ id: $stateParams.project_id, role: true }).$promise;        
          }
        }
      });
  });