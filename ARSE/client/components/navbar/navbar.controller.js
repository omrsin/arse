'use strict';

angular.module('arseApp')
  .controller('NavbarCtrl', ['$scope', 'Modal', 'Auth', '$cookies', '$http', function ($scope, Modal, Auth, $cookies, $http) {

    $scope.currentUser = {};
    if($cookies.get('token')){
      $http.get('api/users/me').then(function(response){
        $scope.currentUser = response.data;
      }); 
    }
 
    $scope.isLoggedIn = false;
    Auth.isLoggedIn(function(loggedIn){
      $scope.isLoggedIn = loggedIn;      
    });
    
    $scope.menu = [
      {
        'title': 'Projects',
        'state': 'project'
      }
    ];

    $scope.rightMenu = [      
      {
        'title': 'Logout',
        'state': 'logout'
      }
    ]
    
    $scope.account = [
      {
        'title': 'Login',
        'state': 'login'
      },
      {
        'title': 'Register',
        'state': 'signup'
      }
    ];

    $scope.isCollapsed = true;
  }]);
