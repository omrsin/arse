'use strict';

angular.module('arseApp')
	.controller('ChatCtrl', function ($scope, $http, socket, $stateParams, Auth) {
		// Grab the initial set of available comments
		
		

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
	});
// 	.controller('ChatCtrl', function ($log, $scope, chatSocket) {
// 
// 		$scope.message = "Some message";
// 		$scope.nickName = "Some txt";
// 		$scope.sendMessage = function () {
// 			chatSocket.emit('message', $scope.nickName, $scope.message);
// 			$log.debug('message sent', $scope.message);
// 			$scope.message = '';
// 		};
// 		$scope.$on('socket:broadcast', function (event, data) {
// 		  	$log.debug('got a message', event.name);
// 			if (!data.payload) {
// 				$log.error('invalid message', 'event', event,
// 					'data', JSON.stringify(data));
// 				return;
// 			}
// 			$scope.$apply(function () {
// 				// $scope.messageLog = messageFormatter(
// 				// 	new Date(), data.source,
// 				// 	data.payload) + $scope.messageLog;
// 				$scope.messageLog = $scope.messageLog
// 			});
// 		});
// 	});
