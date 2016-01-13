'use strict';

var _ = require('lodash');
var Project = require('./project.model');
var Participant = require('./participant.model');

// Get list of projects
exports.index = function (req, res) {  
  Project.find({'participants.user': req.user._id}, function (err, projects) {
    if (err) { return handleError(res, err); }
    console.log(projects);
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
    }, function(err) {
      if (err) { return handleError(res, err); }

      // Add the role if required
      if (req.query.role) {
        var role;
        // Loop through the participants
        for(var i = 0; i < project.participants.length; i++) {         
          if(req.user.id === project.participants[i].user.id) {          
            role = project.participants[i].role;
            break;
          }
        }
        project.set('role', role);
      }
      return res.json(project);
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
      if(error_on_save) { 
        return res.status(500).send("Error while storing the participants");
      }
      console.log(project);        
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
    console.log('Removed item ' + item);
    //enter the item to the new index
    project.backlog.splice(newIndex, 0, item);
    console.log('Projects after adding' + project.backlog);
    project.save(function (err) {
      if (err) {
        return handleError(res, err);
      }

      
    });
    return res.status(200).send('Reordered');
  });
}


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