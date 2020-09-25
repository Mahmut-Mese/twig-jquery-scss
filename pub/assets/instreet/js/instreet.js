;(function ($) {
    $.fn.extend({
        resimatt: function () {
            var $this = $(this);
            $this.each(function () {
                var src = $(this).attr('src');
                var datasrc = $(this).data('src');
                if (typeof datasrc == 'undefined') {
                    datasrc = 'image';
                }
                var klas = $(this).attr('class');
                var alt = $(this).attr('alt');
                if (klas = 'undefined') {
                    klas = 'image';
                }

                $(this).wrapAll('<div class="resim-att"><div class="resim-att-pre"><div class="resim-thumb"><div class="resim-centered"></div></div></div></div>');
                // $(this).remove();
            });

        }
    });
})(jQuery);

function mobileMenuOpen(abc) {
    $('.site-head .mobile-btn button').addClass('open');
    $('body').css('overflow', 'hidden');
    $(abc).addClass('open');
    $('#panel').slideDown();
    $('.overlay').fadeIn();
    $(abc).attr({'onclick': 'javascript: mobileMenuClose(this)'});
}

function mobileMenuClose(abc) {
    $('.site-head .mobile-btn button').removeClass('open');
    $('body').css('overflow', 'auto');
    $('header ').animate({left: 0});
    $('#panel').slideUp();
    $('.overlay').fadeOut();
    $('.mobile-btn button').attr({'onclick': 'javascript: mobileMenuOpen(this)'});
}

function remove(rev) {
    $(rev).parent().parent().find('.loc').remove();
    $(rev).parent().parent().remove();
}

function removecard(rev) {
    $(rev).parent().parent().remove();
}


