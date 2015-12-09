'use strict';

angular.module('arseApp')
  .controller('NavbarCtrl', ['$scope', 'Modal', function ($scope, Modal) {
    $scope.menu = [
      {
        'title': 'Projects',
        'state': 'project'
      }
    ];

    $scope.isCollapsed = true;
  }]);
