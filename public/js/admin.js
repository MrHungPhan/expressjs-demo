$(document).ready(function($) {
    $('.navbar-toggle-sidebar').click(function () {
        $('.navbar-nav').toggleClass('slide-in');
        $('.side-body').toggleClass('body-slide-in');
        $('#search').removeClass('in').addClass('collapse').slideUp(200);
    });

    $('#search-trigger').click(function () {
        $('.navbar-nav').removeClass('slide-in');
        $('.side-body').removeClass('body-slide-in');
        $('.search-input').focus();
    });

   $(window).scroll(function(){
            var x = $(document.body).scrollTop();
            console.log(x);
        if(x > 0){
            $('nav.navbar.navbar-default.navbar-static-top').addClass('navbar-fixed-top');
        }
        else{
             $('nav.navbar.navbar-default.navbar-static-top').removeClass('navbar-fixed-top');
        }
   })

   $('ul.nav.navbar-nav li').click(function(event) {
       /* Act on the event */
       $('ul.nav.navbar-nav li').removeClass('active');
       $(this).addClass('active');
   });
});
    
