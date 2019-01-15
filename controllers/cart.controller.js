var OrderDetailt = require('../models/orderDetailt.model');
var Order = require('../models/order.model');
var Product = require('../models/product.model');
var Session = require('../models/session.model');
var User = require('../models/user.model');
var Pay = require('../models/pay.model');
var _ = require('lodash');
var request = require("request");
var transporter = require('../config/sendEmail');

module.exports.postAddToCart = async function(req, res, next){
		var sessionId = req.signedCookies.sessionId;
			var productId = req.params.productId;

			console.log(req.body);

			var quantity = parseFloat(req.body.quantity);

			var productsArr = [];

			var sessionObject = await Session.findOne({session_id : sessionId});
			var cartSs = sessionObject.cart;

		if(!req.user){

			if(cartSs !== ""){
				if(cartSs.length / 2 <5){
					var proIdArr = [];
					for(let i = 0; i < cartSs.length; i+=2){
						proIdArr.push(cartSs[i]);
					}
					function ktExist(proId){
						for(let i = 0; i< proIdArr.length; i++){
							if(proId === proIdArr[i]) return true;
						}
					}

					if(ktExist(productId)){
						for(let i = 0; i < cartSs.length; i++){
						  if(productId === cartSs[i]){
						    cartSs[i+1] = ((parseFloat(cartSs[i+1]) + parseFloat(quantity)).toFixed(1)).toString();
						  }
						 }
					}else{
						cartSs.push(productId, quantity);
					}
					await Session.findOneAndUpdate({session_id : sessionId}, {$set :{ cart : cartSs}}, {upsert : false});
					res.redirect('/products/'+productId);
				}else {
					res.redirect('/products/'+productId);
				}
			}else {
				cartSs.push(productId, quantity)
				 await Session.findOneAndUpdate({session_id : sessionId}, {$set :{ cart : cartSs}}, {upsert : false});
				 res.redirect('/products/'+productId);
			}
		}
		else{
			var user = await User.findOne({ _id : req.user._id.toString()});
					var order = await Order.findOne({ user_id : req.user._id.toString(), status : "NotPick"});
					
					// var orderDetailtArr = [];
					// for(let i = 0; i < orderDetailt; i ++){
					// 	orderDetailtArr.push(orderDetailt[i].product_id);

				// TH: order !== nulll 
				if(order !== null){
					var orderDetailt = await OrderDetailt.find({order_id : order._id.toString()});

					function testExist(item){
						for(let i = 0; i< orderDetailt.length;i++){
							if(item === orderDetailt[i].product_id)
								return true;
						}
						return false;
					}
		
						
						try{
						
								if(testExist(productId)){
								let orderQuantity = await OrderDetailt.findOne({product_id : productId,order_id : order._id.toString()});
								let quantityNew = (orderQuantity.quantity + quantity).toFixed(1);
								await OrderDetailt.findOneAndUpdate({product_id : productId, order_id : order._id.toString()} , {$set : {quantity: quantityNew}});
								}
								else 
									await OrderDetailt.create({order_id : order._id.toString(), product_id : productId, quantity : quantity});
								
								}
					
							
						
						catch(err){
							next(err);
							
					}
				
				// }
			}

				//order === null and cart = 0

				if(order === null && sessionObject.cart.length === 0){
						await Order.create({user_id : user._id.toString()});
						var order = await Order.findOne({user_id : user._id.toString(), status : "NotPick"});
						await OrderDetailt.create({order_id : order._id.toString(), product_id : productId, quantity : quantity});

				}

				res.redirect('/products/'+productId);
		}
		
};

