var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var sessionSchema = new Schema ({
	session_id : String,
	cart : [{type: String , default : ""}],
})

var Session = mongoose.model('Session', sessionSchema, 'session');

module.exports = Session;