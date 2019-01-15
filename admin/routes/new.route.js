var express = require('express');

var multer = require('multer');

var upload = multer({ dest : './public/upload/news'});

var controller = require('../controllers/new.controller');

var router = express.Router();

router.get('/create_new', controller.getCreateNew);

router.post('/create_new',upload.array('avatar_around') ,controller.postCreateNew);

router.get('/list_news', controller.getListNews);

// router.get('/delete_new/:newId', controller.deleteNew);

// router.get('/edit_new/:newId', controller.getEditNew);

// router.post('/edit_new/:newId', controller.editNew);

module.exports = router;