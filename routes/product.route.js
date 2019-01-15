var express = require('express');
var controller = require('../controllers/product.controller');

var router = express.Router();

router.get('/', controller.getProducts);

router.post('/page/:page',controller.getProductsPage);

router.get('/:productId', controller.getProductDetailt);

module.exports = router;