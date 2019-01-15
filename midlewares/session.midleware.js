var shortid = require('shortid');

var Session = require('../models/session.model');

module.exports.sessionMidle = async  function(req, res, next){
	if(!req.signedCookies.sessionId){
		var sessionId = shortid.generate();

		res.cookie("sessionId", sessionId, {
			signed : true
		});

			await Session.create({session_id : sessionId});
	}

	next();
};