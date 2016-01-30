'use strict';

var express = require('express');
var controller = require('./project.controller');
var auth = require('../../auth/auth.service');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.put('/:id/reorder', controller.reorder);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.delete('/:id', controller.destroy);


// FUNCTIONS RELATED TO CONFIGURATION
router.post('/:id/config/addStoryType', controller.addStoryType);
router.delete('/:id/config/removeStoryType', controller.removeStoryType);

module.exports = router;