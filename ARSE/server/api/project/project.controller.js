'use strict';

var _ = require('lodash');
var Project = require('./project.model');
var Story = require('../story/story.model');
var Participant = require('./participant.model');

// Get list of projects
// in addition, add the role of the logged in user to the projects
// ?role=true or false : default= false
exports.index = function (req, res) {
  Project.find({ 'participants.user': req.user._id }, function (err, projects) {
    if (err) { return handleError(res, err); }
    
    // Add the role if required
    if (req.query.role) {
      for(var j = 0; j < projects.length; j++) {
        var role;
        // Loop through the participants
        for (var i = 0; i < projects[j].participants.length; i++) {
          if (req.user.id == projects[j].participants[i].user) {
            role = projects[j].participants[i].role;
            break;
          }
        }
        projects[j].set('role', role);
      }
    }
    return res.status(200).json(projects);
  });
};

// Get a single project

// in addition, add the role of the logged in user to the project
// ?role=true or false : default= false
exports.show = function (req, res) {
  Project.findOne({ _id: req.params.id }).populate('backlog').populate('owner', '_id username email').exec(function (err, project) {
    if (err) { return handleError(res, err); }
    if (!project) { return res.status(404).send('Not Found'); }
    
    // Populate the participants
    Project.populate(project, {
      path: 'participants.user',
      select: '_id username email',
      model: 'User'
    }, function (err) {
      if (err) { return handleError(res, err); }

      // Add the role if required
      if (req.query.role) {
        var role;
        // Loop through the participants
        for (var i = 0; i < project.participants.length; i++) {
          if (req.user.id === project.participants[i].user.id) {
            role = project.participants[i].role;
            break;
          }
        }
        project.set('role', role);
      }
      if(req.query.pastsprints){
        console.log("req.past sprints: " + req.query.pastsprints);
        Project.populate(project, {
           path: 'past_sprints',
          select: 'name start_date end_date total_points',
           model: 'Sprint'
         }, function(err){
           if(err){ return handleError(res, err); }    
           console.log("after populating pro: " + JSON.stringify(project));
           
         });
      }

      Story.populate(project.backlog, { path: 'user' }, function (err, storiesWithUsers) {
        project.backlog = storiesWithUsers;
        console.log("project final: " + JSON.stringify(project)); 
        return res.json(project);
      });
    });

  });

};

// Creates a new project in the DB.
exports.create = function (req, res) {
  Project.create(req.body, function (err, project) {
    if (err) { return res.status(500).send("Please specify name and description"); }

    // Create a new Participant
    var participant = {
      user: req.user._id,
      role: "PO"
    };

    project.participants.push(participant);
    project.save(function (error_on_save) {
      if (error_on_save) {
        return res.status(500).send("Error while storing the participants");
      }
      return res.status(201).json(project);
    });
  });
};

// Reorders the story items on the backend
exports.reorder = function (req, res) {
  Project.findById({ _id: req.params.id }, function (err, project) {
    if (err) { return handleError(res, err); }
    if (!project) { return res.status(404).send('Not Found'); }
    var oldIndex = req.body.oldIndex;
    var newIndex = req.body.newIndex;
    
    // oldindex get the item using the old 
    var item = project.backlog.splice(oldIndex, 1);
    //enter the item to the new index
    project.backlog.splice(newIndex, 0, item);
    project.save(function (err) {
      if (err) {
        return handleError(res, err);
      }
    });
    return res.status(200).send('Reordered');
  });
}

// Updates the offset of an existing project in the DB.
exports.setOffset = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if (!project) { return res.status(404).send('Not Found'); }
    // Update the offset
    project.offset = req.body.offset;
    project.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(project);
    });
  });
};


// Updates an existing project in the DB.
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if (!project) { return res.status(404).send('Not Found'); }
    var updated = _.merge(project, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(project);
    });
  });
};

// Deletes a project from the DB.
exports.destroy = function (req, res) {
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if (!project) { return res.status(404).send('Not Found'); }
    project.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

function handleError(res, err) {
  return res.status(500).send(err);
}

// FUNCTIONS RELATED TO CONFIGURATION
exports.addStoryType = function(req, res) {
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if (!project) { return res.status(404).send('Not Found'); }

    var index = project.story_types.indexOf(req.body.type);
    if(index != -1) {
      return res.status(500).send("Story type already added.");
    }

    project.story_types.push(req.body.type);

    project.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(project);
    });
  });
};

exports.removeStoryType = function(req, res) {
  Project.findById(req.params.id, function (err, project) {
    if (err) { return handleError(res, err); }
    if (!project) { return res.status(404).send('Not Found'); }

    if(project.story_types.length == 1) {
      return res.status(500).send("It is not allowed to remove the last story type.");
    }

    var index = project.story_types.indexOf(req.body.type);
    if(index == -1) {
      return res.status(404).send("Story type not found");
    }
    project.story_types.splice(index, 1);

    // Populate the type of the stories
    Project.populate(project, {
      path: 'backlog',
      select: 'type',
      model: 'Story'
    }, function (err) {
      if (err) { return handleError(res, err); }
      
      for(var i = 0; i < project.backlog.length; i++) {
        if(project.backlog[i].type === req.body.type) {
          // Reset the type to the defualt (first in list)
          console.log("Resetting the value");

          Story.findOne({ '_id': project.backlog[i].id }).exec(function (err, story) {
            if (err) { return handleError(res, err); }
            if (!story) { return res.status(404).send('Not Found'); }


            story.set("type", project.story_types[0]);
            // Save the story
            story.save(function (err) {
              if (err) { return handleError(res, err); }
            });
          });

        }
      }

      // Save the project
      project.save(function (err) {
        if (err) { return handleError(res, err); }
        return res.status(200).json(project);
      });
    });

  });
};
