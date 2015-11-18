'use strict';

angular.module('arseApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('backlog', {
        url: '/backlog/:project_id',
        templateUrl: 'app/backlog/backlog.html',
        controller: 'BacklogCtrl'
       /* resolve:  {
        	projects: function(){
        		return 
        	}
        }*/
      });
  });