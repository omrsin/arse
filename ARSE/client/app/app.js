'use strict';

angular.module('arseApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'btford.socket-io',
  'ui.router',
  'ui.bootstrap',
	'validation.match',
  'as.sortable'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider,
		$httpProvider) {
    $urlRouterProvider
      .otherwise('/projects');

    $locationProvider.html5Mode(true);
		$httpProvider.interceptors.push('authInterceptor');
  })
	.factory('authInterceptor', function($rootScope, $q, $cookies, $injector){
		var state;
		return {
			// add authorization token to headers
			request: function(config){
				config.headers = config.headers || {};
				if($cookies.get('token')){
					config.headers.Authorization = 'Bearer ' + $cookies.get('token');
				}
				return config;
			},

			// Intercept 401s and redirect you to login
      responseError: function(response) {
        if (response.status === 401) {
          (state || (state = $injector.get('$state'))).go('login');
          // remove any stale tokens
          $cookies.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
		};
	})
	.run(function($rootScope, $state, Auth){
    
    // Redirects to the previous state in case the stateChangeError event is triggered
    // This event is triggered usually when promises are rejected while resolving the routes
    $rootScope.$on("$stateChangeError", function (event, toState, toParams, fromState, fromParams, error) {
      console.log("Unauthorized resource");
      if(fromState.name){ $state.go(fromState); }
      else { $state.go('project');}
    });

		// Redirect to login if route requires auth and the user is not logged in
    $rootScope.$on('$stateChangeStart', function(event, next) {
      if (next.authenticate) {
        Auth.isLoggedIn(function(loggedIn) {
          if (!loggedIn) {
            event.preventDefault();
            $state.go('login');
          }
        });
      }
    });
	});
