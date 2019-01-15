var Account = require('../../models/account.model');
var passport = require('passport');


module.exports.getLogin = function(req, res, next){
	res.render('admin/loginAd.pug');
}

module.exports.getAdmin = async function(req, res, next){
	if(!req.signedCookies.userId){
		res.redirect('/admin/login');
	}
		var user = await Account.findOne({_id : req.signedCookies.userId});
		res.render('admin/admin',{
			user : user
		});
};


module.exports.postAdmin = function(req, res, next){
	passport.authenticate('loginAdmin', function(err, user, info){
		if(err) {return next(err);}
		if(!user){ 
			req.flash("error", "Tài khoản hoặc mật khẩu không đúng");
			return res.render('admin/loginAd',{
				body: req.body
			});
		 }
		req.logIn(user, function(err){
			if(err){ return next(err); }
			res.cookie('userId', user._id.toString(),{
				signed: true
			});
			return res.redirect('/admin');
		});
	},{ failureFlash: true})(req, res, next);
}

module.exports.adminLogout = function(req, res, next){
	res.clearCookie('userId');
	res.redirect('/admin');
}
