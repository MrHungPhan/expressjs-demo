require('dotenv').config();

var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var flash = require('connect-flash');
var expressMessages = require('express-messages');
var expressValidator = require('express-validator');
 var mailer = require('express-mailer');
 var passport = require('passport');

mongoose.connect(process.env.MONGOO_URL);

var app = express();
var server = require('http').createServer()
const io = require('socket.io')(server);

var port = 3030;




//index router
var indexRoute = require('./routes/index.route');
var productDetailtRoute = require('./routes/product.route');
var categoryProductRoute = require('./routes/category.route');
var cartRoute = require('./routes/cart.route');
var userLogRoute = require('./routes/user.route');

//admin router
var adminRoute = require('./admin/routes/admin.route');
var productRoute = require('./admin/routes/product.route');
var categoryRoute = require('./admin/routes/category.route');
var userRoute = require('./admin/routes/user.route');
var newRoute = require('./admin/routes/new.route');

//midelwrare
var authMidleware = require('./midlewares/auth.midleware');
var sessionMidleware = require('./midlewares/session.midleware');
var countCartMidleware = require('./midlewares/countCart.midleware');
var userMidleware = require('./midlewares/user.midleware');
var adAuthMidleware = require('./midlewares/adAuth.midleware');

//set pug
app.set('view engine', 'pug');
app.set('views','./views');


//express session midleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
}));

// express messages midleware

app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = expressMessages(req, res);
  next();
});

// express validation midleware

app.use(expressValidator({
	errorFormatter: function(param, msg, value){
		var namespace = param.split('.')
		, root = namespace.shift()
		, formParam = root;

		while (namespace.length) {
			// statement
			formParam +='[' + namespace.shift() +']';
		}
		return{
			param : formParam,
			msg : msg,
			value: value
		};
	}
}))


// passport config
require('./config/passport')(passport);
// passport midleware
app.use(passport.initialize());
app.use(passport.session());

//set body-parser
app.use(bodyParser.json()); //
app.use(bodyParser.urlencoded({ extended: true })); // 
app.use(cookieParser(process.env.COOKIE_SECRET));

//static file  add css, font, js
app.use('/admin/categories', express.static('public'));
app.use('/admin/users', express.static('public'));
app.use('/admin/products', express.static('public'));
app.use('/admin/news', express.static('public'));
app.use('/products', express.static('public'));
app.use('/categories', express.static('public'));
app.use('/user', express.static('public'));
app.use('/cart', express.static('public'));
app.use('/home', express.static('public'));
app.use(express.static('public'));


//index
app.use('/home',sessionMidleware.sessionMidle,
				userMidleware.userMidle, 
				countCartMidleware.countCartMidle, 
				indexRoute);
app.use('/products',sessionMidleware.sessionMidle, 
					userMidleware.userMidle,
					countCartMidleware.countCartMidle, 
					productDetailtRoute);
app.use('/categories',sessionMidleware.sessionMidle, 
					userMidleware.userMidle,
					countCartMidleware.countCartMidle,
					categoryProductRoute);
app.use('/cart',sessionMidleware.sessionMidle, 
				userMidleware.userMidle,
				countCartMidleware.countCartMidle,
				cartRoute);

//login , logout
app.use('/user',
		countCartMidleware.countCartMidle,
		 userLogRoute);

// admin router
app.use('/admin', adminRoute);
app.use('/admin/news',adAuthMidleware.adAuth, newRoute);
app.use('/admin/products',adAuthMidleware.adAuth, productRoute);
app.use('/admin/categories',adAuthMidleware.adAuth, categoryRoute);
app.use('/admin/users',adAuthMidleware.adAuth, userRoute);


app.listen(port, function(){
	console.log("Server listening on port "+ port);
})