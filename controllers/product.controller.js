
var Category = require('../models/category.model');
var Product = require('../models/product.model');
var Session = require('../models/session.model');

// all products
module.exports.getProducts = async function(req, res, next){
		function formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
	  try {
	    decimalCount = Math.abs(decimalCount);
	    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

	    const negativeSign = amount < 0 ? "-" : "";

	    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
	    let j = (i.length > 3) ? i.length % 3 : 0;

	    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "") + '\tĐ';
	  } catch (e) {
	    console.log(e)
	  }
	};


	try{
		var countCart = res.locals.countCart;
		if(req.user)
		 	var user = req.user;
		 var perPage = 9;
		 var page = 1;
		 var categories = await Category.find();
		 if(req.query.category && req.query.minprice && req.query.maxprice){

		 		var proPage = await Product.find({category_id : req.query.category, price : { $gt : parseInt(req.query.minprice), $lt : parseInt(req.query.maxprice) }});

		 		var totalPage = Math.ceil(proPage.length/perPage);

		 		var products = await Product.find({category_id : req.query.category, price : { $gt : parseInt(req.query.minprice), $lt : parseInt(req.query.maxprice) }}).limit(perPage).skip(0);

		 		var cateFilter = await Category.findOne({_id : req.query.category});
		 }
		else{

				if(req.query.category){
					if(req.query.minprice){

						var proPage = await Product.find({category_id : req.query.category, price : {$gt : parseInt(req.query.minprice)} });

				 		var totalPage = Math.ceil(proPage.length/perPage);

				 		var products = await Product.find({category_id : req.query.category, price : {$gt : parseInt(req.query.minprice)} }).limit(perPage).skip(0);

				 		var cateFilter = await Category.findOne({_id : req.query.category});

					}else {

						var proPage = await Product.find({category_id : req.query.category});

				 		var totalPage = Math.ceil(proPage.length/perPage);

				 		var products = await Product.find({category_id: req.query.category}).limit(perPage).skip(0);

				 		var cateFilter = await Category.findOne({_id : req.query.category});

					}

				}else if(req.query.minprice &&  req.query.maxprice) {

						var proPage = await Product.find({ price : { $gt : parseInt(req.query.minprice), $lt : parseInt(req.query.maxprice) } });

				 		var totalPage = Math.ceil(proPage.length/perPage);

				 		var products = await Product.find({ price : { $gt : parseInt(req.query.minprice), $lt : parseInt(req.query.maxprice) } }).limit(perPage).skip(0);

				}else if (req.query.minrice) {

						var proPage = await Product.find({ price : { $gt : parseInt(req.query.minprice) } });

				 		var totalPage = Math.ceil(proPage.length/perPage);

				 		var products = await Product.find({ price : { $gt : parseInt(req.query.minprice) } }).limit(perPage).skip(0);

				}else{
					var proPage = await Product.find();
		
					var totalPage = Math.ceil(proPage.length/perPage);
		
					var products = await Product.find().limit(perPage).skip(0);
				}
		}
		var redirectTo = 'products';

		for(let i = 0; i< products.length;i++){
			products[i].priceFormat = formatMoney(products[i].price);
		}

		var pageNumber = [];
		if(totalPage === 1){
			pageNumber.push(1);
		}else if (totalPage === 2) {
			pageNumber.push(1,2);
		}else if (totalPage === 3) {
			pageNumber.push(1,2,3);
		}
		else if(totalPage === 4){
			pageNumber.push(page, page + 1, page + 2,'Last');
		}
		else{
			// pageNumber.push('First', 'Prev', page-1, page, page + 1, 'Next','Last');	
		}


		res.render('products/products',{
			priceQueryMinPrice : req.query.minprice,
			priceQueryMaxPrice : req.query.maxprice,
			cateQueryId : req.query.category,
			cateFilter : cateFilter,
			page : page,
			perPage: perPage,
			lastPage : totalPage,
			categories : categories,
			redirectTo : redirectTo,
			user: user,
			countCart: countCart,
			products : products,
			pageNumber : pageNumber

		});
	}catch(error){
		next(error);
	}
};

