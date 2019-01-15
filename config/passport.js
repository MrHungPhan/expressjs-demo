const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user.model');
const Account = require('../models/account.model');
const bcrypt = require('bcrypt');


module.exports = function(passport){
		passport.serializeUser(function(user, done) {
		  done(null, user.id);
		});

		passport.deserializeUser(function(id, done) {
		  User.findById(id, function(err, user) {
		    done(err, user);
		  });
		});
		
		passport.use('local',new LocalStrategy({
			usernameField : 'email',
			passwordField : 'password',
			passReqToCallback: true
		},function( req,username, password, done){
			//Match username
				let query = { email : username} ;
				User.findOne(query, function(err, user){
					if(err) console.log(err);
					if(!user){
						return done(null, false, {message: 'Email không tồn tại !'});
					}

					//Match password
					bcrypt.compare(password, user.password, function(err, isMatch){
						if(err) console.log(err);
						if(isMatch){
							return done(null, user);
						}else {
							return done(null, false, { message : 'Sai mật khẩu'});
						}
					});
				});
			
		}));


		passport.use('loginAdmin', new LocalStrategy({
			usernameField : 'username',
			passwordField : 'password',
			passReqToCallback: true
		}, function(req, username, password, done){
			let query = {username : username};
			Account.findOne(query, function( err, user){
				if(err) console.log(err);
				if(!user){
					return done(null, false, {message: "Tài khoản không tồn tại"});
				}
				bcrypt.compare(password, user.password, function(err, isMatch){
						if(err) console.log(err);
						if(isMatch){
							return done(null, user);
						}else {
							return done(null, false, { message : 'Sai mật khẩu'});
						}
				});
			});
		}));

}


