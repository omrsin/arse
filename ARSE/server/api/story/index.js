'use strict';

var express = require('express');
var controller = require('./story.controller');

//mergeParams to true to access the field of parents
var router = express.Router({mergeParams: true});

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;