var express = require('express');
var controller = require('../controllers/index.controller');

var router = express.Router();

router.get('/home', controller.getIndex);

router.get('/', controller.getIndex);

module.exports = router;