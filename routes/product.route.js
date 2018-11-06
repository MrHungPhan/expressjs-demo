var express = require('express');
var controller = require('../controllers/productDetailt.controller');

var router = express.Router();

router.get('/:productId', controller.getProductDetailt);

module.exports = router;