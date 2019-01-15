
$(document).ready(function($) {

	// menu bar fixed
window.onscroll = function(){ myFunction();}

function myFunction(){
	// if(document.body.scrollTop > 40 || document.documentElement.scrollTop > 50){
	// 	document.getElementsByClassName("nav.navbar.navbar-default").className = "navbar-fixed-top";
	// }
	var x = document.body.scrollTop;

	if (x > 0){
		document.querySelector("nav.navbar.navbar-default")
		.classList.add('navbar-fixed-top','menu-boxshadow');
	}
	else {
		document.querySelector("nav.navbar.navbar-default")
		.classList.remove('navbar-fixed-top','menu-boxshadow');
	}
}

//click name user
$(document).click(function(event) {
	if($(event.target).is("#username")){
		$('ul.focus-user').addClass('active');
	}else {
		$('ul.live-search').css('display', 'none');
		$('ul.focus-user').removeClass('active');
	}
});
// live search
$('input#search').on('input', function(){
	var key = $('input#search').val();
	if(key.length === 0){
		$('ul.live-search').css('display', 'none');
	}else{
		var settingGetward = {
			  "async": true,
			  "crossDomain": true,
			  "url": "/home/liveSearch",
			  "method": "POST",
			  "processData": true,
			  "data": {
			  	key : key
			  }
			};
	   $.ajax(settingGetward).done(function (response) {

		$('ul.live-search').css('display', 'block');
		$('ul.live-search').html('');
		for(let i = 0; i < response.length; i++){
			$('ul.live-search').append('<li><a href= "/products/'+response[i]._id.toString()+'">'+response[i].name+'</a></li>')
		}
		console.log(response);
		});
	}
	});
	
	// sub menu categories
	// $('li.categories').hover(function() {

	// 	$('ul.categories').css('display', 'block');
	// 	var settingGetCategories = {
	// 		  "async": true,
	// 		  "crossDomain": true,
	// 		  "url": "/home/liveGetCate",
	// 		  "method": "GET",
	// 		};
	//    $.ajax(settingGetCategories).done(function (response) {
	//    	$('ul.categories').html('');
	//    	for(let i = 0; i< response.length; i++){
	//    		$('ul.categories').append('<li><a href = "/categories/'+response[i].name+'">'+response[i].name+'</a></li>')
	//    	}
		
	// 	console.log(response);
	// 	});
	// }, function() {
	// 	$('ul.categories').css('display', 'none');
	// });


	// alert limit cart
	$('form#addCart').submit(function(event) {
		console.log('ok');

		var arrLocation = window.location.href.split('/');
		var idPr = arrLocation[arrLocation.length-1];
		
		var settingTestNumberPro = {
			  "async": true,
			  "crossDomain": true,
			  "url": "/home/liveTestCart",
			  "method": "GET",
			};
	   $.ajax(settingTestNumberPro).done(function (response) {

		var number = parseInt(response);
		if(number === 5){
			alert("Giỏ hàng không vượt quá 5 sản phẩm, đăng nhập để có thể mưa nhiều hơn");
		}
		console.log(response);
		});

	});
});


