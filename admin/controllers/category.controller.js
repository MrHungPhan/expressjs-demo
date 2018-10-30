var Category = require('../../models/category.model');

module.exports.getCreateCategory = function(req, res, next){
	res.render('admin/createCategory.pug');
};

module.exports.postCreateCategory = function(req, res, next){
	req.body.avatar = req.file.path.split('/').slice(1).join('/');
	Category.create(req.body);
	res.redirect('/admin/categories/list_categories');
}

module.exports.getListCategories = async function(req, res, next){

	var categoriesList = await Category.find();
	res.render('admin/listCategories',{
		categoriesList : categoriesList
	});
}