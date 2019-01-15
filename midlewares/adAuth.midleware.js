var Account = require('../models/account.model');

module.exports.adAuth = async function(req, res, next){

	if(!req.signedCookies.userId){
		res.redirect('/admin/login');
	}
	var account = await Account.findOne({_id : req.signedCookies.userId});
	res.locals.account = account;
	next();
}