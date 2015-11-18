/**
 * Created by masaud on 11/4/15.
 */


var module = angular.module('arseApp');

module.factory('Story', function($resource){
  /*return $resource('/api/stories/:id', {
    id: '@_id'
  });*/
	return $resource('/api/projects/:project_id/stories/:story_id', {
    //TODO: Find out how to pass parameters to the service not HARD CODED
		project_id: '563a329c1c4584de0ac59349',
		story_id: '@_id'
	}, {
		'update': {method: 'PUT'}
	});	
});
