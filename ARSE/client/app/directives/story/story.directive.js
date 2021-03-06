'use strict';

angular.module('arseApp')
  .directive('story', function ($http, Project, $uibModal, Modal, $state) {
    return {
      templateUrl: 'app/directives/story/story.html',
      restrict: 'EA',
      scope: {
        storyItem:'@',
        showDetails:'@',
        editCallback:'&',
        viewCallback:'&',
        hasporights: '='   
      },
      link: function (scope, element, attrs) {
        attrs.$observe('storyItem', function(value){
          if(value){
              scope.item = angular.fromJson(attrs.storyItem);
          }
        });
        attrs.$observe('showDetails', function(value){
          if(value){
              scope.showDetails = angular.fromJson(attrs.showDetails);
          }
        });


        // Don't show the isRefreshing icon by default
        scope.isRefreshing = false;
        scope.errorMessage = "";
        scope.hasUpdateFailed = false;
        scope.datePickerOpen = false;
        scope.currentDate = new Date();


        scope.$on('orderChanged', function () {
          scope.item.orderId = scope.item.$index;
          $http.put('/api/projects/' + scope.item.project + '/stories/' + scope.item._id, scope.item).then(function (res) {
          });
        });

        scope.deleteItem = function (item) {
          Modal.open({}, 'components/confirmModal/confirmModal.html', 'ConfirmModalCtrl', { message: "Deleting a  story item" }).result.then(function (res) {
            console.log('Deleting Item');
            $http.delete('/api/projects/' + scope.item.project + '/stories/' + scope.item._id).then(function () {
              scope.$emit('updateView');
            });

          });

        };

        scope.openDatePicker = function($event) {
          scope.datePickerOpen = true;
        };


        scope.callOpenModal = function (item) {
          scope.editCallback({item: item});
        };

        scope.showItem = function(item) {
          scope.viewCallback({item: item});
        };

        scope.startSprint = function() {
          $http.post('/api/projects/' + scope.item.project + '/sprints', {end_date: scope.endDate}).then(function (res) {
            $state.go('sprintBoard', {project_id:scope.item.project});
          }, function(error) {
            scope.errorMessage = error.data;
          });
        };

        scope.$on('storyUpdating', function (event, story) {
          if (scope.item._id == story._id) {
            scope.isRefreshing = true;
          }
        });

        scope.$on('storyUpdated', function (event, story) {
          if (scope.item._id == story._id) {
            scope.isRefreshing = false;
            scope.item = story;
          }
        });

        scope.$on('storyUpdateFailed', function (event, id, err) {
          if (scope.item._id == id) {
            scope.isRefreshing = false;
            scope.hasUpdateFailed = true;
            scope.errorMessage = err.data;
          }
        });

      }
    };
  });
