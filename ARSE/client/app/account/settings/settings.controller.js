'use strict';

angular.module('arseApp')
  .controller('SettingsCtrl', function($scope, User, Auth) {
    $scope.errors = {};

    // TODO don't bring the password
    $scope.user = User.get();
    console.log($scope.user);

    $scope.editUser = function(form) {
      $scope.submitted = true;
      if (form.$valid) {
        Auth.editUser($scope.user.username, $scope.user.oldPassword, $scope.user.newPassword)
          .then(function() {
            $scope.message = 'Password successfully changed.';
          })
          .catch(function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };
  });
