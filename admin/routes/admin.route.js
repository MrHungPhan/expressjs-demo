
var express = require('express');

var controller = require('../controllers/admin.controller');

var router = express.Router();

router.get('/', controller.getAdmin);

module.exports = router;