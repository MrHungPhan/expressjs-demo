var express = require('express');

var router = express.Router();
 
var controller = require('../controllers/products.controller');

router.get('/', controller.getProducts);

module.exports = router;