function cookieClose() {
    $(".cookie-policy").hide();
}

$(".new-checkbox").click(function () {
    var item = $(this);
    var itemName = $('input[type=checkbox]', item).attr('name');
    if (itemName === 'uyelik_sozlesmesi' || itemName === 'subscribed_kvkk') {
        item = $('input[name=uyelik_sozlesmesi], input[name=subscribed_kvkk]').parent();
    }
    if (item.hasClass('checked')) {
        item.removeClass("checked")
        item.find('input[type=checkbox]').prop("checked", false);
    } else {
        item.addClass("checked")
        item.find('input[type=checkbox]').prop("checked", true);
    }
});

$(".new-radio.iradio_square_gold").click(function () {
    $(this).closest(".checkbox-group").find(".new-radio").removeClass('checked');
    if ($(this).find('input[type=radio]').prop("checked")) {
        $(this).addClass("checked")
    }
});

$(document.body).on('click', '.new-radio', function () {
    $(this).closest(".checkbox-group").find(".new-radio").removeClass('checked');
    if ($(this).find('input[type=radio]').prop("checked")) {
        $(this).addClass("checked")
    }
});
$(".new-checkbox.iread-payu").click(function () {

    if ($(this).hasClass("checked")) {
        if ($(".use-card-number").is(":hidden")) {
           // $(".basket-container").removeClass("disabled")
        } else {
           // requiredInput('.use-card-number .required')
        }
        $('.note-basket').fadeOut();
    } else {
      //  $(".basket-container").addClass("disabled")
    }
});
/*
$(".new-checkbox.iread-cash").click(function () {
    if ($(this).hasClass("checked")) {

        $(".basket-container").removeClass("disabled");
        $('.note-basket').fadeOut();

    } else {
        $(".basket-container").addClass("disabled")
    }
});*/
/*
$(".centersGiris .new-checkbox.iread").click(function () {
    if ($(this).hasClass("checked")) {
        customerRegisterInput();
    } else {
        $('.register-submit').addClass('disabled');
    }
});*/
var ins = false;
/*$('.customer-register-form .new-radio ins').click(function () {
    ins = true;
    customerRegisterInput();
})*/

function isValidEmailAddress(emailAddress) {
    var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
    return pattern.test(emailAddress);
}

var required_item;
var elem;

function requiredInput(e) {
    /*alert("dd");*/
    var is_empty;
    $('' + e + '').not(".hidden").find('input,textarea,.nice-select span.current').each(function () {
        elem = $(this);
        if (e == '.use-card-number .required') {
            changeCartInput(elem);

        } else {
            if ($(this).prop("tagName") == 'SPAN') {
                if ($(this).text() == '') {
                    is_empty = true;
                    required_item = $(this);
                    //$('.basket-container').addClass('disabled');
                }
            } else if ($(this).prop("tagName") == 'TEXTAREA') {
                if ($(this).val().length < 5 || $(this).val() == '') {
                    is_empty = true;
                    console.log($(this).val())
                    required_item = $(this);
                   // $('.basket-container').addClass('disabled');
                }
            } else {
                if ($(this).val() == "") {
                    is_empty = true;
                    required_item = $(this);
                    //$('.basket-container').addClass('disabled');
                }
            }
            if (!is_empty) {
                required_item = '';
               // $('.basket-container').removeClass('disabled');
            }
        }
    });

    return (is_empty, required_item);

};

function changeAddressInput() {
/*
    if ($('#ship_same').hasClass('checked')) {
      //  requiredInput('.ship-address .required');
    } else {
       // requiredInput('.form  .required');
    }
    if (required_item == '') {
    } else {
        if (window.location.pathname == '/checkout/address') {
            if ($('#selected-ship-address').siblings('.nice-select').find('.current').text() != '') {
               // $('.basket-container').removeClass('disabled');
            } else {
                if (required_item.prop("tagName") == 'SPAN') {
                    $('.missing-character').hide();

                    $('.note-basket-required .missing-field').text(required_item.parent().siblings('.required-em').text().toLowerCase());
                } else if (required_item.prop("tagName") == 'TEXTAREA') {
                    $('.missing-character').show();
                    $('.note-basket-required .missing-field').text(required_item.siblings('.required-em').text().toLowerCase());
                } else {
                    $('.missing-character').hide();
                    $('.note-basket-required .missing-field').text(required_item.siblings('.required-em').text().toLowerCase());
                }
            }

        }
    }*/
}

