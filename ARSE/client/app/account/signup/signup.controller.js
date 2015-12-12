'use strict';

angular.module('arseApp')
  .controller('SignupCtrl', function($scope, Auth, $state) {
    $scope.user = {};
    $scope.errors = {};

    $scope.register = function(form) {
      $scope.submitted = true;

      if (form.$valid) {
        Auth.createUser({
          username: $scope.user.username,
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then(function(token) {
          // Account created, redirect to home
          // TODO: create user scope, also delete on logout, show logout after login
          console.log(JSON.stringify(token));
          $state.go('main');
        })
        .catch(function(err) {
          err = err.data;
          $scope.errors = {};

          // Update validity of form fields that match the mongoose errors
          angular.forEach(err.errors, function(error, field) {
            form[field].$setValidity('mongoose', false);
            $scope.errors[field] = error.message;
          });
        });
      }
    };

  });