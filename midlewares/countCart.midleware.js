var Session = require('../models/session.model');
var Order = require('../models/order.model');
var OrderDetailt = require('../models/orderDetailt.model');

module.exports.countCartMidle = async function(req, res, next){

	try{
		var countCart = 0;
		if(req.user){
			var orderUser = await Order.findOne({user_id : req.user._id.toString(), status : "NotPick"});
			if(orderUser){
				var orderId = orderUser._id.toString();

			var orderDetailtOfUser = await OrderDetailt.find({order_id : orderId});

			countCart = orderDetailtOfUser.length;
			}
			
			res.locals.countCart = countCart;
		}
		else if(req.signedCookies.sessionId){
			var sessionCart = await Session.findOne({session_id : req.signedCookies.sessionId});

			
			if(sessionCart.cart){
				countCart = sessionCart.cart.length/2;
			
			}
			res.locals.countCart = countCart;
		}
		
		
	}catch(error){
		next(error);
	}
	next();
}