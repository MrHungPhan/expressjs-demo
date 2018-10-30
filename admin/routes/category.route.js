var express = require('express');

var multer = require('multer');

var upload = multer({dest : './public/upload/'});

var controller = require('../controllers/category.controller');

var router = express.Router();

router.get('/create_category', controller.getCreateCategory);

router.post('/create_category',upload.single('avatar'), controller.postCreateCategory);

router.get('/list_categories', controller.getListCategories);

module.exports = router;