var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var categorySchema = new Schema({
	name : String,
	description : String,
	avatar : String
})

var Category = mongoose.model('Category', categorySchema,'categories');

module.exports = Category;