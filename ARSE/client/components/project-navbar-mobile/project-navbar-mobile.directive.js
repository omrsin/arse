'use strict';

angular.module('arseApp')
  .directive('projectNavbarMobile', function () {
    return {
      templateUrl: 'components/project-navbar-mobile/project-navbar-mobile.html',
      restrict: 'E',
      controller: 'ProjectNavbarCtrl'
    };
  });