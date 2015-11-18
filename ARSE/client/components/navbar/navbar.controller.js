'use strict';

angular.module('arseApp')
  .controller('NavbarCtrl', ['$scope', 'Modal', function ($scope, Modal) {
    $scope.menu = [{
      'title': 'Home',
      'state': 'main'
    },
    {
      'title': 'Project',
      'state': 'project'
    }];

    $scope.isCollapsed = true;
  }]);
