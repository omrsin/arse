'use strict';

angular.module('arseApp')
  .controller('BacklogCtrl', ['$scope', 'Project', '$http', 'Modal', function ($scope, Project, $http, Modal) {
    $scope.data = {};
    $scope.stories = [];
    $scope.project_id = "563a329c1c4584de0ac59349";
    Project.get({ id: $scope.project_id }, function (project) {
      $scope.stories = project.backlog;
    });


    $scope.editStory = function(item) {
          console.log("edit1" + JSON.stringify(item));
          var modalScope = $scope.$new();
          //angular.extend(modalScope, scope);
          console.log("modal scope:");
          console.log(modalScope);
          Modal.open($scope, 'editStoryModalContent.html', 'EditModalInstanceCtrl', item).result.then(function (res) {

            console.log(res);
            Story.update(res, function(httpRes){
               console.log("res: " + JSON.stringify(httpRes));
              // Broadcast
              //$rootScope.$broadcast("storyUpdated", res);

              console.log($scope);
              $scope.$broadcast("storyUpdated", res);

            });

          });
        };

    $scope.addStory = function () {
      Modal.open({}, 'app/pbi/pbi.html', 'PbiCtrl', $scope.project_id);
    };

    $scope.$on('updateView', function () {
      Project.get({ id: $scope.project_id }, function (project) {
        $scope.stories = project.backlog;
      });
    });

    // TODO This is called twice atm
    $scope.$on('storyUpdated', function (event, story) {
      var story_index = -1;
      $scope.stories.forEach(function(element, index){
        if(element._id === story._id){
          story_index = index;
        }
      });
      // Update the story in the view
      $scope.stories[story_index] = story;
      // Set isRefreshing
      //$scope.$broadcast("storyUpdated", story);


      $scope.story = story;
      console.log("broadcast: " + JSON.stringify(story));
    });

}]);

// TODO remove unnecessary injections
angular.module('arseApp').controller('EditModalInstanceCtrl', 
  ['$scope', '$uibModalInstance', 'items', 'Story', '$rootScope', function($scope, $uibModalInstance, items, Story, $rootScope){


  $scope.editStory = {};
  //var editStory = {};
  angular.copy(items, $scope.editStory);
  //TODO Use items.story instead
  $scope.updateStory = function(){
    console.log("edit2: " + JSON.stringify($scope.editStory));
    $uibModalInstance.close($scope.editStory);
  };


  $scope.close = function(){
    $uibModalInstance.dismiss('cancel');
  };  

}]);
