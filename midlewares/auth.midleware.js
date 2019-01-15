var User = require('../models/user.model');

module.exports.authMidle = async function(req, res, next){

	if(!req.signedCookies.userId){
		res.redirect('/user/login');
		return;
	}

	try{
		var user = await User.findOne({ _id : req.signedCookies.userId});
		if(!user){
			res.redirect('/user/login');
			return;
		}
		res.locals.user = user;

	}catch(error){
		next(error);
	}
	next();
}