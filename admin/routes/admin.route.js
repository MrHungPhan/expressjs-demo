
var express = require('express');

var controller = require('../controllers/admin.controller');

var router = express.Router();

router.get('/', controller.getAdmin);

router.get('/login', controller.getLogin);

router.post('/login', controller.postAdmin);

router.get('/logout',controller.adminLogout);

module.exports = router;