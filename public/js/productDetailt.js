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
});
