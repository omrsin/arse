'use strict';

var _ = require('lodash');
var Sprint = require('./sprint.model');
var Project = require('../project/project.model');
var Story = require('../story/story.model');

// Get list of sprints
exports.index = function (req, res) {
  Sprint.find(function (err, sprints) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(sprints);
  });
};

// Get a single sprint
// in addition, add the stories to the sprint
// ?=stories=true or false : default= false
exports.show = function (req, res) {
  Project.findById(req.params.project_id, function (err, project) {
    if (err) { return handleError(res, err); }
    if (!project) { return res.status(404).send('Project Not Found'); }

    Sprint.findById(project.current_sprint, function (err2, sprint) {
      if (err2) { return handleError(res, err2); }
      if (!sprint) { return res.status(404).send('Not Found'); }
    
      // get stories if stories param set to true
      if (req.query.stories) {
        console.log(req.query.stories);

        if(project.offset == 0) {
          sprint.set('stories', []);
          return res.json(sprint);
        } else {
          Project.populate(project, {path: 'backlog', options: {limit: project.offset}}, function (err3, projectWithBacklog) {
            if (err3) { return handleError(res, err3); }
            if (!projectWithBacklog) { return res.status(404).send('could not get stories'); }
            console.log(projectWithBacklog.backlog);
            var sprint_backlog = projectWithBacklog.backlog;
            sprint.set('stories', sprint_backlog);
            console.log(sprint);
            return res.json(sprint);
          });
        }
      } else {
        return res.json(sprint);
      }
    });
  });
};

// Creates a new sprint in the DB.
// Modified: Get the project first, and then add a new sprint and correlate 
exports.create = function (req, res) {
  console.log(req.params.project_id);
  Project.findById(req.params.project_id, function (err, project) {
    if (err) { return handleError(res, err); }
    if (!project) { return res.status(404).send('Project Not Found'); }
    // First create the Sprint
    Sprint.create(req.body, function (err, sprint) {
      if (err) { return handleError(res, err); }
      project.current_sprint = sprint;
      project.sprint_counter++;
      project.save(function (err) {
        if (err) { return res.status(500).send("could not create sprints"); }
      });
      sprint.name = "Sprint " + project.sprint_counter;
      sprint.save(function (err) {
        if (err) { return res.status(500).send("name of the sprint could not be set appropriately"); }
      });
      return res.status(201).json(sprint);
    });

  });

};

// Updates an existing sprint in the DB.
exports.update = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Sprint.findById(req.params.id, function (err, sprint) {
    if (err) { return handleError(res, err); }
    if (!sprint) { return res.status(404).send('Not Found'); }
    var updated = _.merge(sprint, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(sprint);
    });
  });
};

// Deletes a sprint from the DB.
exports.destroy = function (req, res) {
  Sprint.findById(req.params.id, function (err, sprint) {
    if (err) { return handleError(res, err); }
    if (!sprint) { return res.status(404).send('Not Found'); }
    sprint.remove(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(204).send('No Content');
    });
  });
};

// close sprint and update current sprint in project
exports.close = function (req, res) {
  Project.findById(req.params.project_id).populate('backlog').exec(function (err, project) {
    if (err) { return handleError(res, err); }
    if (!project) { return res.status(404).send("Project not Found"); }

    project.current_sprint = null;
    
    // go through stories and remove story if status is "done".
    var sprint_backlog = project.backlog.slice(0, project.offset);
    sprint_backlog.forEach(function (item, index, temp) {
      if(item.status==="Done")
      {
        // XXX if we need to access past sprints with their stories - this will not work any more
        project.backlog.pull(item); 
      }
    });
    // Reset the offset to 0
    project.offset = 0;

    //after the project return the project with the new state.
    project.save(function (err) {
      if (err) { return res.status(404).send("could not close sprint"); }
      res.status(200).send(project);
    });
  });
}

function handleError(res, err) {
  return res.status(500).send(err);
}