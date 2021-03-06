/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

var auth = require('./auth/auth.service');
var Project = require('./api/project/project.model');

module.exports = function(app) {  

  // This function restrict access to a certain URI to POs only
  var restrictToPO = function (req, res, next) {
    Project.findOne({ '_id': req.params.project_id, 'participants': {$elemMatch: { user: req.user._id, role: 'PO'} }}).exec(function (err, project) {
      if (err) { return res.status(500).send(err); }
      if (!project) { return res.status(403).send('Access Denied'); }
      next();
    });    
  };

  // Pipelines validations of authenticated users and attaches the user in the request
  app.use('/api/projects/', auth.isAuthenticated());
  
  // Validates if the user querying a project belongs to that project
  app.use('/api/projects/:project_id/', function (req, res, next) {
    // TODO attach project to request to avoid querying it twice
    Project.findOne({ '_id': req.params.project_id, 'participants.user': req.user._id}).exec(function (err, project) {
      if (err) { return res.status(500).send(err); }
      if (!project) { return res.status(403).send('Access Denied'); }      
      next();
    });    
  });

  // The participants controller is restricted to POs only
  app.use('/api/projects/:project_id/participants', restrictToPO);

  // Only POs may edit or delete projects
  app.put('/api/projects/:project_id', restrictToPO);
  app.delete('/api/projects/:project_id', restrictToPO);

  // Only POs may config projects
  app.use('/api/projects/:project_id/config', restrictToPO);

  // Only POs may start or close/cancel a sprint
  app.use('/api/projects/:project_id/sprints/current/close', restrictToPO);
  app.use('/api/projects/:project_id/sprints/current/cancel', restrictToPO);
  app.post('/api/projects/:project_id/sprints', restrictToPO);

  // Insert routes below

  // participants in a project
  app.use('/api/projects/:project_id/participants', require('./api/participant'));

  // sprints
  app.use('/api/projects/:project_id/sprints', require('./api/sprint'));

  // story routes
  app.use('/api/projects/:project_id/stories', require('./api/story'));

  // tasks routes
  app.use('/api/projects/:project_id/stories/:story_id/tasks', require('./api/task'));
  
  app.use('/api/users', require('./api/user'));
  // auth
  app.use('/auth', require('./auth'));	


  app.use('/api/projects', require('./api/project'));
  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });

};
