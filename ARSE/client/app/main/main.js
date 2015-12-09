'use strict';

angular.module('arseApp')
  .config(function($urlRouterProvider, $stateProvider) {
    $urlRouterProvider.when('/', '/projects');
    $stateProvider
      .state('main', {
        url: '/',
        redirectTo: '/projects',
        resolve: {
          currentUser: function(User, $cookies){
            if($cookies.get('token')){
              return User.get().$promise; 
            }
          }
        }
        
        /*,
        templateUrl: 'app/main/main.html',
        controller: 'MainController',
        controllerAs: 'main'*/
      });
  });
