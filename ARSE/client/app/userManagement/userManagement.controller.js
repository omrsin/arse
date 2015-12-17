'use strict';

angular.module('arseApp')
  .controller('UserManagementCtrl', ['$scope', 'Project', '$stateParams', '$http', '$state', 'User', 'project', function ($scope, Project, $stateParams, $http, $state, User, project) {    

    $scope.search = {};
    $scope.selectedUser = {};
    $scope.disabled = true;
    $scope.availableRoles = ["PO", "Developer"];
    $scope.hasPORights = false;
    $scope.project = project;

    // Set if we have the PO right
    $scope.hasPORights = $scope.project.role === $scope.availableRoles[0];

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
            $http.post('/api/projects/' + $scope.project._id + '/participants', {
                user_id: $scope.selectedUser._id,
                role: $scope.role
            }).then(function(res){                
                $scope.project = res.data;
                defineAvailableUsers();
                cleanScope();
                $scope.success = "The user " +$scope.selectedUser.username+ " has been successfully added to the project";            
            },
            function(error){
                cleanScope();
                $scope.failed = error.data;
                refreshProject();
            });
        } else {
            if($scope.search.text) {
                $scope.failed = "The user "+$scope.search.text+" is not valid. Select a valid user";
            } else {
                $scope.failed = "Type the username or email of the user you want to add first";
            }
        }
    };

    $scope.removeParticpant = function(participant) {
        console.log("deleting");
        $http.delete('/api/projects/'+$stateParams.project_id+'/participants/'+participant.user._id).then(function(res){
            $scope.project = res.data;
            console.log($scope.project);
            defineAvailableUsers();            
            $scope.failed = "";
            $scope.success = "The participant was deleted";
        },
        function(error) {
            cleanScope();
            $scope.failed = error.data;
            refreshProject();
        });
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
                if($scope.users[i]._id == $scope.project.participants[j].user._id) {
                    isAlreadyAssigned = true;
                    break;
                }
            }                
            if(!isAlreadyAssigned) {
                $scope.availableUsers.push($scope.users[i]);
            }
        }
    }

    function refreshProject() {
        Project.get({ id: $stateParams.project_id }, function(project) {
            $scope.project = project;
            defineAvailableUsers();
        });
    }

    function cleanScope(){
        $scope.selectedUser = {};
        $scope.search.text = "";
        $scope.failed = "";
        $scope.success = "";
    }
  }]);