function changeCartInput(elem) {
    var is_empty;
    if ($('.iread-payu').hasClass('checked') && ($(".use-card-number").is(":visible"))) {

        if (elem.val() == "") {
            required_item = elem;
          //  $('.basket-container').addClass('disabled');
            $('.note-basket-required .missing-field').text(required_item.siblings().text());

        } else if (($(".card-numbers").val() != '') && ($(".inputQuantity").val() != '')) {

            var month = $(".month .current").text();
            var year = $(".year .current").text();
            if ($(".card-numbers").val().indexOf('_') != -1) {
                required_item = $(".card-numbers");
                $('.missing-character').show();
               // $(".basket-container").addClass("disabled")
                $('.note-basket-required .missing-field').text(required_item.siblings().text());

                return false;

            } else if ((!$.isNumeric(month)) || (!$.isNumeric(year))) {
                required_item = $(".month .current");
                $('.note-basket-required .missing-field').text(required_item.parent().siblings('em').text().toLowerCase());
               // $(".basket-container").addClass("disabled")

            } else if ($(".inputQuantity").val().indexOf('_') != -1) {
                required_item = $(".inputQuantity");
                $('.missing-character').show();
               // $(".basket-container").addClass("disabled")
                $('.note-basket-required .missing-field').text(required_item.siblings().text());


            } else {
              //  $(".basket-container").removeClass("disabled")

            }
        }


    }
}

function formAdressEditInput() {
   // requiredInput('.form-address-edit .required')

    if (required_item == '') {

        if ($(".phones").val().indexOf('_') != -1) {
            is_empty = true;
            required_item = $(this);
            $('.actions-toolbar').addClass('disabled');
        } else {
            $('.actions-toolbar').removeClass('disabled');
        }

    } else {
        $('.actions-toolbar').addClass('disabled');

    }
}

