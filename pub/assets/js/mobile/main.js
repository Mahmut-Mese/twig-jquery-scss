$(".fancybox").fancybox({
    modal: true,
    helpers: {
        title: {
            type: 'outside'
        },
        overlay: {
            locked: false
        }
    }
});



$('.page .whitepage .form form .form-group ').click(function(){
    $(this).find( 'input').attr('placeholder','');
});

$("#deeplink #hide").click(function(){
     $('#deeplink').addClass('hidden');
     $('body').removeClass('deeplink-open');
     
     if (window.location.pathname=='/') {
         RG.General.setCookie("deeplink", 1, 0.333);
     }
    $('.search-top').css('margin-top','107px');
    $('.page .product-detail').css('margin-top','60px');
});
$("#deeplink #open").click(function(){
    var obj = $('#deeplink');

    if(navigator.userAgent.toLowerCase().indexOf("android") > -1){
        window.location.href = obj.data('deep-url');
        setTimeout(function() {
            window.location.href = obj.data('android-url');
        }, 100);
    }

    if(navigator.userAgent.toLowerCase().indexOf("iphone") > -1){
        window.location.href = obj.data('deep-url');
        setTimeout(function() {
            window.location.href = obj.data('ios-url');
        }, 100);
    }
})



function filt() {
    $(".widget_general_header,.search-top,.breadcrumb,.toggle-box,.gorunum").hide();
    $(".filter-box").addClass('modal-filter');


}
function subFilt() {

    $(".widget_general_header,.search-top,.breadcrumb,.toggle-box,.gorunum").show();
    $(".filter-box").removeClass('modal-filter');

}
$(".filter-box").off('click').on('click', '.form-group span', function() {

    $(this).parent().find('.all').toggleClass('hidden');
    $(this).toggleClass('open');

});

$(".submit").addClass("sticky");
$(".form-group input").on( "change keyup click", function() {
    $(this).closest(".page").find(".submit").removeClass("sticky");
});
$(".commerce-autocomplete").click(function () {
    $(".widget_general_header,footer, .card-banner, .chance-pro, .product-your, .widget_brands_brands_slider, .widget_general_spotlight,.product-detail, .widget_products_list, .widget_session_new_session, .widget_general_footer").hide();
    $(".widget_products_detail .search-top").addClass("detail-search");

    $(".search-top").addClass("modal-search");
    $(".widget_products_autocomplete").addClass("autocomp");
    $('.category-pro,.categories-all,.four-img').hide();
    $(".back-to").attr("onclick", "window.location.href='" + window.location.pathname + "'");
    $(".back-to").addClass('show');
    $(".whole-page").css('position', 'static');


});
$('.product-detail .pro-feature .detail').click(function () {
    var val = $(this).find('a').text()

    if (val == '') {
        $(this).find('a').text(this.cont);
    }
    else {
        this.cont = val;
        $(this).find('a').text('');
    }
});

$('#deeplink').click(function () {
    $('.whole-page').css('top', '');
});

function getViewportOffset($e) {
    var title = $('.title').offset();
    if(typeof title !== "undefined" ){
        title = parseInt(title.top, 10);
        var offset = $e.offset();
        offset = parseInt(offset.top, 10);
        var etop = offset - title;
        setTimeout(window.scrollTo(0, etop),100);
    }
}

$('form:not(.not-focus) input').not('[type=checkbox],[type=radio],.not-focus').click(function () {
    if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
        var $e=$(this);
        getViewportOffset($e)
    }
});



var observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
        if (mutation.attributeName === "class") {
            $('.overlay').toggleClass('show');
            $('.mm-menu_opened').siblings('.mm-page').css('position','relative');
            $('#hide').click();
        }
    });
});
var $div = $("#menu");
if($div[0]){
    observer.observe($div[0], {
        attributes: true
    });
}


$(function() {

    $('#menu').mmenu();
    $('.mh-head.first').mhead({
        scroll: false
    });
    $('.mh-head.second').mhead({
        scroll: {
            hide: 200
        }
    });
});
var mySwiper = new Swiper ('.product-session .swiper-container', {
    slidesPerView          : 1.5,
    slidesPerGroup         : 1,
    loop                   : true,
    loopFillGroupWithBlank : true,
    navigation             : { nextEl: '.swiper-button-next', prevEl : '.swiper-button-prev' }

});

$(function () {
	$('.msz-close').on('click', function (e) {
		e.preventDefault();

		$('body').removeClass('mobile-size-container-show');
	});
});
$('.alphabetic-list a').click(function () {
    let targetLetter = $(this).data('target');
    $('.alphabetic-list li a').removeClass('active');
    $(this).addClass('active');

    $('.single-letter-brand').addClass('hidden');
    $('.single-letter-brand[data-starting-letter="' + targetLetter + '"]').removeClass('hidden');
});

$('.show-all-brands').click(function () {
    $('.alphabetic-list li a').removeClass('active');
    $('.single-letter-brand').removeClass('hidden');
});
