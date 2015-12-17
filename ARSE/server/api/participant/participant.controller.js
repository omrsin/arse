'use strict';

var _ = require('lodash');
var User = require('../user/user.model');
var Project = require('../project/project.model'); 

// Get list of participants
// exports.index = function(req, res) {
//   Participant.find(function (err, participants) {
//     if(err) { return handleError(res, err); }
//     return res.status(200).json(participants);
//   });
// };

// Get a single participant
// exports.show = function(req, res) {
//   Participant.findById(req.params.id, function (err, participant) {
//     if(err) { return handleError(res, err); }
//     if(!participant) { return res.status(404).send('Not Found'); }
//     return res.json(participant);
//   });
// };

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

// Updates an existing participant in the DB.
// exports.update = function(req, res) {
//   if(req.body._id) { delete req.body._id; }
//   Participant.findById(req.params.id, function (err, participant) {
//     if (err) { return handleError(res, err); }
//     if(!participant) { return res.status(404).send('Not Found'); }
//     var updated = _.merge(participant, req.body);
//     updated.save(function (err) {
//       if (err) { return handleError(res, err); }
//       return res.status(200).json(participant);
//     });
//   });
// };

// Deletes a participant from the DB.
exports.destroy = function(req, res) {
  console.log("I reached this");
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