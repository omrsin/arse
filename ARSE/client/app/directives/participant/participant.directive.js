'use strict';

angular.module('arseApp')
  .directive('participant', function ($http, Modal, $stateParams) {
    return {
      templateUrl: 'app/directives/participant/participant.html',
      restrict: 'E',
      scope: {
        remove:'&',
        item: '=',
        index: '@'        
      },
      link: function (scope, element, attrs) {
        //scope.item = angular.fromJson(attrs.participantItem);        

        scope.deleteItem = function (item) {
          Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl', 
            { message: "Are you sure you want to delete participant "+item.user.username+"?"}).result.then(function (res) {  
              scope.remove({participant: item});

            /*$http.delete('/api/projects/'+$stateParams.project_id+'/participants/'+scope.item.user._id).then(function(project){              
              //scope.$emit('participantDeleted');
              scope.project = project;
            });*/
          });
        };
      }   
    };
  });