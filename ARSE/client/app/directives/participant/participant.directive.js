'use strict';

angular.module('arseApp')
  .directive('participant', function ($http, Modal, $stateParams) {
    return {
      templateUrl: 'app/directives/participant/participant.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.item = angular.fromJson(attrs.participantItem);        

        scope.deleteItem = function (item) {
          Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl', { message: "Are you sure you want to delete participant "+item.username+"?"}).result.then(function (res) {            
            $http.delete('/api/projects/'+$stateParams.project_id+'/participants/'+scope.item._id).then(function(){              
              scope.$emit('participantDeleted');
            });
          });
        };
      }   
    };
  });