$(function () {
    var osofvisitor = navigator.platform.toLowerCase();
    if ((osofvisitor.indexOf("mac") > -1)) {
        $('body').addClass('mac');
        //do your thing here
    }

    $(".menu-button.login ul li > a").on('click', function () {
        $(this).parent().find('ul').slideToggle();
    });

    $('.slider-full .list').slick({
        lazyLoad: 'ondemand',
        slidesToShow: 1,
        autoplay: "true",
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        fade: true
    });

    $('.home-mark-list .list ul').slick({
        slide: "li",
        infinite: false,
        slidesToShow: 8,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        fade: false,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1
                }
            },
            {
                breakpoint: 1100,
                settings: {
                    slidesToShow: 6,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('.chance-pro .all .content').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: true,
        fade: true,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    fade: false,
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('.chance-pros .all .content').slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        responsive: [
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1
                }
            }
        ]
    });

    $('.slider-for').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false,
        fade: true,
        autoplay: true,
        asNavFor: '.slider-nav'
    });

    $('.slider-nav').slick({
        slidesToShow: 6,
        slideToScroll: 1,
        infinite: true,
        asNavFor: '.slider-for',
        dots: false,
        centerMode: true,
        vertical: true,
        autoplay: true,
        focusOnSelect: true
    });

    $('select').niceSelect();

    var zoomimgs = $('body').width();
    if (zoomimgs > 1200) {
        $(".detail-images .slider-for a").on("mouseover", function () {
            $('.zoomimages').stop().fadeIn(200);
        });
        $(".detail-images .slider-for a").on("mouseleave", function () {
            $('.zoomimages').stop().fadeOut(200);
        });
        $('.zoomimages').zoom();
    }

    $(".various").fancybox({
        maxWidth: 800,
        maxHeight: 600,
        fitToView: false,
        width: '70%',
        height: '70%',
        autoSize: false,
        closeClick: false,
        openEffect: 'none',
        closeEffect: 'none'
    });

    $("i.close").on('click', function () {
        $(this).parent().parent().parent().remove();
    });


    $("form").validationEngine();

    var sideul = $('.sidebar form .form-group ul li.head');
    sideul.on('click', function () {
        if ($(this).parent().hasClass('open')) {
            $(this).find('ul').slideUp();
            $(this).removeClass('open');
            $(this).removeClass('open');
        } else {
            sideul.find('ul').slideUp();
            sideul.removeClass('open');
            sideul.removeClass('open');
            $(this).addClass('open');
            $(this).addClass('open');
            $(this).find('ul').slideDown();
        }
    });

    $('a.res').on('click', function () {
        $(this).parent().parent().prev().focus();
        $(this).parent().parent().prev().addClass('focus');
        $(this).parent().find('.nice-select').addClass('focus');
    });

    /* $(".menulist li").on("mouseover", function () {
         $(this).find('.submenu').stop().fadeIn(200);
         $('.overlay').stop().fadeIn();
     });
     $(".menulist li").on("mouseleave", function () {
         $(this).find('.submenu').stop().fadeOut(200);
         $('.overlay').stop().fadeOut();
     });*/

     var basla_suresi = 0;
    $(".menulist li").on("mouseover", function () {
        var obj = $(this);
        basla_suresi = setTimeout(function () {
            $(obj).find('.submenu').stop().fadeIn(200);
            if ($(obj).find('.submenu').css('display') == 'block') {
                $('.overlay').stop().fadeIn();
            }
        }, 200);
    });

    $(".menulist li").on("mouseout", function () {
        clearTimeout(basla_suresi);
    });
    
    $(".menuslide > li").on("mouseleave", function () {
        $(this).find('.submenu').stop().fadeOut(200);
        $('.overlay').stop().fadeOut();
    });

    /*  $(".menulist .menuslide > li:first-child,.menulist .menuslide > li:nth-child(8)").on("mouseover", function () {
          $('.overlay').hide();
      });*/

    var label = $(' .sidebar form .form-group label');
    label.on('click', function () {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
            $(this).prev().removeClass('open');
        } else {
            label.parent().removeClass('open');
            label.prev().removeClass('open');
            $(this).addClass('open');
            $(this).prev().addClass('open');
        }
    });

    // $('.form-group span.open').next().fadeIn();
    // $('.form-group span.open').parent().find('.all').fadeIn();
    // $('.form-group ul li.open').find('ul').fadeIn();
    $('.phone').inputmask("(9999)999-99-99");
    $('.phones').inputmask("(999)999-99-99");
    $('.post-code').inputmask("99999-9999");
    $('.card-numbers').inputmask("9999 9999 9999 9999");
    $('.inputQuantity').inputmask("999");
    $(".tax-number").inputmask('', { regex: "[1-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]" });
    $('.iban-mask').inputmask('aa99 9999 9999 9999 9999 9999 99', {
        placeholder: '____ ____ ____ ____ ____ __'
    });

    // $('.checkbox').iCheck({checkboxClass:'icheckbox_square_gold',radioClass:'iradio_square_gold'});
    // $('.checkboxs').iCheck({checkboxClass:'icbtn',radioClass:'iradio_square_gold'});
    $('.checkboxa').iCheck({ checkboxClass: 'icbtn', radioClass: 'iradio_square_gold' });
    $('.checkboxab').iCheck({ checkboxClass: 'icbtn', radioClass: 'iradio_square_gold' });
    $('.checkboxabc').iCheck({ checkboxClass: 'icbtn', radioClass: 'iradio_square_gold' });

    var passa = $('.adres-hesap .form-group em');
    passa.on('click', function () {
        if ($(this).parent().hasClass('open')) {
            $(this).parent().removeClass('open');
            $(this).prev().removeClass('open');
            $(this).parent().find('input').focusin();
        } else {
            passa.parent().removeClass('open');
            passa.prev().removeClass('open');
            $(this).parent().addClass('open');
            $(this).prev().addClass('open');
            $(this).find('input').focusin();
        }
    });

    var pass = $('.pagecenter .form-group em');
    pass.on('click', function () {
        if ($(this).parent().hasClass('open')) {
            $(this).parent().removeClass('open');
            $(this).prev().removeClass('open');
            $(this).parent().find('input').focusin();
        } else {
            pass.parent().removeClass('open');
            pass.prev().removeClass('open');
            $(this).parent().addClass('open');
            $(this).prev().addClass('open');
            $(this).parent().find('input').focusin();
        }
    });

    $('.pagecenter .form-group input').focus(function () {
        $(this).parent().addClass('fcs');
        $(this).focusin();
    });

    // $('header .search form .form-group').focus(function () {
    //     // $(this).addClass('asd');
    //     // $(this).find('input').focus();
    // });
    // $('header .search form .form-group p').click(function () {
    //     // $(this).parent().addClass('asd');
    //     // $(this).parent().find('input').focus();
    // });
    // $('header .search form .form-group input').focus(function () {
    //     // $(this).parent().addClass('asd');
    //     // $(this).focus();
    // });

    $('.search-brand form .form-group').focusin(function () {
        $(this).addClass('asd');
    });

    $('.search-brand form .form-group p').click(function () {
        $(this).addClass('asd');
    });

    $('.search-brand form .form-group input').focusin(function () {
        $(this).parent().addClass('asd');
    });

    $('.adres-hesap .form-group input').focusin(function () {
        $(this).parent().addClass('fcs');
        $(this).focusin();
    });

    $('.resimatt').resimatt();

    /*$('.my-account-list input').on('focus', function() {
        // On first focus, check to see if we have the default text saved
        // If not, save current value to data()
        if (!$(this).data('defaultText')) $(this).data('defaultText', $(this).val());

        // check to see if the input currently equals the default before clearing it
        if ($(this).val()==$(this).data('defaultText')) $(this).val('');
    });*/
    $('.my-account-list input').on('blur', function () {
        // on blur, if there is no value, set the defaultText
        if ($(this).val() == '') $(this).val($(this).data('defaultText'));
    });

    /*$(".itemslist table tr td .text button").click(function () {
        $(this).parent().parent().parent().remove();
    });*/
    var bodyg = $('.overlay2');
    bodyg.on('click', function () {
        if (!$(this).parent().hasClass('open')) {
            $('.lab-list').slideUp();
            $(this).fadeOut();
        }
    });

    $("#city").on('change', function () {
        $("#form_store").submit();
    });
});
