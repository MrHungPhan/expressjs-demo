var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var OrderSchema = new Schema ({
	product_id : String,
	order_id : String,
	quantity : Number
});

var OrderDetailt = mongoose.model('OrderDetailt', OrderSchema, 'orderdetail');

module.exports = OrderDetailt;