function customerRegisterInput() {
    if ($('.iread').hasClass('checked')) {
        $('.aggrement').removeClass('show');
       // requiredInput('.customer-register-form .required')
        if (required_item == '') {

            if ($(".phones").val().indexOf('_') != -1) {

                is_empty = true;
                required_item = $(this);
                $('.register-submit').addClass('disabled');
            } else if (!isValidEmailAddress($('.customer-email').val())) {

                $('.register-submit').addClass('disabled');
            } else {

                if (ins) {
                    $('.gender-radio').removeClass('show')
                    $('.register-submit').removeClass('disabled');
                } else {
                    $('.gender-radio').addClass('show')
                }
            }
        } else {
            $('.register-submit').addClass('disabled');
        }
    } else {
        $('.register-submit').addClass('disabled');

    }
}
function taxNumberCheck(field, rules, i, options){

    var field_name = $(field).attr('name');
    var tax_office = "";
    if(field_name == 'tax_number'){
        tax_office = $("input[name='tax_office']").val();
    }else if(field_name == 'shipping_address[tax_number]'){
        tax_office = $("input[name='shipping_address[tax_office]']").val();
    }else if(field_name == 'billing_address[tax_number]'){
        tax_office = $("input[name='billing_address[tax_office]']").val();
    }
    var tax_number = $(field).val();

    if(tax_number == "" && tax_office != ""){
        rules.push('required');
        return "* Vergi dairesi girilmiş ise Vergi/TC Kimlik Numarası boş geçilemez.";
    }else if(tax_number != ""){
        var re = new RegExp('_', 'g');
        var say = tax_number.replace(re, '').length;
        if(say == 10){
            // vergi numarası dogrulama
            if(vergiNoDogrulama(tax_number) == false){
                rules.push('required');
                return "* Vergi/TC Kimlik Numarası doğrulanamadı.";
            }
        }else if(say == 11){
            // kimlik numarası dogrulama
            if(tcKimlikDogrulama(tax_number) == false){
                rules.push('required');
                return "* Vergi/TC Kimlik Numarası doğrulanamadı.";
            }
        }else{
            rules.push('required');
            return "* Vergi/TC Kimlik Numarası doğrulanamadı.";
        }
    }
}
function taxOfficeCheck(field, rules, i, options){
    var field_name = $(field).attr('name');
    var tax_number = "";

    if(field_name == 'tax_office'){
        tax_number = $("input[name='tax_number']").val();
    }else if(field_name == 'shipping_address[tax_office]'){
        tax_number = $("input[name='shipping_address[tax_number]']").val();
    }else if(field_name =='billing_address[tax_office]'){
        tax_number = $("input[name='billing_address[tax_number]']").val();
    }

    if($(field).val() == "" && tax_number != ""){
        rules.push('required');
        return "* Vergi/TC Kimlik Numarası girilmiş ise vergi dairesi boş geçilemez.";
    }
}
function vergiNoDogrulama(kno) {
    kno = kno.replace("_","",kno);
    var v1 = 0;
    var v2 = 0;
    var v3 = 0;
    var v4 = 0;
    var v5 = 0;
    var v6 = 0;
    var v7 = 0;
    var v8 = 0;
    var v9 = 0;
    var v11 = 0;
    var v22 = 0;
    var v33 = 0;
    var v44 = 0;
    var v55 = 0;
    var v66 = 0;
    var v77 = 0;
    var v88 = 0;
    var v99 = 0;
    var v_last_digit = 0;
    var toplam = 0;

    var desen = /[0-9]{10}/;

    if (kno.length == 10) {

        v1 = (Number(kno.charAt(0)) + 9) % 10;

        v2 = (Number(kno.charAt(1)) + 8) % 10;

        v3 = (Number(kno.charAt(2)) + 7) % 10;

        v4 = (Number(kno.charAt(3)) + 6) % 10;

        v5 = (Number(kno.charAt(4)) + 5) % 10;

        v6 = (Number(kno.charAt(5)) + 4) % 10;
        v7 = (Number(kno.charAt(6)) + 3) % 10;
        v8 = (Number(kno.charAt(7)) + 2) % 10;
        v9 = (Number(kno.charAt(8)) + 1) % 10;
        v_last_digit = Number(kno.charAt(9));

        v11 = (v1 * 512) % 9;
        v22 = (v2 * 256) % 9;
        v33 = (v3 * 128) % 9;
        v44 = (v4 * 64) % 9;
        v55 = (v5 * 32) % 9;
        v66 = (v6 * 16) % 9;
        v77 = (v7 * 8) % 9;
        v88 = (v8 * 4) % 9;
        v99 = (v9 * 2) % 9;

        if (v1 != 0 && v11 == 0) v11 = 9;
        if (v2 != 0 && v22 == 0) v22 = 9;
        if (v3 != 0 && v33 == 0) v33 = 9;
        if (v4 != 0 && v44 == 0) v44 = 9;
        if (v5 != 0 && v55 == 0) v55 = 9;
        if (v6 != 0 && v66 == 0) v66 = 9;
        if (v7 != 0 && v77 == 0) v77 = 9;
        if (v8 != 0 && v88 == 0) v88 = 9;
        if (v9 != 0 && v99 == 0) v99 = 9;
        toplam = v11 + v22 + v33 + v44 + v55 + v66 + v77 + v88 + v99;


        if (toplam % 10 == 0) toplam = 0;
        else toplam = (10 - (toplam % 10));

        if (toplam == v_last_digit) {


            return true;
        } else return false;

    } else return false;

}

