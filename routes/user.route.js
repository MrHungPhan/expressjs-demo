var express = require('express');


var router = express.Router();
var controller = require('../controllers/user.controller');


router.get('/login', controller.getLogin);

router.get('/signup_user', controller.getSignup);

router.post('/signup_user',controller.postSignup);

router.post('/postLogin?:redirectTo', controller.postLogin);

router.get('/logout?:redirectTo', controller.logout);

module.exports = router;