var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PaySchema = new Schema ({
	name : {
		type : String
	},
	description : {
		type : String
	}
});

var Pay = mongoose.model('PaySchema', PaySchema, 'pay');

module.exports = Pay;