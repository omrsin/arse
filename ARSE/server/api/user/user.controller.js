'use strict';

import User from './user.model';
import passport from 'passport';
import config from '../../config/environment';
import jwt from 'jsonwebtoken';

var Story = require('../story/story.model');

function validationError(res, statusCode) {
  statusCode = statusCode || 422;
  return function(err) {
    res.status(statusCode).json(err);
  }
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function respondWith(res, statusCode) {
  statusCode = statusCode || 200;
  return function() {
    res.status(statusCode).end();
  };
}

/**
 * Get list of users
 * restriction: 'admin'
 TODO This restriction should be changed somehow!?
 */
exports.index = function(req, res) {
  User.findAsync({}, {"_id": true, "username": true, "email": true, "role": true}, '-salt -hashedPassword')
    .then(function(users) {
      res.status(200).json(users);
    })
    .catch(handleError(res));
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.saveAsync()
    .spread(function(user) {
      var token = jwt.sign({ _id: user._id }, config.secrets.session, {
        expiresInMinutes: 60 * 5
      });
      res.json({ token: token });
    })
    .catch(validationError(res));
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;

  User.findByIdAsync(userId)
    .then(function(user) {
      if (!user) {
        return res.status(404).end();
      }
      res.json(user.profile);
    })
    .catch(function(err) {
      return next(err);
    });
};

// unassign user from all stories
exports.unassign = function(req, res){  
  // get stories, loop thru, set to null if username is equal
  User.findById({_id: req.params.id}, function(err, user){
    if (err) { return handleError(res, err); }
    if (!user) { return res.status(404).send('Not Found'); }
    Story.find({user: user._id}, function(err2, stories){
      if(err2){return handleError(res);}
      if(!stories){return res.status(404).send('Not Found');}
      stories.forEach(function(story, index, temp){
        story.user = null;
        story.save(function(err){
          if(err){return handleError(res);}
        });
      });
      
    });
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemoveAsync(req.params.id)
    .then(function() {
      res.status(204).end();
    })
    .catch(handleError(res));
};

/**
 * Edit user
 */
exports.editUser = function(req, res, next) {
  var userId = req.user._id;
  var username = req.body.username;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  console.log(req.body);

  User.findByIdAsync(userId)
    .then(function(user) {
      if (user.authenticate(oldPass)) {
        user.username = username;        
        if (req.body.newPassword) {          
          user.password = newPass;        
        }
      } else {
        return res.status(403).end();          
      }    

      return user.saveAsync()
        .then(function() {
          res.status(204).end();
        })
        .catch(validationError(res));
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;

  User.findOneAsync({ _id: userId }, '-salt -hashedPassword')
    .then(function(user) { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(function(err) {
      return next(err);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
