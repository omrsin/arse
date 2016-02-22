'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('sprintBoard', {
        url: '/projects/:project_id/sprintBoard',
        templateUrl: 'app/sprintBoard/sprintBoard.html',
        controller: 'SprintBoardCtrl',
        authenticate: true,
        resolve: {
          project: function(Project, $stateParams){
            return Project.get({ id: $stateParams.project_id, role: true }).$promise;        
          }
        }
      });
  });