// ajax call all products page
module.exports.getProductsPage = async function(req, res, next){
	
	function formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
	  try {
	    decimalCount = Math.abs(decimalCount);
	    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

	    const negativeSign = amount < 0 ? "-" : "";

	    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
	    let j = (i.length > 3) ? i.length % 3 : 0;

	    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "") + '\tĐ';
	  } catch (e) {
	    console.log(e)
	  }
	};

	try{
		var countCart = res.locals.countCart;
		if(req.user)
		 	var user = req.user;
		 var perPage = 9;
		 var page = req.params.page;
		 var categories = await Category.find();
		 if(req.body.category && req.body.minprice && req.body.maxprice){

		 		var proPage = await Product.find({category_id : req.body.category, price : { $gt : parseInt(req.body.minprice), $lt : parseInt(req.body.maxprice) }});

		 		var totalPage = Math.ceil(proPage.length/perPage);

		 		if(page === 'Last')
		 			page = totalPage;
		 		if(page === 'First')
		 					page = 1;

		 		var products = await Product.find({category_id : req.body.category, price : { $gt : parseInt(req.body.minprice), $lt : parseInt(req.body.maxprice) }}).limit(perPage).skip(perPage * (page-1));

		 		var cateFilter = await Category.findOne({_id : req.body.category});
		 }
		else{

				if(req.body.category){
					if(req.body.minprice){

						var proPage = await Product.find({category_id : req.body.category, price : {$gt : parseInt(req.body.minprice)} });

				 		var totalPage = Math.ceil(proPage.length/perPage);

				 		if(page === 'Last')
		 					page = totalPage;
		 				if(page === 'First')
		 					page = 1;

				 		var products = await Product.find({category_id : req.body.category, price : {$gt : parseInt(req.body.minprice)} }).limit(perPage).skip(perPage * (page-1));

				 		var cateFilter = await Category.findOne({_id : req.body.category});

					}else {

						var proPage = await Product.find({category_id : req.body.category});

				 		var totalPage = Math.ceil(proPage.length/perPage);

				 		if(page === 'Last')
		 					page = totalPage;
		 				if(page === 'First')
		 					page = 1;

				 		var products = await Product.find({category_id: req.body.category}).limit(perPage).skip(perPage * (page-1));

				 		var cateFilter = await Category.findOne({_id : req.body.category});

					}

				}else if(req.body.minprice &&  req.body.maxprice) {

						var proPage = await Product.find({ price : { $gt : parseInt(req.body.minprice), $lt : parseInt(req.body.maxprice) } });

				 		var totalPage = Math.ceil(proPage.length/perPage);

				 		if(page === 'Last')
		 					page = totalPage;
		 				if(page === 'First')
		 					page = 1;

				 		var products = await Product.find({ price : { $gt : parseInt(req.body.minprice), $lt : parseInt(req.body.maxprice) } }).limit(perPage).skip(perPage * (page-1));

				}else if (req.body.minrice) {

						var proPage = await Product.find({ price : { $gt : parseInt(req.body.minprice) } });

				 		var totalPage = Math.ceil(proPage.length/perPage);

				 		if(page === 'Last')
		 					page = totalPage;
		 				if(page === 'First')
		 					page = 1;

				 		var products = await Product.find({ price : { $gt : parseInt(req.body.minprice) } }).limit(perPage).skip(perPage * (page-1));

				}else{
					var proPage = await Product.find();
		
					var totalPage = Math.ceil(proPage.length/perPage);

					if(page === 'Last')
		 				page = totalPage;
		 			if(page === 'First')
		 					page = 1;
		
					var products = await Product.find().limit(perPage).skip(perPage * (page-1));
				}
			}
		}catch(error){
		next(error);
		}
		for(let i = 0; i< products.length;i++){
			products[i].priceFormat = formatMoney(products[i].price);
		}


		// var pageNumber = [];

		// if(totalPage === 1){
		// 	pageNumber.push(1);
		// }else if (totalPage === 2) {
		// 	pageNumber.push(1,2);
		// }else if (totalPage === 3) {
		// 	pageNumber.push(1,2,3);
		// }
		// else if(totalPage === 4){
		// 	pageNumber.push(page, page + 1, page + 2,'Last');
		// }
		// else{
		// 	pageNumber.push('First', 'Prev', page-1, page, page + 1, 'Next','Last');	
		// }

	res.render('products/pagination',{
		products : products
	});

}


