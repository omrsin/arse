'use strict';

angular.module('arseApp')
  .controller('NavbarCtrl', ['$scope', 'Modal', 'Auth', '$cookies', '$http', function ($scope, Modal, Auth, $cookies, $http) {

    //TODO: exclude password from info
    $scope.currentUser = {};
    if($cookies.get('token')){
      $http.get('api/users/me').then(function(response){
      $scope.currentUser = response.data;
      console.log(JSON.stringify($scope.currentUser));
    }); 
    }
 
    $scope.isLoggedIn = false;
    Auth.isLoggedIn(function(loggedIn){
      $scope.isLoggedIn = loggedIn;
      console.log("is logged in " + $scope.isLoggedIn);
    });
    
    $scope.menu = [
      {
        'title': 'Project',
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
