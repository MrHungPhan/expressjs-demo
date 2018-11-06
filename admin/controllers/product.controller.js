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
	try{
		var products = await Product.find();

		var page = parseInt(req.query.page) || 1; // mac dinh la 1
		var perPage = 5;

		var totalPage = Math.ceil(products.length/perPage);

		var productsListPage = await Product.find().limit(perPage).skip(perPage * (page-1));

		var pageNumber = [];

		if(page == 1)
			pageNumber.push(page, page + 1, page + 2, 'Next', 'Last');
		else if(page > 1 && page < totalPage)
			pageNumber.push('First', 'Prev', page-1, page, page + 1, 'Next','Last');
		else if(page == totalPage)
			pageNumber.push('First', 'Prev',page -2, page -1, page);

		res.render('admin/listProducts',{
			productsList : productsListPage,
			pageNumber : pageNumber,
			lastPage : totalPage,
			page : page,
			perPage: perPage
		});
	}
	catch(error){
		next(error);
	}
};

module.exports.deleteProduct = async function(req, res, next){
	try{

		var productId = req.params.productId;

		await Product.remove({ _id : productId});

		res.redirect('/admin/products/list_products');

	}catch(error){
		next(error);
	}
};

module.exports.getEditProduct = async function(req, res, next){
	
	var productId = req.params.productId;

	var productEdit = await Product.findOne({ _id : productId});

	var categoriesEdit = await Category.find();

	res.render('admin/editProduct',{
		productEdit: productEdit,
		categoriesEdit : categoriesEdit
	})

};

module.exports.editProduct = async function(req, res, next){
	try{
		var productId = req.params.productId;

	// req.body.avatar = req.file.path.split('/').slice(1).join('/');

	await Product.findOneAndUpdate({ _id : productId }, {$set : {'name' : req.body.name, 
		'description' : req.body.description, 'price' : req.body.price, 'avatar' : req.body.avatar}});

	res.redirect('/admin/products/list_products');
	}catch(error){
		next(error);
	}
	
}