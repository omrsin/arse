'use strict';

angular.module('arseApp')
	.controller('ChatCtrl', function ($log, $scope, socket) {

		$scope.message = "Some message";
		$scope.nickName = "Some txt";
		$scope.sendMessage = function () {
			socket.emit('message', $scope.nickName, $scope.message);
			$log.debug('message sent', $scope.message);
			$scope.message = '';
		};
		$scope.$on('socket:broadcast', function (event, data) {
		  	$log.debug('got a message', event.name);
			if (!data.payload) {
				$log.error('invalid message', 'event', event,
					'data', JSON.stringify(data));
				return;
			}
			$scope.$apply(function () {
				$scope.messageLog = messageFormatter(
					new Date(), data.source,
					data.payload) + $scope.messageLog;
			});
		});
	});