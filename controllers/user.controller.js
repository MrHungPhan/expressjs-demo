var User = require('../models/user.model');
var Product = require('../models/product.model');
var md5 = require('md5');
var transporter = require('../config/sendEmail');
var bcrypt = require('bcrypt');
var passport = require('passport');

module.exports.getLogin = function(req, res, next){
	var redirectTo = req.query.redirectTo;
	res.render('users/loginUser',{
		redirectTo : redirectTo
	});
}

module.exports.getSignup = function(req, res, next){
	res.render('users/signup');
}

// module.exports.getSignup = function(req, res, next){
// 	res.render('users/signupUser');
// }

// module.exports.postSignup = async function(req, res, next){
// 	try{
// 		var email = req.body.email;
// 	var name = req.body.name;
// 	var phone = req.body.phone;
// 	var pass = req.body.password;

// 	var errors = [];

// 	if(!email){
// 		errors.push('email');
// 	}
// 	if (!name) {
// 		errors.push('name');
// 	}
// 	 if (!phone) {
// 		errors.push('phone');
// 	}
// 	 if (!pass) {
// 		errors.push('pass');	
// 	}

// 	var user = await User.findOne({email : email});

// 	if(user){
// 		errors.push('email-exist');
// 	}

// 	if(errors.length != 0){
// 		res.render('users/signupUser',{
// 		errors : errors,
// 		body: req.body,
// 		});
// 		return;	
// 	}



// 	req.body.password = md5(pass);

// 	await User.create(req.body);

// 	res.redirect('/user/login');
// 	}catch(error){
// 		next(error);
// 	}
	
// };

module.exports.postSignup = async (req, res, next) =>{
	var email = req.body.email;
	var name = req.body.name;
	var phone = req.body.phone;
	var password = req.body.password;
	var password2 = req.body.password2;

	var user = await User.findOne({email :email});

	req.checkBody('email', 'Email khong duoc de trong ').notEmpty();
	req.checkBody('email', 'Email khong dung dinh dang ').isEmail();
	req.checkBody('phone', 'Phone khong duoc de trong ').notEmpty();
	req.checkBody('password', 'Password khong duoc de trong ').notEmpty();
	req.checkBody('name', 'Name khong duoc de trong ').notEmpty();
	req.checkBody('password2', 'Password khong khop ').equals(req.body.password);
	req.checkBody('password2', 'Yeu cau nhap lai mat khau').notEmpty();

	let errors = req.validationErrors();
	if(user){
		if(errors === false)
			errors = [{param: 'email', msg : 'Email da ton tai', value : ''}];
		else
			errors.push({param: 'email', msg : 'Email da ton tai', value : ''});
	}
	if(errors){
		console.log(errors);
		res.render('users/signup',{
			body: req.body,
			errors : errors,
		
		});
	}else{

		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(password, salt, async function(err, hash){
				if(err){
					console.log(err);
				}
				password = hash;
				console.log('passHash : ' + hash);
				await User.create({ name, email, phone, password});
				req.flash("success", "Ban da dang ki thanh cong , Moi dang nhap");
				res.redirect('/user/login');
			})
		})

		
		//send mail
		transporter.sendMail({
			from: '<envious-beetle@example.com>',
			to : email,
			subject : 'Phan Hung',
			 template: 'email', // plain text body
       		 context : {
       		 	name,
       		 	email,
       		 	password,
       		 } // html body
		}, function(error, responsive){
			if(error){
				console.log('Send mail fail' + error);
			}else {
				console.log('Send mail success');
			}
		})
	}

};

// module.exports.postLogin = async function(req, res, next){
// 	try{
// 		var email = req.body.email;
// 		var pass = req.body.password;

// 		var userLogin = await User.findOne({email : email});

// 		if(!userLogin){
// 			// res.render('users/loginUser',{
// 			// 	error: [
// 			// 		"Email doesn't exist."
// 			// 	],
// 			// 	body : req.body
// 			// });
// 			res.json({msgErr : 'Email khong ton tai !!!'});
// 			return;
// 		}

// 		var passHash = md5(pass);

// 		if(passHash !== userLogin.password){
// 			// res.render('users/loginUser',{
// 			// 	error: [
// 			// 		"Wrong password."
// 			// 	],
// 			// 	body : req.body
// 			// });
// 			res.json({msgErr : 'Mat khau khong dung !!!'});
// 			return;
// 		}
// 	res.json({msg: 'Dang nhap thanh cong'});
// 	res.session.user = userLogin;
// 	res.cookie('userId', userLogin._id.toString(),{
// 		signed: true
// 	});

// 	}catch(error){
// 		next(error);
// 	}
	
// };

module.exports.postLogin = function( req, res, next){
	 passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.redirect('/user/login'); }
    req.logIn(user, function(err) {
    var redirectTo = req.query.redirectTo;
     if (err) { return next(err); }
     if(redirectTo !== "undefined")
     	return res.redirect(redirectTo);
     else  {
     	return res.redirect('/home');

     }
    });
  })(req, res, next);

};

// module.exports.postLogin = function( req, res, next){
// 	passport.authenticate('local', function(err, user, info){
// 		 if (err) { return next(err); }
//         if (!user) { 
//         	req.flash('danger' , 'Email hoăc mật khẩu không đúng');
//         	return res.render('users/loginUser',{
//         		body : req.body
//         	});
//         }
//         req.logIn(user, function(err) {
//             if (err) { return next(err); }
//             return res.json({ home : 'hihi'});
//         });
// 	})(req,res,next);

// };


module.exports.logout = function(req, res, next){
	req.logout();
	// req.flash('success', "Bạn đẵ đăng xuất thành công");
	// res.clearCookie('sessionId');
	var redirectTo = req.query.redirectTo;
	if(redirectTo)
		res.redirect(redirectTo);
	else
		res.redirect('/home');
};