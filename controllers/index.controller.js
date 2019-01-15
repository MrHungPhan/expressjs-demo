var Category = require('../models/category.model');
var Product = require('../models/product.model');
var User = require('../models/user.model');
var OrderDetailt = require('../models/orderDetailt.model');
var Order = require('../models/order.model');
var New = require('../models/new.model');
var Session = require('../models/session.model');

var _ = require('lodash');

module.exports.getIndex = async function(req, res, next){
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
		console.log(req.user);
		var countCart = res.locals.countCart;
		if(req.user)
		 	var user = req.user;
		// if(req.signedCookies.userId)
			// var user = await User.findOne({ _id : req.signedCookies.userId});
		var categories = await Category.find();

		var productsCategory = [];
		var categoryGroup = {};

		for(var i = 0; i< categories.length;i++){
			var products = await Product.find({ category_id : categories[i]._id.toString()}).limit(8);
			var arrayTG = [];
			arrayTG.push(categories[i].name, products);
			productsCategory.push(arrayTG);
			// productsCategory.push(products.concat(categories[i].name));
		}

		var news = await New.find();
		for(let i = 0; i< productsCategory.length; i++){
			for(let j = 0; j< productsCategory[i][1].length; j++){
				productsCategory[i][1][j].priceFormat = formatMoney(productsCategory[i][1][j].price);
			}
		}
		
		var newsLast = [];
		newsLast.push(news[news.length -1], news[news.length -2]);

		res.render('index',{
			news : news,
			newsLast : newsLast,
			countCart: countCart,
			user : user,
			productsCategory : productsCategory
		})

	}catch(error){
		next(error);
	}
}

module.exports.liveSearch = async function(req, res, next){
	try{
	var key = req.body.key;

	var productsKey = await Product.find({ name :  new RegExp(key, "i")});

	res.json(productsKey);
	}catch(err){
		next(err);
	}
}

module.exports.liveGetCate = async function(req, res, next){

	var cate = await Category.find();

	res.json(cate);
}

module.exports.liveTestCart = async function(req, res, next){
	var sessionId = req.signedCookies.sessionId;
	var sessionObject = await Session.findOne({session_id : sessionId});
	res.json(sessionObject.cart.length/2);
};

module.exports.liveGetPro = async function(req, res, next){
	var idPr = req.body.idPr;

	var item = await Product.findOne({_id : idPr});

	res.json(item);
};

module.exports.liveGetQuantity = async function(req, res, next){
	var idPr = req.body.idPr;
	var idBill = req.body.idBill;
	var orderIdPr = await OrderDetailt.findOne({order_id : idBill, product_id : idPr})
	res.json(orderIdPr)
};

module.exports.liveUpdateQuantity = async function(req, res, next){

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
	var total = 0;
	var idPr = req.body.idPr;
	if(req.user){
		var idBill = req.body.idBill;
		let quantityUpdate = parseFloat(req.body.quantityUpdate);

		await OrderDetailt.findOneAndUpdate({order_id : idBill, product_id : idPr},{ $set : {quantity : quantityUpdate}});
		var productDetail = await OrderDetailt.find({order_id : idBill});
		for(let i = 0; i< productDetail.length;i++){
			let product = await Product.findOne({_id : productDetail[i].product_id})
			total+= (productDetail[i].quantity * product.price);
		}
		await Order.findOneAndUpdate({_id : idBill},{$set : {total : total}});

		var totalFormat = formatMoney(total);
		var proUpdate = await OrderDetailt.findOne({order_id : idBill, product_id : idPr});
		let response = {};
		response.proUpdate = proUpdate;
		response.total = totalFormat;
		res.json(response);
	}else {
		let quantityUpdate = req.body.quantityUpdate;
		var sessCart = await Session.findOne({session_id : req.signedCookies.sessionId});
		var pro = [];
		var cartArr = sessCart.cart;
		if(cartArr.length !=0){
			for(let i = 0; i<cartArr.length; i+=2){
				if(cartArr[i] === idPr){
					cartArr.splice(i+1, 1, quantityUpdate)
					await Session.findOneAndUpdate({session_id : req.signedCookies.sessionId},{$set :{ cart : cartArr}});
				}

				let item = await Product.findOne({_id : cartArr[i]});
				pro.push(item);
			}

			for(let i = 0; i<cartArr.length; i+=2){
				for(let j = 0; j < pro.length; j ++){
					if(cartArr[i] === pro[j]._id.toString()){
						total += (parseFloat(cartArr[i+1]) * pro[j].price);
					}
				}
			}

			let response = [];
			response.push(cartArr,formatMoney(total));
			res.json(response);
		}
	}

}