'use strict';

angular.module('arseApp')
  .directive('project', function ($http, Modal) {
    return {
      templateUrl: 'app/directives/project/project.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.item = angular.fromJson(attrs.projectItem);

        scope.deleteItem = function (item) {

          Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl', { message: "Deleting a  project"}).result.then(function (res) {
            console.log('Deleting Item');
            $http.delete('/api/projects/' + item._id).then(function () {
              scope.$emit('updateView');
            });
          });
        };

        scope.callOpenModal = function (item) {
          scope.editProject(item);
        };
      }
    };
  });
