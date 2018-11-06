var Category = require('../models/category.model');
var Product = require('../models/product.model');
var _ = require('lodash');

module.exports.getIndex = async function(req, res, next){
	try{
		var categories = await Category.find();

		var productsCategory = [];
		var categoryGroup = {};

		for(var i = 0; i< categories.length;i++){
			var products = await Product.find({ category_id : categories[i]._id.toString()}).limit(4);
			var arrayTG = [];
			arrayTG.push(categories[i].name, products);
			productsCategory.push(arrayTG);
			// productsCategory.push(products.concat(categories[i].name));
		}

		res.render('index',{
			productsCategory : productsCategory
		})

	}catch(error){
		next(error);
	}
}
