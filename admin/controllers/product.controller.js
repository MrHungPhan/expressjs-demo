var Category = require('../../models/category.model');

var Product = require('../../models/product.model');

module.exports.getCreateProduct = async function(req, res, next){

	var categories = await Category.find();
	res.render('admin/createProduct',{
		categories: categories
	});
};

module.exports.postCreateProduct = function(req, res, next){
	
	req.body.avatar = req.file.path.split('/').slice(1).join('/');

	Product.create(req.body);
	res.redirect('/admin/products/list_products');

}

module.exports.getListProducts = async function(req, res, next){

	var products = await Product.find();

	res.render('admin/listProducts',{
		productsList : products
	})
}