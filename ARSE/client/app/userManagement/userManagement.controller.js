'use strict';

angular.module('arseApp')
  .controller('UserManagementCtrl', ['$scope', 'Project', '$stateParams', '$http', '$state', 'User', function ($scope, Project, $stateParams, $http, $state, User) {    

    $scope.search = {};

    Project.get({ id: $stateParams.project_id }, function(project){
        $scope.project = project;
        User.getAll(function(users){
            $scope.users = users;
            $scope.availableUsers = [];            

            for(var i = 0; i < $scope.users.length; i++){                
                var isAlreadyAssigned = false;
                for(var j = 0; j < $scope.project.participants.length; j++){                    
                    if($scope.users[i]._id == $scope.project.participants[j]._id) {
                        isAlreadyAssigned = true;
                        break;
                    }
                }                
                if(!isAlreadyAssigned) {
                    $scope.availableUsers.push($scope.users[i]);
                }
            }
        });     
    });

    $scope.filterByUsernameAndEmail = function(user){        
        return user.username.indexOf($scope.search.text) > -1 || user.email.indexOf($scope.search.text) > -1;
    }; 
  }]);
