
var Category = require('../models/category.model');
var Product = require('../models/product.model');

module.exports.getProductDetailt =  async function(req, res, next){

	var productId = req.params.productId;

	var productDetailt = await Product.findOne({ _id : productId });

	var categoryId = productDetailt.category_id;

	var categoryProduct = await Category.findOne({ _id : categoryProduct });

	res.render('products/productDetailt',{
		productDetailt : productDetailt,
		categoryProduct : categoryProduct
	})
};
