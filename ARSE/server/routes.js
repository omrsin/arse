/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

module.exports = function(app) {

  // Insert routes below

  // participants in a project
  app.use('/api/projects/:project_id/participants', require('./api/participant'));

  // sprints
  app.use('/api/projects/:project_id/sprints', require('./api/sprint'));

  // story routes
  app.use('/api/projects/:project_id/stories', require('./api/story'));
  
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
