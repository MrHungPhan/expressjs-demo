var express = require('express');
var controller = require('../controllers/cart.controller');

var router = express.Router();

router.get('/', controller.getCart);

router.post('/add/:productId', controller.postAddToCart);

router.get('/checkout?:order', controller.getCartCheckout);

router.post('/checkout?:order', controller.postCartCheckout);

router.get('/success?:order', controller.getSucessOrder);

router.post('/deleteOrderDetailt', controller.liveDeleteOrderDateilt);

module.exports = router;