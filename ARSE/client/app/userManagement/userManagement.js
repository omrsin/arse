'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('userManagement', {
        url: '/projects/:project_id/userManagement',
        templateUrl: 'app/userManagement/userManagement.html',
        controller: 'UserManagementCtrl',
        authenticate: true,
        resolve: {
          project: function(Project, $stateParams){
            return Project.get({ id: $stateParams.project_id, role: true }).$promise;        
          }
        }
      });
  });
