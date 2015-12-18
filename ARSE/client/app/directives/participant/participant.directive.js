'use strict';

angular.module('arseApp')
  .directive('participant', function ($http, Modal, $stateParams, Auth, $cookies) {
    return {
      templateUrl: 'app/directives/participant/participant.html',
      restrict: 'E',
      scope: {
        remove:'&',
        item: '=',
        index: '@'        
      },
      link: function (scope, element, attrs) {
        scope.currentUser = {};
        if($cookies.get('token')){
          $http.get('api/users/me').then(function(res){
            scope.currentUser = res.data;
          }); 
        }

        scope.deleteItem = function (item) {
          Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl', 
            { message: "Are you sure you want to delete participant "+item.user.username+"?"}).result.then(function (res) {  
              scope.remove({participant: item});
          });
        };
      }   
    };
  });