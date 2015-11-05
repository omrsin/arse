'use strict';

angular.module('arseApp')
  .controller('NavbarCtrl', function ($scope) {
    $scope.menu = [{
      'title': 'Home',
      'state': 'main'
    },
    {
      'title': 'Project',
      'state': 'project'
    }];

    $scope.isCollapsed = true;
  });
