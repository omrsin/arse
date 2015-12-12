'use strict';

angular.module('arseApp')
  .directive('participant', function ($http) {
    return {
      templateUrl: 'app/directives/participant/participant.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.item = angular.fromJson(attrs.participantItem);        
      }   
    };
  });