'use strict';

angular.module('arseApp')
  .controller('SprintBoardCtrl', function ($scope) {
    $scope.message = 'Hello';
    $scope.backlog = [{name: 'item1'}, {name: 'item2'}];
  });
