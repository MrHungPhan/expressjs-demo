window.onscroll = function(){ myFunction();}

function myFunction(){
	// if(document.body.scrollTop > 40 || document.documentElement.scrollTop > 50){
	// 	document.getElementsByClassName("nav.navbar.navbar-default").className = "navbar-fixed-top";
	// }
	var x = document.body.scrollTop;

	if (x > 40){
		document.querySelector("nav.navbar.navbar-default")
		.classList.add('navbar-fixed-top','menu-boxshadow');
	}
	else {
		document.querySelector("nav.navbar.navbar-default")
		.classList.remove('navbar-fixed-top','menu-boxshadow');
	}
}