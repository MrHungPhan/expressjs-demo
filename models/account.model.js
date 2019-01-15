var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var accountSchema = new Schema({
	username : {
		type : String,
		required :  true
	},
	password : {
		type : String,
		required : true
	}
})

var Account = mongoose.model('Account', accountSchema,'accounts');

module.exports = Account;