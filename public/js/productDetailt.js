$(function(){
	var x = $('.quantity-input input[type="number"]').val();
	console.log(x);
	$('button.btn.btn-default.btn-next').click(function(event) {
		if(x < 10)
			$('.quantity-input input[type="number"]').val(++x);
		return;
	});

	$('button.btn.btn-default.btn-prev').click(function(event) {
		/* Act on the event */
		if(x>1)
			$('.quantity-input input[type="number"]').val(--x);
		return
	});

	$('.support-des li').click(function(event) {

		$('.support-des li').removeClass('active');
		$(this).addClass('active');

		var x = $(this).index();
		x = x+ 1;
		$('ul.pr-description li').removeClass('append-class');
		$('ul.pr-description li:nth-child('+x+')').addClass('append-class');
	});
	console.log()


	for(var i = 2; i <= $('.pr-avatar img').length; i++){
		$('.pr-avatar img:nth-child('+i+')').addClass('img-child');
	}

	$('.pr-avatar img.img-child').click(function(event) {
		/* Act on the event */
		var imgSrcTg = $('.pr-avatar img:first-child').attr('src');
		$('.pr-avatar img:first-child').attr('src', $(this).attr('src'));
		$(this).attr('src', imgSrcTg);
	});

	
});