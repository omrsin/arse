'use strict';

var _ = require('lodash');
var Story = require('./story.model');
var Project = require('../project/project.model');
var User = require('../user/user.model');

// Get list of storys
exports.index = function (req, res) {
  Story.find(function (err, storys) {
    if (err) { return handleError(res, err); }
    return res.status(200).json(storys);
  });
};

// Get a single story
exports.show = function (req, res) {
  Story.findOne({ '_id': req.params.id }).populate('user').exec(function (err, story) {
    if (err) { return handleError(res, err); }
    if (!story) { return res.status(404).send('Not Found'); }

    return res.json(story);
  });
};

// Creates a new story in the DB.
exports.create = function (req, res) {
  Story.create(req.body, function (err, story) {
    if (err) { return handleError(res, err); }
    
   

    // Find the project
    Project.findById(req.params.project_id,
      function (project_find_error, project) {
        if (project_find_error) {
          return handleError(res, project_find_error);
        }
        if (!project) {
          return res.status(404).send("Project not found");
        }
        if(project.story_types.indexOf(req.body.type) == -1) {
          // Not supported story type
          return res.status(500).send('This story type is not allowed');
        }
        // To check if the user is Unassigned
        if (!story.user) {
          var newUser = new User();
          story.user = newUser._id;
        }
        story.save();
        project.backlog.push(story);
        project.save(function (error_on_save) {
          if (error_on_save) {
            return handleError(res, error_on_save);
          }
          Story.populate(story, { path: 'user' }, function (err2, storyWithUser) {
            if (err2) { return handleError(res, err2); }
            if (!storyWithUser) { return res.status(404).send('Not Found'); }
            return res.status(201).json(story);
          });

        });
      }
      );
  });
};

// Updates an existing story in the DB.
exports.update = function(req, res) {
  // Remove things that should not be merged
  if(req.body._id) { delete req.body._id; }
  if(req.body.tasks) {delete req.body.tasks; }
  
  Story.findById(req.params.id, function (err, story) {
    if (err) { return handleError(res, err); }
    if (!story) { return res.status(404).send('Not Found'); }
    // To check if unassigned then user is null
    if (!req.body.user || req.body.user.username === 'Unassigned') {
      req.body.user = null;
    }

    // Check if the story type is supported
    Project.findById(req.params.project_id, function (project_find_error, project) {
      if (project_find_error) { return handleError(res, project_find_error); }
      if(project.story_types.indexOf(req.body.type) == -1) {
        // Not supported
        return res.status(500).send('This story type is not allowed');
      }

      var updated = _.merge(story, req.body);
      updated.save(function (err) {
        if (err) { return handleError(res, err); }
        // populate story with user
        // To not populate if assignee is null
        if (updated.user !== null) {
          Story.populate(updated, { path: 'user', select: '_id username email', model: 'User' }, function (err2, storyWithUser) {
            if (err2) { return handleError(res, err2); }
            return res.status(200).json(storyWithUser);
          });
        } else {
          return res.status(200).json(updated);
        }

      });
    });
  });
};

// assign user story to a developer
exports.assign = function (req, res) {
  if (req.body._id) { delete req.body._id; }
  Story.findById(req.params.id, function (err, story) {
    if (err) { return handleError(res, err); }
    if (!story) { return res.status(404).send('Not Found'); }

    req.body.user = req.params.user_id;
    // To check if the user is Unassigned
    if (req.body.user != 0) {
      story.user = req.body.user;
    } else {
      story.user = new User();
    }

    story.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.status(200).json(story);
    });
  });
}


// Deletes a story from the DB.
// needs to propagate the deletion to the project.
exports.destroy = function (req, res) {
  Project.findById(req.params.project_id, function (project_find_error, project) {
    if (project_find_error) { return handleError(res, project_find_error); }
    Story.findById(req.params.id, function (story_find_error, story) {
      if (story_find_error) { return handleError(res, story_find_error); }
      if (!story) { return res.status(404).send('Not Found'); }
      project.backlog.pull(story);
      story.remove(function (err) {
        if (err) { return handleError(res, err); }
        project.save(function (error_on_project_save) {
          if (error_on_project_save) { return handleError(res, error_on_project_save); }
          return res.status(204).send('No Content');
        });
      });
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.status(500).send(err);
}
