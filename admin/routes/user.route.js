var express = require('express');

var controller = require('../controllers/user.controller')

var router = express.Router();

router.get('/create_user', controller.getCreateUser);

router.post('admin/users.createUser', controller.getCreateUser);

module.exports = router;