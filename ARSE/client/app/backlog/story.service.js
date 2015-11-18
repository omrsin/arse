/**
 * Created by masaud on 11/4/15.
 */


var module = angular.module('arseApp');

module.factory('Story', function($resource){
  /*return $resource('/api/stories/:id', {
    id: '@_id'
  });*/
	return $resource('/api/projects/:project_id/stories/:story_id', {
		//project_id: '564c45cee63398eb102348b5',
		project_id: '@project',
		story_id: '@_id'
	}, {
		'update': {method: 'PUT'}
	});	
});
