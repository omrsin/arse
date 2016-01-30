'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('chat', {
        // TODO make proper URLs e.g. /project/id/sprintBoard/id and /project/id/backlog, etc.
        url: '/projects/:project_id/chat',
        templateUrl: 'app/chat/chat.html',
        controller: 'ChatCtrl',
        // authenticate: true,
        resolve: {
          project: function(Project, $stateParams){
            return Project.get({ id: $stateParams.project_id }).$promise;        
          }
        }
      });
  });
