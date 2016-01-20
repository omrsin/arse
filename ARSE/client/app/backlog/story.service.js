/**
 * Created by massoud on 11/4/15.
 */


var module = angular.module('arseApp');

module.factory('Story', function($resource){
 	return $resource('/api/projects/:project_id/stories/:story_id', {
		project_id: '@project',
		story_id: '@_id'
	}, {
		'update': {method: 'PUT'}
	});	
});
