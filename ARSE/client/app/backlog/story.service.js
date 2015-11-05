/**
 * Created by masaud on 11/4/15.
 */


var module = angular.module('arseApp');

module.factory('Story', function($resource){
  return $resource('/api/stories/:id', {
    id: '@_id'
  });
});