function tcKimlikDogrulama(parTC) {
    var desen_tc = /^[0-9]{11}$/;
    var blnSonuc = true;
    var strTC = String(parTC);
    if (desen_tc.test(strTC) == false) {
        blnSonuc = false;
    }
    int1 = parseInt(strTC.substr(0, 1));
    int2 = parseInt(strTC.substr(1, 1));
    int3 = parseInt(strTC.substr(2, 1));
    int4 = parseInt(strTC.substr(3, 1));
    int5 = parseInt(strTC.substr(4, 1));
    int6 = parseInt(strTC.substr(5, 1));
    int7 = parseInt(strTC.substr(6, 1));
    int8 = parseInt(strTC.substr(7, 1));
    int9 = parseInt(strTC.substr(8, 1));
    int10 = parseInt(strTC.substr(9, 1));
    int11 = parseInt(strTC.substr(10, 1));

    if ((int1 + int3 + int5 + int7 + int9 + int2 + int4 + int6 + int8 + int10) % 10 != int11)
    {
        blnSonuc = false;
    }
    if (((int1 + int3 + int5 + int7 + int9) * 7 + (int2 + int4 + int6 + int8) * 9) % 10 != int10)
    {
        blnSonuc = false;
    }
    if (((int1 + int3 + int5 + int7 + int9) * 8) % 10 != int11)
    {
        blnSonuc = false;
    }
    return blnSonuc;
}
function maskCaracter(field, rules, i, options){
    var value = $(field).val().trim();
    var re = value.substr(0,1);
    if(re == 'Ğ' || re == 'ğ'){
        rules.push('required');
        return 'Ğ ile başlayamaz';
    }
}
function characterSpace(field, rules, i, options){
    var res = $(field).val().split(" ");
    for (var i = 0; i < res.length; i++) {
        if (res[i].length == 1) {
            var geri = i - 1;
            var ileri = i + 1;
            if (typeof res[ileri] !== "undefined" && typeof res[geri] !== "undefined") {
                if (res[geri].length == 1 || res[ileri].length == 1) {
                    rules.push('required');
                    return '* Harfler arasında boşluk olamaz';
                }
            }
        }
    }
}
function characterTurkish(field, rules, i, options){
    var res = $(field).val();

    var regex = /[ğüşöçİĞÜŞÖÇ]/g;
    var found = res.match(regex);

    if(found != '' && found != null){
        if(res != '' && found.length > 0){
            rules.push('required');
            return '* Türkçe karakter kullanılamaz';
        }
    }

}
function characterUclu(field, rules, i, options){
    /**
     * uc tane yan yana ayni karakter geldiginde calisir
     * @type {jQuery}
     */
    var res = turkishToUpper($(field).val()).split("");
    for (var i = 0; i < res.length; i++) {
        var geri = i - 1;
        var ileri = i + 1;
        if (typeof res[ileri] !== "undefined" && typeof res[geri] !== "undefined") {
            if (res[geri] == res[i] && res[geri] == res[ileri] && res[ileri] == res[i]) {
                rules.push('required');
                return '* 3 tane yan yana aynı karakter girilemez.';
            }
        }
    }
}
function ibanCheck(field, rules, i, options){
    var res = $(field).val();

    var regex = /[^A-Za-z0-9]+/g;
    res = res.replace(regex, '');
    if(res.length < 1){
        return true;
    }
    if(isValidIBANNumber(res)){
        return true;
    }else{
        rules.push('required');
        return '* Iban numarası doğrulanamadı';
    }
    console.log(isValidIBANNumber(res));

    var regex = /[ğüşöçİĞÜŞÖÇ]/g;
    var found = res.match(regex);

    if(found != '' && found != null){
        if(res != '' && found.length > 0){
            rules.push('required');
            return '* Türkçe karakter kullanılamaz';
        }
    }

}
function isValidIBANNumber(input) {
    var CODE_LENGTHS = {
        AD: 24, AE: 23, AT: 20, AZ: 28, BA: 20, BE: 16, BG: 22, BH: 22, BR: 29,
        CH: 21, CR: 21, CY: 28, CZ: 24, DE: 22, DK: 18, DO: 28, EE: 20, ES: 24,
        FI: 18, FO: 18, FR: 27, GB: 22, GI: 23, GL: 18, GR: 27, GT: 28, HR: 21,
        HU: 28, IE: 22, IL: 23, IS: 26, IT: 27, JO: 30, KW: 30, KZ: 20, LB: 28,
        LI: 21, LT: 20, LU: 20, LV: 21, MC: 27, MD: 24, ME: 22, MK: 19, MR: 27,
        MT: 31, MU: 30, NL: 18, NO: 15, PK: 24, PL: 28, PS: 29, PT: 25, QA: 29,
        RO: 24, RS: 22, SA: 24, SE: 24, SI: 19, SK: 24, SM: 27, TN: 24, TR: 26
    };
    var iban = String(input).toUpperCase().replace(/[^A-Z0-9]/g, ''), // keep only alphanumeric characters
        code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/), // match and capture (1) the country code, (2) the check digits, and (3) the rest
        digits;
    // check syntax and length
    if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
        return false;
    }
    // rearrange country code and check digits, and convert chars to ints
    digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, function (letter) {
        return letter.charCodeAt(0) - 55;
    });
    // final check
    return mod97(digits);
}
function mod97(string) {
    var checksum = string.slice(0, 2), fragment;
    for (var offset = 2; offset < string.length; offset += 7) {
        fragment = String(checksum) + string.substring(offset, offset + 7);
        checksum = parseInt(fragment, 10) % 97;
    }
    return checksum;
}
function turkishToUpper(string){
    var letters = { "i": "İ", "ş": "Ş", "ğ": "Ğ", "ü": "Ü", "ö": "Ö", "ç": "Ç", "ı": "I" };
    string = string.replace(/(([iışğüçö]))/g, function(letter){ return letters[letter]; })
    return string.toUpperCase();
}
function h1_func(){

}

