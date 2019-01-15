
var express = require('express');

var multer = require('multer');

var upload = multer({ dest : './public/upload/products'})

var controller = require('../controllers/product.controller');

var router = express.Router();

router.get('/create_product', controller.getCreateProduct);

router.post('/create_product',upload.array('avatar', 4) ,controller.postCreateProduct);

router.get('/list_products', controller.getListProducts);

router.get('/delete_product/:productId', controller.deleteProduct);

router.get('/edit_product/:productId', controller.getEditProduct);

router.post('/edit_product/:productId', controller.editProduct);

module.exports = router;