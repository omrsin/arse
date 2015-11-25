'use strict';

var module = angular.module('arseApp'
	//, ['modelFactory']
	);

module.factory('Project', function($resource){
  return $resource('/api/projects/:id', {
  	id: '@_id'
  }, {
    'update': {method: 'PUT'}
  });
});