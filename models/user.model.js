// var mongoose = require('mongoose');

//  var Schema = mongoose.Schema;

//  var UserSchema = new Schema ({
//  	name : String,
//  	email: String,
//  	password : String,
//  	avatar : {type : String , default : 'https://picsum.photos/200/300'},
//  	phone : String,
//  });

//  var User = mongoose.model('User', UserSchema, 'users');

//  module.exports = User;

var mongoose = require('mongoose');

 var Schema = mongoose.Schema;

 var UserSchema = new Schema ({
 	name : {
 		type: String,
 		reuquired : true
 	},
 	email : {
 		type: String,
 		reuquired : true
 	},
 	phone : {
 		type: String,
 		reuquired : true
 	},
 	password : {
 		type: String,
 		reuquired : true
 	},
 	avatar : {type : String , default : 'https://picsum.photos/200/300'},

 });

 var User = mongoose.model('User', UserSchema, 'users');

 module.exports = User;