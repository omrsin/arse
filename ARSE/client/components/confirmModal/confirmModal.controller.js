'use strict';

angular.module('arseApp')
  .controller('ConfirmModalCtrl', ['$scope','$uibModalInstance','items', function ($scope, $uibModalInstance, items) {
    $scope.message = items.message;
    
    
    $scope.confirm = function () {
       $uibModalInstance.close();
    }

    $scope.close = function () {
      $uibModalInstance.dismiss('cancel');
    }
  }]);
