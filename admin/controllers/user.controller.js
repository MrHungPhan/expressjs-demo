var User = require('../../models/user.model');

module.exports.getCreateUser = function(req, res, next){
	res.render('admin/users/createUser',{
			user : req.locals.account
		});
}
