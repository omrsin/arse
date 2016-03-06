'use strict';

var _ = require('lodash');
var User = require('../user/user.model');
var Project = require('../project/project.model'); 

// Creates a new participant in the DB.
exports.create = function(req, res) {  
  Project.findById(req.params.project_id, function(err, project){
    if(err) { 
      return handleError(res, err); 
    }
    if(!project) {
      return res.status(404).send("Project not found");
    }

    User.findById(req.body.user_id, function(err_user, user) {
      if(err_user) {
        return handleError(res, err_user); 
      }
      if(!user) {
        return res.status(404).send("User not found");
      }

      if(isAlreadyAssignedToProject(project.participants, req.body.user_id)){
        return res.status(500).send("The user " + user.username + " has been already assigned to this project.");
      }

      var participant = {
        user: user._id,
        role: req.body.role
      };

      project.participants.push(participant);
      project.save(function (error_on_save) {
        if(error_on_save) { 
          return res.status(500).send("Error while storing the participants");
        }        
        // Populate the participants
        Project.populate(project, {
            path: 'participants.user',
            select: '_id username email',
            model: 'User'
        }, function(err) {
          if (err) { return handleError(res, err); }
          return res.status(201).json(project);
        });
      });   
    });
  });
};

//Updates an existing participant in the DB.
exports.update = function(req, res) {
  Project.findById(req.params.project_id, function(err, project){
    if(err) { 
      return handleError(res, err); 
    }
    if(!project) {
      return res.status(404).send("Project not found");
    }

    if(!isAlreadyAssignedToProject(project.participants, req.params.id)) {
      return res.status(500).send("User is not assgined to the project");
    }

    if(req.user._id == req.params.id) {
      return res.status(500).send("You cannot change your own role.");
    }

    // Actually change the role
    var index = changeRole(project.participants, req.params.id, req.body.role);
    // Tell mongoose that the array actually changed.
    project.markModified('participants.' + index);

    
    project.save(function (error_on_save) {
        if(error_on_save) { 
          return res.status(500).send("Error while changing the role.");
        }
        return res.status(200).json("Success");
    }); 
  });
};

// Deletes a participant from the DB.
exports.destroy = function(req, res) {
  if(req.user._id == req.params.id){ 
    return res.status(500).send("Cannot remove logged in user from a project");
  }

  Project.findById(req.params.project_id, function(err, project){
    if(err) { 
      return handleError(res, err); 
    }
    if(!project) {
      return res.status(404).send("Project not found");
    }

    if(!isAlreadyAssignedToProject(project.participants, req.params.id)) {
      return res.status(500).send("User is not assgined to the project");
    }

    // Actually remove the participant
    removeFromProject(project.participants, req.params.id);
    project.save(function (error_on_save) {
        if(error_on_save) { 
          return res.status(500).send("Error while removing the participants");
        }

        // Populate the participants
        Project.populate(project, {
            path: 'participants.user',
            select: '_id username email',
            model: 'User'
        }, function(err) {
          if (err) { return handleError(res, err); }
          return res.status(200).json(project);
        });
      }); 
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

// XXX check if there is a more elegant solution
// Checks if a user is already assigned to a project
function isAlreadyAssignedToProject(participants, userid){
  var assigned = false;  
  for(var i = 0; i < participants.length; i++){    
    if(userid == participants[i].user) {
      assigned = true;      
    }
  }  
  return assigned;
}

//Removes a participant from a project
function removeFromProject(participants, userid){  
  for(var i = 0; i < participants.length; i++){    
    if(userid == participants[i].user) {
      participants.splice(i,1);
      break;      
    }
  }
}

// Changes a role from a particpant from a project
// Returns the index of the changed participant
function changeRole(participants, userid, role){  
  for(var i = 0; i < participants.length; i++){    
    if(userid == participants[i].user) {
      participants[i].role = role;
      return i;      
    }
  }
}