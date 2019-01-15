var Category = require('../models/category.model');
var Product = require('../models/product.model');

module.exports.getCategory = async function(req, res, next){
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

		var categoryName = req.params.categoryName;

		var categoryProducts = await Category.findOne({name : categoryName });

		var productsCate = await Product.find({category_id : categoryProducts._id.toString()});

		var redirectTo = 'categories/' + categoryName;

		for(let i = 0; i< productsCate.length;i++){
			productsCate[i].priceFormat = formatMoney(productsCate[i].price);
		}

		res.render('categories/categoryProducts',{
			redirectTo : redirectTo,
			user: user,
			countCart: countCart,
			categoryProducts : categoryProducts,
			productsCate : productsCate
		})
	}catch(error){
		next(error);
	}
	
}