// ajax products filter
// module.exports.getFilterProduct = async function(req, res, next){
// 	function formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
// 	  try {
// 	    decimalCount = Math.abs(decimalCount);
// 	    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

// 	    const negativeSign = amount < 0 ? "-" : "";

// 	    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
// 	    let j = (i.length > 3) ? i.length % 3 : 0;

// 	    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "") + '\tĐ';
// 	  } catch (e) {
// 	    console.log(e)
// 	  }
// 	};
// 	var perPage = 9;
// 	if(req.body.category){
// 		var cateId = req.body.category;

// 		var productsCategory = await Product.find({category_id : cateId}).limit(perPage).skip(0);

// 		var cate = await Category.findOne({_id : cateId});

// 		for(let i = 0; i< productsCategory.length; i++){
// 			productsCategory[i].priceFormat = formatMoney(productsCategory[i].price);
// 		}

// 		var totalPage = Math.ceil(productsCategory.length/perPage);
// 		res.render('products/pagination',{
// 			products : productsCategory,
// 		})

// 		var productsCategory = await Product.find({category_id : cateId});
// 		for(let i = 0; i< productsCategory.length; i++){
// 			productsCategory[i].priceFormat = formatMoney(productsCategory[i].price);
// 		}
// 		var perPage = 9;
// 		var totalPage = Math.ceil(productsCategory.length/perPage);

// 		var pageNumberFilter = [];

// 		if(totalPage === 1){
// 			pageNumberFilter.push(1);
// 		}else if (totalPage === 2) {
// 			pageNumberFilter.push(1,2);
// 		}else if (totalPage === 3) {
// 			pageNumberFilter.push(1,2,3);
// 		}
// 		else{
// 			if(page == 1)
// 				pageNumberFilter.push(page, page + 1, page + 2, 'Next', 'Last');
// 			else if(page > 2 && page < totalPage)
// 				pageNumberFilter.push('First', 'Prev', page-1, page, page + 1, 'Next','Last');
// 			else if(page == totalPage)
// 				pageNumberFilter.push('First', 'Prev',page -2, page -1, page);
// 		}

// 		res.render('products/pagination',{
// 			cateName : cate.name,
// 			pageNumberFilter : pageNumberFilter,
// 			totalPage : totalPage,
// 			perPage : perPage,
// 			products : productsCategory,
// 		})
// 	}
// }

module.exports.getProductDetailt =  async function(req, res, next){

	function formatMoney(amount, decimalCount = 0, decimal = ".", thousands = ",") {
	  try {
	    decimalCount = Math.abs(decimalCount);
	    decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

	    const negativeSign = amount < 0 ? "-" : "";

	    let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
	    let j = (i.length > 3) ? i.length % 3 : 0;

	    return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "") + '\tĐ';
	  } catch (e) {
	    console.log(e)
	  }
	};

	var countCart = res.locals.countCart;
	if(req.user)
		 	var user = req.user;

	var productId = req.params.productId;

	var productDetailt = await Product.findOne({ _id : productId });

	var categoryId = productDetailt.category_id;

	var categoryProduct = await Category.findOne({ _id : categoryId });

	var redirectTo = 'products/' + productId;

	productDetailt.priceFormat = formatMoney(productDetailt.price);

	productDetailt.priceFormat = formatMoney(productDetailt.price);

	res.render('products/productDetailt',{
		redirectTo : redirectTo,
		user: user,
		body: req.body,
		productDetailt : productDetailt,
		categoryProduct : categoryProduct,
		countCart: countCart
	})
};
