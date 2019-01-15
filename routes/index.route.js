var express = require('express');
var controller = require('../controllers/index.controller');

var router = express.Router();

router.get('/', controller.getIndex);

router.post('/liveSearch', controller.liveSearch);

router.get('/liveGetCate', controller.liveGetCate);

router.get('/liveTestCart', controller.liveTestCart);

router.post('/liveGetPro', controller.liveGetPro);

router.post('/liveGetQuantity', controller.liveGetQuantity);

router.post('/liveUpdateQuantity', controller.liveUpdateQuantity);

module.exports = router;