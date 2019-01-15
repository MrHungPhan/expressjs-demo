var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema({
	user_id : String,
	status : {type : String , default : "NotPick"},
	buyer_name : {type : String},
	buyer_phone : {type : String},
	buyer_add : {type : String},
	pay_id : {type: String},
	order_code  : {type : String},
	total : {type : Number},
	timein : {type : Date, default : Date.now}
});

var Order = mongoose.model('Order', OrderSchema, 'order');

module.exports = Order;