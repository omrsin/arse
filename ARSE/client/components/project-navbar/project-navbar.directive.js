'use strict';

angular.module('arseApp')
  .directive('projectNavbar', function () {
    return {
      templateUrl: 'components/project-navbar/project-navbar.html',
      restrict: 'E',
      scope: {
        theproject: '='
      },
      controller: 'ProjectNavbarCtrl'
    };
  });
