'use strict';

angular.module('arseApp')
  .controller('LoginCtrl', function($scope, Auth, $state, $window) {
    $scope.user = {};
    $scope.errors = {};

    $scope.login = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then(function() {
          // Logged in, redirect to home
          $window.location.assign($state.href('project'));          
        })
        .catch(function(err) {
          $scope.errors.other = err.message;
        });
      }
    };

  });
