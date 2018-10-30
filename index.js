require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');

mongoose.connect(process.env.MONGOO_URL);

var app = express();
var port = 3030;


//boss router
var productRoute = require('./routes/products.route');
//admin router
var adminRoute = require('./admin/routes/admin.route');
var productRoute = require('./admin/routes/product.route');
var categoryRoute = require('./admin/routes/category.route');


//set pug
app.set('view engine', 'pug');
app.set('views','./views');

//set body-parser
app.use(bodyParser.json()); //
app.use(bodyParser.urlencoded({ extended: true })); // 

//static file  add css, font, js
app.use('/admin/categories', express.static('public'));
app.use('/admin/products', express.static('public'));
app.use(express.static('public'));



app.get('/', function(req, res){
	res.render('index');
});

app.use('/products', productRoute);
app.use('/admin', adminRoute);
app.use('/admin/products', productRoute);
app.use('/admin/categories', categoryRoute);

app.listen(port, function(){
	console.log("Server listening on port "+ port);
})