$("body").on('DOMSubtreeModified', "span.current", function () {

    if ($(location).attr('pathname') == "/checkout/address/new" ||
        $(location).attr('pathname') == "/checkout/address/edit" ||
        $(location).attr('pathname') == "/customer/address/new" ||
        $(location).attr('pathname') == "/customer/address/edit") {

/*
        if ($(this).parent().siblings('select').attr('id') == 'region_') {


            $('.actions-toolbar').addClass('disabled');
        } else {
            formAdressEditInput();
        }*/
    } else if ($(location).attr('pathname') == "/checkout/address") {
        $('.note-basket').fadeOut();
        $('.note-basket-required').fadeOut();

        if ($(this).parent().siblings('select').attr('id') == 'region_shipping_address') {
          //  $('.basket-container').addClass('disabled');
        } else {
            //changeAddressInput();
        }
    } else if ($(location).attr('pathname') == "/checkout/payment") {
        $('.note-basket-required').fadeOut();

        //requiredInput('.use-card-number .required')


    }

});
/*
$(".customer-register-form .required input,.customer-register-form .iread").on("change keyup click", function (event) {
    customerRegisterInput();
});*/
$(".widget_checkout_address .required input,.widget_checkout_address .required textarea,#ship_same").on("change keyup click", function () {
    $('.note-basket-required').fadeOut();
    changeAddressInput();
});
$(".checkout-payment .use-card-number .required input,.checkout-payment .use-card-number .required textarea,.widget_checkout_address .current").on("change keyup click", function () {
    $('.note-basket-required').fadeOut();

   // requiredInput('.use-card-number .required')
});

$(function () {
	$(".checkout-payment .basket-button .linkto a").text(RG.Translate.get('Ödeme Yap'));
	$(".widget_checkout_signin").closest(".basket-page").find(".basket-button").hide();
});

$(".page .product-list .sidebar .form .form-group ul li").click(function () {
    if ($(this).find("span").hasClass("open")) {

        $(this).find(":before").hide();
    } else {
        $(this).find(":before").show();

    }
});

$('.menu-drop ul li a').on('click', function () {
    $('.menu-drop').css('z-index', '999');

    var clckClasses = $(this).closest('.menu-drop').attr('class').split(' ')[0];
    if ($('.' + clckClasses + '').find('ul li ul').hasClass('opn') || $('.' + clckClasses + '').find('ul li ul .widget_basket_mini_cart div').hasClass('not-count')) {
        $('.overlay3 , .overlay4').removeClass('show');
        $('.' + clckClasses + '').find('ul li ul').removeClass('opn');
    } else {
        $('.overlay3 , .overlay4').addClass('show');
        $('.' + clckClasses + '').find('ul li ul').addClass('opn');
    }
    $('.top').find('.menu-drop').each(function () {
        $('.menu-drop').not('.' + clckClasses + '').find('ul li ul').removeClass('opn');
        $('.menu-drop').not('.' + clckClasses + '').find('ul li ul').fadeOut();
    });
});

$('.overlay4').click(function (e) {
    $('.overlay3 , .overlay4').toggleClass('show');
    if (!($(e.target).is('#login-register') || $(e.target).is('#lgn') || $(e.target).is('#lgn-img'))) {
        $('.top').find('.menu-drop').each(function () {
            $('.menu-drop ul li ul').removeClass('opn');
            $('.menu-drop ul li ul').fadeOut();
        });
    }

});
$('.menuslide > li a').hover(function (e) {
    $('.menu-drop ul li ul').removeClass('opn');
    $('.menu-drop').css('z-index', '77');
    $('.overlay3 , .overlay4').removeClass('show');
    $('.menu-drop ul li ul').fadeOut();
});
var elem3 = $(".overlay-desc h2");
elem3.addClass("fadeInDown");

