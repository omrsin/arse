'use strict';

var _ = require('lodash');
var Story = require('../story/story.model');

// Creates a new task in the DB embedded in its corresponfing story.
exports.create = function(req, res) {
  Story.findById(req.params.story_id, function(err, story){
    if(err) { 
      return handleError(res, err); 
    }
    if(!story) {
      return res.status(404).send("Story not found");
    }

    var task = new Task(req.body);
    
    story.tasks.push(task);
    story.save(function (error_on_save) {
      if(error_on_save) { 
        return res.status(500).send("Error while creating the task");
      }        
      console.log(task);
      return res.status(201).send("Task created successfully");        
    });    
  });  
};

// Deletes a task from the DB.
exports.destroy = function(req, res) {
  Story.findById(req.params.story_id, function(err, story){
    if(err) { 
      return handleError(res, err); 
    }
    if(!story) {
      return res.status(404).send("Story not found");
    }

    console.log(story.tasks.length);
    story.tasks.id(req.params.id).remove();
    console.log(story.tasks.length);   
    
    story.save(function (error_on_save) {
      if(error_on_save) { 
        return res.status(500).send("Error while removing the task");
      }      
      return res.status(200).send("Task successfully removed");      
    });
  });

  // Project.findById(req.params.project_id, function(err, project){
  //   if(err) { 
  //     return handleError(res, err); 
  //   }
  //   if(!project) {
  //     return res.status(404).send("Project not found");
  //   }

  //   if(!isAlreadyAssignedToProject(project.participants, req.params.id)) {
  //     return res.status(500).send("User is not assgined to the project");
  //   }

  //   // Actually remove the participant
  //   removeFromProject(project.participants, req.params.id);
  //   project.save(function (error_on_save) {
  //       if(error_on_save) { 
  //         return res.status(500).send("Error while removing the participants");
  //       }

  //       // Populate the participants
  //       Project.populate(project, {
  //           path: 'participants.user',
  //           select: '_id username email',
  //           model: 'User'
  //       }, function(err) {
  //         if (err) { return handleError(res, err); }
  //         return res.status(200).json(project);
  //       });
  //     }); 
  // });
};

function handleError(res, err) {
  return res.status(500).send(err);
}