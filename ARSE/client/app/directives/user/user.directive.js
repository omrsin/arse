'use strict';

angular.module('arseApp')
  .directive('user', function ($http) {
    return {
      templateUrl: 'app/directives/user/user.html',
      restrict: 'E',
      scope: {
        search:'=',
        selectedUser: '=',
        index: '@'        
      },
      link: function (scope, element, attrs) {
        scope.item = angular.fromJson(attrs.userItem);

        scope.clickUserRow = function(){          
          scope.search.text = scope.item.username;
          scope.selectedUser._id = scope.item._id;
          scope.selectedUser.username = scope.item.username;
          scope.selectedUser.email = scope.item.email;          
        }
      }   
    };
  });