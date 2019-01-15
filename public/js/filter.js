$(document).ready(function($) {
  //ajax pagination
      var page = 1;
      var currentX = 0;
      var lastX = 0;

      $('a#paginationItem').click(function(event) {
        var category = $('input[name= "filter-cate"]:checked').val();
        var priceQuery = $('input[name = "filter-price"]:checked').val();
        var maxprice ;
        var minprice ;
        if(priceQuery !== undefined){
            var priceArr = priceQuery.split("AND");
            if(priceArr.length === 1)
              minprice = priceArr[0];
            else {
                minprice = priceArr[0];
                maxprice = priceArr[1];
            }
        }
        console.log(minprice, maxprice, category);
        var page = $(this).text();
        console.log(page);
        $('ul.pagination').find('li.active').removeClass('active');
        $(this).parent().addClass('active');
         var setting = {
            "async": true,
            "crossDomain": true,
            "url": "/products/page/"+page,
            "method": "POST",
            "processData": true,
            "data": {
                category : category,
                minprice : minprice,
                maxprice : maxprice,
             }
          };
             $.ajax(setting).done(function (response) {
               $('#filter-products').children().remove();
               $("HTML, BODY").animate({ scrollTop: 40 }, 1000);
               $('#filter-products').append(response);
               // $(window).scrollTop(0);
               
            });

      });
             
      $('input[name = "filter-cate"]').on('change', function(event){
         var queryPriceFilter = $('input[name="filter-price"]:checked').val();
            console.log($(this).val());
            console.log(priceArr);
            if(queryPriceFilter === undefined){
               $(location).attr('href', '/products?category='+$(this).val());
            }else {
                 var priceArr = queryPriceFilter.split('AND');
                 if(priceArr.length === 1){
                  $(location).attr('href', '/products?minprice='+priceArr[0]+'&category='+$(this).val());
                }else{
                    $(location).attr('href', '/products?minprice='+priceArr[0]+'&maxprice='+priceArr[1]+'&category='+$(this).val());
                }
            }

      })

      $('input[name = "filter-price"]').on('change', function(e){
            var queryCateFilter = $('input[name="filter-cate"]:checked').val();
            console.log($(this).val());
            var priceArr = $(this).val().split('AND');
            console.log(priceArr);
            if(queryCateFilter === undefined){
               if(priceArr.length === 1){
                  $(location).attr('href', '/products?minprice='+priceArr[0]);
                }else{
                    $(location).attr('href', '/products?minprice='+priceArr[0]+'&maxprice='+priceArr[1]);
                }
            }else {
                 if(priceArr.length === 1){
                  $(location).attr('href', '/products?minprice='+priceArr[0]+'&category='+queryCateFilter);
                }else{
                    $(location).attr('href', '/products?minprice='+priceArr[0]+'&maxprice='+priceArr[1]+'&category='+queryCateFilter);
                }
            }
      })

});
    
