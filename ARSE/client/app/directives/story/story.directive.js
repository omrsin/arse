'use strict';

angular.module('arseApp')
  .directive('story', function ($http, Project, $uibModal) {
    return {
      templateUrl: 'app/directives/story/story.html',
      restrict: 'E',
      scope: {
        item: '='
      },
      link: function (scope, element, attrs) {

        scope.deleteItem = function (item) {
          console.log('Deleting Item');
          $http.delete('/api/stories/' + item._id).then(function () {
              scope.$emit('updateView');
          });
        };

        scope.openModal = function(item) {
          console.log("edit1" + JSON.stringify(item));
          
          var editModalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'editStoryModalContent.html',
            controller: 'EditModalInstanceCtrl',
            size: 'md',
            resolve: {
              story: function(){
                return item;
              }
            }
          });
        };

        scope.editItem = function(item){
          $scope.$emit('');
          /*$http.get('/api/stories/' + item._id).then(function(story){
            console.log('story to update: ' + JSON.stringify(story));
          });*/
        }
      }
    };
  });
