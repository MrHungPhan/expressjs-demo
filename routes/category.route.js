var express = require('express');
var controller = require('../controllers/categoryProducts.controller');

var router = express.Router();

router.get('/:categoryName', controller.getCategory);

module.exports = router;