module.exports.getCart = async function(req, res, next){
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
	var productArray = [];
	var total  = 0;
	if(req.user){
		let userId = req.user._id.toString();
		let orderUser = await Order.findOne({ user_id : userId, status : "NotPick"});
		if(orderUser){
			let orderId = orderUser._id.toString();
			let productOrder = await OrderDetailt.find({ order_id : orderId});

			if(productOrder){
				for(let i = 0; i < productOrder.length; i++){
					var item = await Product.findOne({_id : productOrder[i].product_id});
					item.quantity = productOrder[i].quantity;
					productArray.push(item);
				}
			}

			// total
			for(let i = 0; i< productArray.length; i++){
			total += (productArray[i].quantity * productArray[i].price)
			}

			for(let i = 0; i < productArray.length; i ++){
				productArray[i].priceFormat = formatMoney(productArray[i].price);
			}

			let redirectTo = 'cart';

				res.render('cart/cart',{
					orderId : orderId,
					redirectTo : redirectTo,
					productDetailtList: productArray,
					total: formatMoney(total),
					user : req.user,
					count : res.locals.countCart
				});
		}else {
			let redirectTo = 'cart';
			res.render('cart/cart',{
					redirectTo : redirectTo,
					productDetailtList: productArray,
					total: formatMoney(total),
					user : req.user,
					count : 0
				});
		}
		
	}else{
		let sessionId = req.signedCookies.sessionId;
		let productDetailtObject = await Session.findOne({session_id : sessionId});
		// let cartSessionObject = _.countBy(productDetailtObject.cart);
		let cartSsPro = productDetailtObject.cart;

		for(let i = 0; i,i < cartSsPro.length; i+=2){
			let item = await Product.findOne({_id : cartSsPro[i]});
			item.quantity =parseFloat(cartSsPro[i+1]);
			productArray.push(item);
		}

		for(let i = 0;i < productArray.length; i++){
			total += productArray[i].quantity * productArray[i].price;
		}

		for(let i = 0; i < productArray.length; i ++){
				productArray[i].priceFormat = formatMoney(productArray[i].price);
		}

		let redirectTo = 'cart';

		res.render('cart/cart',{
			redirectTo : redirectTo,
			productDetailtList: productArray,
			total: formatMoney(total),
			user : req.user,
			count : res.locals.countCart
		});
	}
	
};

module.exports.getCartCheckout = async  function(req, res, next){
	
	if(req.user){
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

		var productArray = [];
		var total  = 0;
		var orderId = req.query.order;
		let productOrder = await OrderDetailt.find({ order_id : orderId});

		if(productOrder){
			for(let i = 0; i < productOrder.length; i++){
				var item = await Product.findOne({_id : productOrder[i].product_id});
				item.quantity = productOrder[i].quantity;
				productArray.push(item);
			}
		}

		for(let i = 0; i< productArray.length; i++){
		total += (productArray[i].quantity * productArray[i].price)
		}

		for(let i = 0; i<productArray.length;i++){
			productArray[i].priceFormat = formatMoney(productArray[i].price);
		}

		var pay = await Pay.find();
		res.render('cart/order',{
			orderId : orderId,
			productArray : productArray,
			total : formatMoney(total),
			pay : pay
		});
	}else{

		res.redirect('/user/login?redirectTo=/cart');
	}
};

