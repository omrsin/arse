'use strict';

angular.module('arseApp')
  .directive('chatWidget', function ($http, socket, $stateParams, Auth, $rootScope) {
    return {
      templateUrl: 'app/directives/chatWidget/chatWidget.html',
      restrict: 'E',
      link: function (scope, element, attrs) {
        scope.isShownChat = $rootScope.chatState;
        scope.message = "";
        scope.loadLimit = 10;
        scope.difference = -1;
        if ($rootScope.msgCounter === undefined) {
          $rootScope.msgCounter = [];
        }
        if (!$rootScope.msgCounter[scope.project._id]) {
          scope.counter = 0;
        } else {
          scope.counter = $rootScope.msgCounter[scope.project._id];
        }
        scope.fullChat = scope.project.chat;


        scope.enterMessage = function (evt) {

          if (evt.keyCode === 13) {
            scope.sendMessage(scope.message);
          }
        };

        scope.showChati = function () {
          scope.isShownChat = !scope.isShownChat;
          $rootScope.chatState = scope.isShownChat;
          scope.counter = 0;
          $rootScope.msgCounter[scope.project._id] = scope.counter;
        }

        scope.messageLog = scope.project.chat.slice(-scope.loadLimit);
        // Update array with any new or deleted items pushed from the socket
        socket.syncUpdates('project' + $stateParams.project_id, scope.project.chat, function (evt, msg, chat){

          //handles project events that do not change the chat
          if ((msg.length - chat.length) === -1 || scope.difference == msg.length - chat.length) return;
          scope.difference = msg.length - chat.length;

          scope.counter++;
          $rootScope.msgCounter[scope.project._id] = scope.counter;
          scope.$apply(function () {
            scope.fullChat = msg;
            scope.messageLog = msg.slice(-scope.loadLimit);
          });
        });

        scope.loadMore = function () {
          scope.loadLimit = scope.loadLimit + 10;
          scope.messageLog = scope.fullChat.slice(-scope.loadLimit);
        }

        scope.sendMessage = function (message) {
          if (message !== '') {
            Auth.getCurrentUser(function (user) {
              console.log(user);
              $http.put('/api/projects/' + $stateParams.project_id + '/post', { user: user.username, text: message }).success(function (res) {
                scope.message = '';
              });
            });
          }
        };

      }
    };
  });
