
var express = require('express');

var multer = require('multer');

var upload = multer({ dest : './public/upload/products'})

var controller = require('../controllers/product.controller');

var router = express.Router();

router.get('/create_product', controller.getCreateProduct);

router.post('/create_product',upload.single('avatar') ,controller.postCreateProduct);

router.get('/list_products', controller.getListProducts);

module.exports = router;