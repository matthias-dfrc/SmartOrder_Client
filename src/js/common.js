$(document).ready(function(){
    // fullmenu
    $(".menu-open, .bg_full_m").click(function(){
        if($('.full_menu').is(':animated'))return false;
        if($('.full_menu').is(':visible')==true){
            $('.full_menu').animate({ "left": "-400px" }, 500 ,function(){
                $('.full_menu').hide();
            });
            $('.bg_full_m').fadeOut();
        }else{
            $('.full_menu').show();
            $('.full_menu').animate({ "left": "0" }, 500 );
            $('.bg_full_m').css('height',$(document).height()+'px').fadeIn();
        }
    });

});

