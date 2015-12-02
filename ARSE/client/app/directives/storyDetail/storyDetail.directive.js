'use strict';

angular.module('arseApp')
  .directive('storyDetail', function () {
    return {
      templateUrl: 'app/directives/storyDetail/storyDetail.html',
      restrict: 'E',
      scope: {
        storyItem:'@',
        callback:'&'
      },
      link: function (scope, element, attrs) {
        console.log(scope.detailStory);
        // storyItem is fucking JSON STRING - needs to be converted back to object -.-
        attrs.$observe('storyItem', function(value){
          if(value){
              scope.item = angular.fromJson(attrs.storyItem);
          }
        });

        scope.hideItem = function() {
          scope.callback({item: scope.item});
        };
      }
    };
  });