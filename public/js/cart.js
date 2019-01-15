$(function($) {

  // change quantity
   $('input#quantity').click(function(event) {
    console.log(1);
    var input = event.target;
     var idPr = input.dataset.id;
     var idBill = input.dataset.billid;
      var quantity = parseFloat($(this).val());
     console.log(idPr, idBill);

      var settingGetPro = {
        "async": false, //important!!!
        "crossDomain": true,
        "url": "/home/liveGetPro",
        "method": "POST",
        "processData": true,
        "data": {
          idPr : idPr
        }
      };
     $.ajax(settingGetPro).done(function (response) {
      console.log(response);
      $('img.frm-ava').attr('src', response.avatar[0]);
      $('div.frm-name').text(response.name);
       $('input#quantityUpdate').attr('value',quantity.toFixed(1));
       $('span.unnitUpdate').text(response.unit);
    });

        // Update quantity
     $('button#btn-update').click(function(event) {
         var settingGetPro = {
          "async": true, //important!!!
          "crossDomain": true,
          "url": "/home/liveUpdateQuantity",
          "method": "POST",
          "processData": true,
          "data": {
            quantityUpdate : $('input#quantityUpdate').val(),
            idPr : idPr,
            idBill : idBill
          }
        };
       $.ajax(settingGetPro).done(function (response) {
        console.log(response);
        if(Array.isArray(response)){
          for(let i = 0; i< response[0].length; i+=2){
            if(response[0][i] === idPr){
              $('input[data-id ="'+idPr+'"]').val(parseFloat(response[0][i+1]).toFixed(1));
            }
          }
          $('h3.balance span').text(response[1]);
        }else {
          $('input[data-id ="'+idPr+'"]').val(parseFloat(response.proUpdate.quantity).toFixed(1));
          $('h3.balance span').text(response.total);
        }

        $('#exampleModalUpdate').modal("hide");
      });
     });
  
  });

   // delete orderDetail
    $('a.c-delete-product').click(function(event) {

      let idPr = $(this).parent().parent().attr("data-id");
      let idBill = $(this).parent().parent().attr("data-billid");
      console.log(idPr, idBill);

      $('#exampleModalDelete').modal("show");

      $('a#btn-delete').click(function(event) {
         var settingDelete = {
          "async": false, //important!!!
          "crossDomain": true,
          "url": "/cart/deleteOrderDetailt",
          "method": "POST",
          "processData": true,
          "data": {
            idPr : idPr,
            idBill : idBill
            }
          };
         $.ajax(settingDelete).done(function (response) {
          console.log(response);
            $('.cart-detailt[data-id = "'+idPr+'"]').remove();
            if(response.countCart === 0){
              $('.countCart').remove();
              $('.cart-title h3').text('Giỏ hàng của ban ( 0 sản phẩm )');
            }else {
             $('.countCart').text(response.countCart); 
             $('.cart-title h3').text('Giỏ hàng của bạn ( ' +response.countCart+' sản phẩm )');
            }
             if($('.cart-detailt').length === 0){
              $('.cart-bill').append('<p class = "cart-empty">Giỏ hàng trống. <a href = "/home">Tiếp tục mua sắm</a></p>');
              $('.cart-blance a.btn.btn-danger').attr('disabled', 'disabled');
            }

            $('h3.balance span').text(response.total);
            return;

        });

          $('#exampleModalDelete').modal("hide");

      });

  });

    //btn click thanh toan
   
   
});
    