var elem4 = $(".overlay-de  sc h1");
if (elem4.length) {
    setTimeout(function () {
        elem4.addClass("fadeInDown");
    }, 1000);
}

$(".four-img .back-img").mouseenter(function () {
    $(this).children('.filter-img').css("visibility", "visible");
});

$(".four-img .back-img").mouseleave(function () {
    $(this).children('.filter-img').css("visibility", "hidden");
});

$(window).scroll(function () {
    var scroll = $(window).scrollTop();
    var fixwidth = $('body').width();

    if (fixwidth > 1200) {
        if (scroll >= 50) {
            $("header").addClass("mini");
        } else {
            $("header").removeClass("mini");
        }
    } else {

    }

    var top_to = 600;
    if ($(this).scrollTop() > top_to) {
        $('.top-to').fadeIn();
    } else {
        $('.top-to').fadeOut();
    }
});

$('.top-to').click(function () {
    $('html, body').animate({scrollTop: 0}, 1000);
});

$('.widget_basket_sidebar').on('click', '.new-select', function () {
    $('.cart-coupon').toggleClass('show');
});

$('.basket-page .option').closest('.page').click(function (e) {
    if (!$(e.target).hasClass('option')) {
        if ($('.qty-select').hasClass('open')) {
            $('.qty-select').removeClass('open');
            $('.qty-select .list .option').removeClass('list-item');
        }
    }
})
$('.mobile-faq .main-container').hide();
$('.main-content .fa-chevron-left').click(function () {
    $('.left-menu').show();
    $('.mobile-faq .main-container').hide();


})
$('.card').off('click').on('click', function () {
    $('.card').not(this).find('.collapse').fadeOut();
    $('.card').not(this).find('a').removeClass('active');
    $(this).find('a').toggleClass('active');
    $(this).find('.collapse').fadeToggle();
})
$('.left-menu li a').off('click').on('click', function () {
    $('.mobile-faq .left-menu').hide();

    $('.left-menu li a').removeClass('active');
    var subj_id = $(this).data('subject-id');
    $(this).addClass('active');

    $('.main-container').each(function () {
        $(this).fadeOut();
        $(this).removeClass('active');
        if ($(this).data('subject-id') == subj_id) {
            $(this).fadeIn();
            $(this).find('.main-content .card').first().find('a').addClass('active');
            $(this).find('.main-content .card').first().find('.collapse').fadeIn();
            $(this).addClass('active');
        }
    })
});
/*$('.category-box a').click(function () {
    var quest_id = $(this).data('question-id');
    var subj_id = $(this).data('subject-id');
    $('.left-menu li a').each(function () {
        $(this).removeClass('active');

        if ($(this).data('subject-id') == subj_id) {
            $(this).addClass('active');

        }
    })
    $('.main-container').each(function () {
        $(this).fadeOut();
        $(this).removeClass('active');

        if ($(this).data('subject-id') == subj_id) {
            $(this).fadeIn();
            $(this).parent().find('.collapse').fadeOut();
            $(this).find('.main-content .card').find('a').removeClass('active');
            $(this).find('.main-content .card').first().find('a').addClass('active');
            $(this).find('.main-content .card').first().find('.collapse').fadeIn();
            $(this).addClass('active');
            if (quest_id) {
                $(this).find('.card a').each(function () {
                    $(this).parent().find('.collapse').fadeOut();
                    $(this).removeClass('active');
                    if ($(this).data('question-id') == quest_id) {
                        $(this).parent().find('.collapse').fadeIn();
                        $(this).addClass('active');

                    }
                })
            }
        }
    })
});*/

var pushStateArr = window.location.href.split('?');
var pushState = '';
if (pushStateArr[1]) pushState = pushStateArr[1];


if (!wordInString(pushStateArr[1], 'min')) $('.min-val').addClass('show');
if (!wordInString(pushStateArr[1], 'max')) $('.max-val').addClass('show');
if (!wordInString(pushStateArr[0], 'search')) $('.page').removeClass('long-header');

$(document.body).on('click', '.max .val', function () {
    $(this).siblings('input').val('')
    $(this).siblings('input').focus();
    $(this).removeClass('show')
});

