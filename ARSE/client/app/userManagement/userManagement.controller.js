'use strict';

angular.module('arseApp')
  .controller('UserManagementCtrl', ['$scope', 'Project', '$stateParams', '$http', '$state', 'User', 'project', function ($scope, Project, $stateParams, $http, $state, User, project) {    

    $scope.search = {};
    $scope.selectedUser = {};
    $scope.disabled = true;
    $scope.project = project;


    User.getAll(function(users){
        $scope.users = users;
        $scope.availableUsers = [];

        defineAvailableUsers();            
    });     

    $scope.filterByUsernameAndEmail = function(user){        
        return user.username.indexOf($scope.search.text) > -1 || user.email.indexOf($scope.search.text) > -1;
    };

    $scope.addUserToProject = function(){
        // Validate that the field was not edited after selecting
        if($scope.selectedUser._id){
            console.log($scope.selectedUser);
            $http.post('/api/projects/' + $scope.project._id + '/participants', {
                user_id: $scope.selectedUser._id
            }).then(function(response){                
                Project.get({ id: $stateParams.project_id }, function(project){
                    $scope.project = project;
                    defineAvailableUsers();
                    $scope.success = "The user " +$scope.selectedUser.username+ " has been successfully added to the project";
                    cleanScope();

                });                
            },
            function(error){
                $scope.failed = "The user "+$scope.selectedUser.username+" has been already assigned to this project";
                cleanScope();
            });
        } else {
            if($scope.search.text) {
                $scope.failed = "The user "+$scope.search.text+" is not valid. Select a valid user";
            } else {
                $scope.failed = "Type the username or email of the user you want to add first";
            }
        }
    };

    $scope.validateSelectedUser = function(){
        if($scope.selectedUser._id){
            $scope.selectedUser = {};
        }
    };

    function defineAvailableUsers(){
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
    }

    function cleanScope(){
        $scope.selectedUser = {};
        $scope.search.text = "";
        $scope.failed = "";
    }
  }]);
