'use strict';

angular.module('arseApp')
  .directive('project', function ($http, Modal) {
    return {
      templateUrl: 'app/directives/project/project.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.item = angular.fromJson(attrs.projectItem);
        // Set if we have the PO right
        scope.hasPORights =  scope.item.role === "PO";

        scope.deleteItem = function (item) {
          scope.deleteProject(item);
        };

        scope.callOpenModal = function (item) {
          scope.editProject(item);
        };
      }
    };
  });
