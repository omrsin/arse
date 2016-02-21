'use strict';

angular.module('arseApp')
  .controller('SettingsCtrl', function($scope, User, Auth, $state, $window) {
    $scope.errors = {};

    // TODO don't bring the password
    $scope.user = User.get();
    console.log($scope.user);

    $scope.editUser = function(form) {
      $scope.submitted = true;
      form.password.$setValidity('mongoose', true);
      form.newPassword.$setValidity('mongoose', true);
      form.confirmPassword.$setValidity('mongoose', true);
      if (form.$valid) {
        Auth.editUser($scope.user.username, $scope.user.oldPassword, $scope.user.newPassword)
          .then(function() {
            $scope.message = 'User successfully edited.';
            $window.location.assign($state.href('project'));
          })
          .catch(function() {
            form.password.$setValidity('mongoose', false);
            $scope.errors.other = 'Incorrect password';
            $scope.message = '';
          });
      }
    };
  });
