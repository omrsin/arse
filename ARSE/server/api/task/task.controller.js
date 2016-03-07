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
    var task = req.body;
    
    story.tasks.push(task);
    story.save(function (error_on_save) {
      if(error_on_save) { 
        return res.status(500).send("Error while creating the task");
      }        
      return res.status(201).json(story.tasks[story.tasks.length - 1]);        
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

    var task = story.tasks.id(req.params.id);
    if(!task) {
      return res.status(404).send("The task does not exist.");
    }


    task.remove();    
    
    story.save(function (error_on_save) {
      if(error_on_save) { 
        return res.status(500).send("Error while removing the task");
      }      
      return res.status(200).send("Task successfully removed");      
    });
  });
};

// Updates an existing task in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Story.findById(req.params.story_id, function(err, story){
    if(err) { 
      return handleError(res, err); 
    }
    if(!story) {
      return res.status(404).send("Story not found");
    }

    var task = story.tasks.id(req.params.id);
    if(!task) {
      return res.status(404).send("The task does not exist.");
    }
    _.merge(task, req.body);

    story.save(function (error_on_save) {
      if(error_on_save) { 
        return res.status(500).send("Error while updating the task");
      }      
      return res.status(200).json(story.tasks.id(req.params.id));
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}