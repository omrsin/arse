'use strict';

angular.module('arseApp')
  .directive('user', function ($http) {
    return {
      templateUrl: 'app/directives/user/user.html',
      restrict: 'E',
      scope: {
        search:'=',
        index: '@'        
      },
      link: function (scope, element, attrs) {
        scope.item = angular.fromJson(attrs.userItem);

        scope.clickUserRow = function(){
          console.log(scope.search.text);
          scope.search.text = scope.item.email;
        }
      }   
    };
  });