'use strict';

angular.module('arseApp')
  .directive('chatWidget', function () {
    return {
      templateUrl: 'app/directives/chatWidget/chatWidget.html',
      restrict: 'EA',
      link: function (scope, element, attrs) {
        scope.isShown = false;



        $http.get('/api/projects/' + $stateParams.project_id).success(function (project) {
          $scope.project = project;
          $scope.messageLog = project.chat.slice(-10);
 
          // Update array with any new or deleted items pushed from the socket
          socket.syncUpdates('project' + $stateParams.project_id, $scope.project.chat, function (evt, msg, chat) {
            console.log(chat.length - msg.length);
            $scope.$apply(function () {
              $scope.messageLog = msg.slice(-10);
            });
          });
        });

        $scope.sendMessage = function (message) {
          Auth.getCurrentUser(function (user) {
            console.log(user);
            $http.put('/api/projects/' + $stateParams.project_id + '/post', { user: user.username, text: message }).success(function (res) {
              console.log(res);
              $scope.message = '';
            });

          });

        };
      }
    };
  });
