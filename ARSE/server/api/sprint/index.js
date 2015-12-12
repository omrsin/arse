'use strict';

var express = require('express');
var controller = require('./sprint.controller');

var router = express.Router({ mergeParams: true });

router.get('/', controller.index);
router.get('/current', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);
//endpoint to close a sprint
router.put('/:id/close',controller.close);

module.exports = router;