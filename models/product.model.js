var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var productSchema = new Schema({
	category_id : String,
	name : String,
	description: String,
	price: Number,
	unit : String,
	avatar : [String],
});

//create model
var Product = mongoose.model('Product', productSchema, 'products');

module.exports = Product;