$(document.body).on('click', '.clearfilt', function () {
    var pushStateArr = window.location.href.split('?');
    history.pushState('', '', pushStateArr[0]);
    window.location.href = pushStateArr[0];
});


$(function () {
    if ($.cookie('is_logged_in') == null || $.cookie('is_logged_in') == '0') {
        $('.logged-in').addClass('hide');
        $('.logged-out').removeClass('hide');
    }
    else {
        $('.logged-in').removeClass('hide');
        $('.logged-out').addClass('hide');
    }

    $('.mobile-menu .name,#full-name-login').text($.cookie('full_name'));
    var length = 14;

    var text = document.getElementById('full-name-login')
    if (text != null) {
        var string = text.innerHTML
        var trimmedString = string.length > length ?
            string.substring(0, length - 1) + "..." :
            string

        text.innerHTML = trimmedString
    }
});


$(document)
    .on('wishlist.add', function (e, data) {
        if (data.$el.html()) {
            data.$el.html(RG.Translate.get('Favorilerimden Çıkar'));
        }

        $('#faveklePopupTrigger').trigger('click')
    })
    .on('wishlist.remove', function (e, data) {
        if (data.$el.html()) {
            data.$el.html(RG.Translate.get('Favorilerime Ekle')); 
        }
    });

$(function () {
	if (!window.disableWishlistAddedProductsControl) {
		$('.add-wishlist').each(function () {
			var $self = $(this);
	
			if ($self.parent().hasClass('open') && $self.html()) {
				if($self.hasClass('add-to-favourites-button')) {
					$self.find('i').addClass('svg-favourited svg-favourited-dims');
				} else {
					$self.html(RG.Translate.get('Favorilerimden Çıkar'));
				}
			}
		});
	}
});

$(document)
    .on('wishlist-icon.add', function (e, data) {
        if (data.$el.html()) {
            data.$el.html(RG.Translate.get('Favorilerimden Çıkar'));
        }

        $('#faveklePopupTrigger').trigger('click')
    })
    .on('wishlist-icon.remove', function (e, data) {
        if (data.$el.html()) {
            data.$el.html(RG.Translate.get('Favorilerime Ekle'));
        }
    });

$(function () {
    $('.wishlist-icon').each(function () {
        var $self = $(this);

        if ($self.parent().hasClass('open') && $self.html()) {
            if($self.hasClass('add-to-favourites-button')) {
                $self.find('i').addClass('svg-favourited svg-favourited-dims');
            } else {
                $self.html(RG.Translate.get('Favorilerimden Çıkar'));
            }
        }
    });
});
function queryStringToJSON(queryString) {
    if (queryString.indexOf('?') > -1) {
        queryString = queryString.split('?')[1];
    }
    var pairs = queryString.split('&');
    var result = {};
    pairs.forEach(function (pair) {
        pair = pair.split('=');
        result[pair[0]] = decodeURIComponent(pair[1] || '');
    });
     return result;
}

$(document).on('click', '.btn-percent-filter-submit, .btn-price-filter-submit', function (e) {
    e.preventDefault();
    var queryStringsObj = queryStringToJSON(window.location.search || '');
    var $self = $(this);

    if ($self.hasClass('btn-percent-filter-submit')) { // percent submit buton
        var minMaxPrice = RG.CategoryFilters.percentPriceFindMinMax();
        queryStringsObj['percent_min'] = minMaxPrice[0];
        queryStringsObj['percent_max'] = minMaxPrice[1];
        var pushStateNew = 'percent_min=' + minMaxPrice[0] + "&" + 'percent_max=' + minMaxPrice[1];
    } else if ($self.hasClass('btn-price-filter-submit')) {
        var minMaxPrice = RG.CategoryFilters.priceFindMinMax();
        queryStringsObj['min'] = minMaxPrice[0];
        queryStringsObj['max'] = minMaxPrice[1];
        var pushStateNew = 'min=' + minMaxPrice[0] + "&" + 'max=' + minMaxPrice[1];
    }

    if (window.location.href.indexOf('?') > -1) {
        RG.CategoryFilters.pushState(window.location.pathname + '?' + $.param(queryStringsObj));
    } else {
         RG.CategoryFilters.pushState(window.location.pathname + '?' + pushStateNew);
    }

    RG.CategoryFilters.refresh();
});