module.exports.postCartCheckout = async  function(req, res, next){
	var orderId = req.query.order;

	console.log(req.query.order);
	console.log(req.body);
	console.log(req.body.pay);


	var productArray = [];
	var total = 0;

	let productOrder = await OrderDetailt.find({ order_id : orderId});

			if(productOrder){
				for(let i = 0; i < productOrder.length; i++){
					var item = await Product.findOne({_id : productOrder[i].product_id});
					item.quantity = productOrder[i].quantity;
					productArray.push(item);
				}
			}
			for(let i = 0; i< productArray.length; i++){
			total += (productArray[i].quantity * productArray[i].price)
			}


	var options = { method: 'POST',
	  url: 'https://apiv3-test.ghn.vn/api/v1/apiv3/CreateOrder',
	  body: 
	   { token: 'TokenStaging',
	     PaymentTypeID: 2,
	     FromDistrictID: 1617,
	     ToDistrictID: parseInt(req.body.distric),
	     ExternalCode: '',
	     ClientContactName: 'Thực Phẩm Sạch',
	     ClientContactPhone: '0987654321',
	     ClientAddress: '70 Võ Thị Sáu, TP Vinh, NA',
	     CustomerName: req.body.name,
	     CustomerPhone: req.body.phone,
	     ShippingAddress: req.body.add,
	     NoteCode: 'CHOXEMHANGKHONGTHU',
	     Content: 'Test nội dung',
	     CoDAmount: total,
	     Weight: productArray.length * 500,
	     Length: 1,
	     Width: 1,
	     Height: 1,
	     ServiceID:parseInt(req.body.service),
	     CheckMainBankAccount: false,
	     ReturnContactName: 'Thực Phẩm Sach',
	     ReturnContactPhone: '01643277249',
	     ReturnAddress: '50 thành thái',
	     ReturnDistrictID: 1617 },
	  json: true };

	request(options,  function (error, response, body) {
	  if (error) throw new Error(error);
	  	 var result = body.data;
	  	   console.log(body);
	  	var optionsSer = { method: 'POST',
		  url: 'https://console.ghn.vn/api/v1/apiv3/FindAvailableServices',
		  body: 
		   { token: '5c239d8a94c06b2dc11d09b6',
		     FromDistrictID: 1617,
		     ToDistrictID:  parseInt(req.body.distric),
		     Weight:  productArray.length * 500,
		     Length: 1,
		     Width: 1,
		     Height: 1 },
		  json: true };

		request(optionsSer, async function (error, response, body) {
		  if (error) throw new Error(error);

		  console.log(body);
		  var serviceFee = 0;
		  for(let i = 0; i< body.data.length; i++){
		  	if(body.data[i].ServiceID === parseInt(req.body.service)){
		  			serviceFee = body.data[i].ServiceFee;
		  	}
		  }

		   await Order.findOneAndUpdate({_id : orderId},{ $set : {status : "Picked", "buyer_name" : req.body.name, "buyer_phone" : req.body.phone, "buyer_add": req.body.add, "pay_id": req.body.pay, "order_code" : result.OrderCode, "total": total+serviceFee}});
	  	res.redirect("/cart/success?order="+result.OrderCode);

	  	// send email
	  	var user = req.user;
	  	var products = "";
	  	for(let i = 0; i< productArray.length; i++){
	  		products  = products + productArray[i].name + ", "; 
	  	}
	  	var order = await Order.findOne({_id : orderId});

	  	transporter.sendMail({
			from: '<envious-beetle@example.com>',
			to : user.email,
			subject : 'Phan Hung',
			 template: 'mailOrder', // plain text body
       		 context : {
       		 	user,
       		 	products,
       		 	order,
       		 } // html body
		}, function(error, responsive){
			if(error){
				console.log('Send mail fail' + error);
			}else {
				console.log('Send mail success');
			}
		})

		});
	});
}


module.exports.getSucessOrder = async function(req, res, next){
	if(req.user){
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
	var orderCode = req.query.order;

	var order = await Order.findOne({ order_code : orderCode});

	var total = formatMoney(order.total);

	var pay = await Pay.findOne({_id : order.pay_id});

	res.render("cart/checkoutSuccess",{
		total : total,
		user : req.user,
		order : order,
		pay : pay,
	})
	}else {
		res.redirect('/user/login');
	}
};

module.exports.liveDeleteOrderDateilt = async function(req,res, next){
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

	var idPr = req.body.idPr;
	var response = {};
	var total = 0;
	var countCart = 0
	if(req.user){
		var idBill = req.body.idBill;

		await OrderDetailt.remove({order_id : idBill, product_id : idPr});
		var productDetail = await OrderDetailt.find({order_id : idBill});
		for(let i = 0; i< productDetail.length;i++){
			let product = await Product.findOne({_id : productDetail[i].product_id})
			total+= (productDetail[i].quantity * product.price);
		}
		await Order.findOneAndUpdate({_id : idBill},{$set : {total : total}});

		countCart = productDetail.length
		response.countCart = countCart;
		response.total = formatMoney(total);
		res.json(response);
	}else{
		try{
			let Ss = await Session.findOne({session_id : req.signedCookies.sessionId});
		let cartSs = Ss.cart;
		var pro = [];
		for(let i = 0; i< cartSs.length; i+=2){
			if(cartSs[i] === idPr){
				cartSs.splice(i,2);
			}
		}

		for(let i =0 ;i < cartSs.length; i+=2){
			let item = await Product.findOne({_id : cartSs[i]});
			pro.push(item);
		}

		for(let i = 0; i<cartSs.length; i+=2){
			for(let j = 0; j < pro.length; j ++){
				if(cartSs[i] === pro[j]._id.toString()){
					total += (parseFloat(cartSs[i+1]) * pro[j].price);
				}
			}
		}

		await Session.findOneAndUpdate({session_id: req.signedCookies.sessionId},{ $set : {cart : cartSs}});
		
		countCart = cartSs.length/2;
		response.countCart = countCart;
		response.total = formatMoney(total);
		res.json(response);
		
		}catch(err){
			next(err);
		}
		
		
	}
}