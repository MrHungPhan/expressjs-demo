var User = require('../models/user.model');
var Session = require('../models/session.model');
var Order = require('../models/order.model');
var OrderDetailt = require('../models/orderDetailt.model');

var _ = require('lodash');

module.exports.userMidle = async function(req, res, next){

	try{
		if(req.user){

			var user = req.user;

			var sessionId = req.signedCookies.sessionId;

			var order = await Order.findOne({ user_id : user._id.toString(), status : "NotPick"});
			var sessionProduct = await Session.findOne({ session_id : sessionId});
			// if(sessionProduct.cart !== null){
			// 	var cartSessionObject = _.countBy(sessionProduct.cart)
			// 	var cartSessionArr = _.toPairsIn(cartSessionObject);
			// }

			var cartSs = sessionProduct.cart;

			if((order === null)){
				if(cartSs.length !== 0){
					await Order.create({user_id : user._id.toString()});
					var order = await Order.findOne({user_id : user._id.toString()});
					for(let i = 0; i< cartSs.length ; i+=2){
							await OrderDetailt.create({order_id : order._id.toString(), product_id : cartSs[i], quantity : cartSs[i+1]});
					}
				}
			}else{
				var orderDetailt = await OrderDetailt.find({order_id : order._id.toString()});
				function testExist(item){
						for(let i = 0; i< orderDetailt.length;i++){
							if(item === orderDetailt[i].product_id)
								return true;
						}
						return false;
				}
				if(cartSs.length !== 0){
					for(let i =0; i < cartSs.length; i+=2){
						if(testExist(cartSs[i])){
							let orderQuantity = await OrderDetailt.findOne({product_id : cartSs[i],order_id : order._id.toString()});
							let quantityNew = orderQuantity.quantity + parseFloat(cartSs[i+1]);
							await OrderDetailt.findOneAndUpdate({product_id : cartSs[i], order_id : order._id.toString()}, {$set : { quantity : quantityNew}});
						}else{
							OrderDetailt.create({order_id : order._id.toString(), product_id : cartSs[i], quantity : parseFloat(cartSs[i+1])});
						}
					}
				}
			}

		await Session.findOneAndUpdate({session_id : sessionId}, {$set : { cart : []}})		

		}
		
	}catch(error){
		next(error);
	}
	next();
}