$(document).on('keyup', 'input[name="min"], input[name="max"], input[name="percent_min"], input[name="percent_max"]', function (e) {
	if (e.which === 13) {
		$(this).parent().find('button').trigger('click');
	}
});

$(function () {
    var tab = RG.General.queryString('tab');
     if(tab!=null){
        if (tab == 'iade')  var subject = "3";
        if (tab == 'uyelik')var  subject = "4";
        $('.main-container[data-subject-id="1"]').css('display', 'none');
        $('.main-container[data-subject-id=' + subject + ']').css('display', 'block')
    }
});
var timer2 = "2:00";
var interval = setInterval(function() {

    var timer = timer2.split(':');
    var minutes = parseInt(timer[0], 10);
    var seconds = parseInt(timer[1], 10);
    --seconds;
    minutes = (seconds < 0) ? --minutes : minutes;
    if (minutes < 0) {
        clearInterval(interval);
        $('.countdown .count').addClass('finished');
    }
    seconds = (seconds < 0) ? 59 : seconds;
    seconds = (seconds < 10) ? '0' + seconds : seconds;
    $('.countdown .count').html(minutes + ':' + seconds);
    timer2 = minutes + ':' + seconds;
}, 1000);


$(function () {
	var $coupons = $('.cm-set-coupon');
	if ($coupons.length) {
		$coupons.on('click', function (e) {
			e.preventDefault();

			var $self = $(this);
			var rule = $self.data('rule');
			var isPercent = Number($self.data('ispercent'));
			var price = $self.data('price');
			var description = $self.data('description');

			var $couponModal = $('#cmSelectCoupon');
			
			if (isPercent) {
				$couponModal.find('h2').html('<span class="price">' + price + '</span> İNDİRİM');
			} else {
				$couponModal.find('h2').html('<span class="price">'+ price +'</span>' + ' TL HEDİYE ÇEKİ');
			}

			$couponModal.find('h4').html(description);
			$couponModal.modal('show');

			$couponModal.find('.cm-appyl-coupon-code').data('rule', rule)
				.off('click')
				.on('click', function (e) {
					e.preventDefault();

					if (!$.cookie('is_logged_in')) {
						var loginBtn = $('.customer-login');

						if (!loginBtn.length) {
							window.location.href = '/customer/login';
						} else {
							loginBtn.trigger('click');
						}
						return;
					}
					
					$.post('/ajax/customer/setCustomerCoupons', {
						rule_id: rule,
					}, function (response) {
						if (!response.success) {
							var $modal = $('#cmErrorModal');
							
							$modal.find('.modal-body h4').html(response.message);
							$modal.modal('show');
							return;
						}

						window.location.reload();
					});
				});
		});
	}
});
function copyStringToClipboard1 (str) {
    // Create new element
    var el = document.createElement('textarea');
    // Set value (string to be copied)
    el.value = str;
    // Set non-editable to avoid focus and move outside of view
    el.setAttribute('readonly', '');
    el.style = {position: 'absolute', left: '-9999px'};
    document.body.appendChild(el);
    // Select text inside element
    el.select();
    // Copy text to clipboard
    document.execCommand('copy');
    // Remove temporary element
    document.body.removeChild(el);
}
$('.copy-code').click(function () {

    var code = $(this).closest('.coupon-box').find('.coupon-code').text();
    console.log(code)
    copyStringToClipboard1(code);
    new Noty({
        text: '<i class="fa fa-clone mr-2"></i> Kupon kodu kopyalandı.',
        layout: 'bottomRight',
        timeout: 1000
    }).show();

});
$(function () {
    $('.bill-type  .new-radio input ').on('click',function () {
        var billTypeName=$(this).attr('name');
        if(billTypeName=='organizational'){
            $('.organizational').removeClass('hide');
        }else{
            $('.organizational').addClass('hide');

        }
	});

	var $body = $('body');
	$(document).on('click', function (e) {
		if ($body.hasClass('highlight-to-size-container') && (e.target === document.body)) {
			$body.removeClass('highlight-to-size-container');
		}
	});


	$.fn.extend({
		toggleText: function(a, b){
			return this.text(this.text() == b ? a : b);
		},
	});

	$('.footer-content-flo .read-more').click(function () {
		$('.footer-content-flo').toggleClass('expanded');
		$('.footer-content-flo .read-more span').toggleText('DEVAMI', 'KAPAT');
	});
});