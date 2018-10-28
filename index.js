require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

mongoose.connect(process.env.MONGOO_URL);

var app = express();
var port = 3030;


//router
var productRoute = require('./routes/products.route');

//set pug
app.set('view engine', 'pug');
app.set('views','./views');

//set body-parser
app.use(bodyParser.json()); //
app.use(bodyParser.urlencoded({ extended: true })); // 

//static file  add css, font, js
app.use(express.static('public'));

app.get('/', function(req, res){
	res.render('index');
});

app.use('/products', productRoute);

app.listen(port, function(){
	console.log("Server listening on port "+ port);
})