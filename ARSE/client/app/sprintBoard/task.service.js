var module = angular.module('arseApp');

module.factory('Task', function($resource){
  return $resource('/api/projects/:project_id/stories/:story_id/tasks/:task_id', {
    project_id: '@project',
    story_id: '@story',
    task_id: '@_id'
  }, {
    'update': {method: 'PUT'}
  }); 
});