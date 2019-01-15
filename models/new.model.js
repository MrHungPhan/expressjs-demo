var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var newSchema = new Schema({
	title : {
		type: String,
		required : true
	},
	content :{
		type : String,
		required: true
	},
	title_content : {
		type : String,
		required : true
	},	
	time_up : {type : Date, default : Date.now},
	avatar_around : {
		type: [String],
	},
	author : {
		type : String,
		required: true
	}
})

var New = mongoose.model('New', newSchema,'news');

module.exports = New;