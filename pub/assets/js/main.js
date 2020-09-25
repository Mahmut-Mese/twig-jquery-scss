$('.code').off('click').on('click', function(e) {

     $(".cart-coupon").slideToggle();
});

jQuery.expr[':'].regex = function(elem, index, match) {
     var matchParams = match[3].split(','),
         validLabels = /^(data|css):/,
         attr = {
              method: matchParams[0].match(validLabels) ?
                  matchParams[0].split(':')[0] : 'attr',
              property: matchParams.shift().replace(validLabels,'')
         },
         regexFlags = 'ig',
         regex = new RegExp(matchParams.join('').replace(/^\s+|\s+$/g,''), regexFlags);
     return regex.test(jQuery(elem)[attr.method](attr.property));
};


var keystr = [];
var citylist = [];
var second = '';
$('.page').bind('keyup', function (e) {
    if ($('.nice-select ').hasClass('open')) {
		e.preventDefault();
		e.stopImmediatePropagation();
		
        var $innerListItem = '';
        var $parentDiv = $('.nice-select ul.list');
        keystr.push(String.fromCharCode(e.which));
        $('.nice-select.open ul.list li').each(function () {
            if (e.which !== 0) {
                if (keystr[0] == $(this).text().charAt(0)) {
                    citylist.push($(this).text());
                    if (typeof keystr[1] === 'undefined') {
                        if (keystr[0].toLowerCase() == citylist[0].charAt(0).toLowerCase()) {
                            $innerListItem = $(this);
                            return false;
                        }
                    }
                    if (typeof keystr[1] !== 'undefined') {
                        for (var i = 1; i < citylist.length; i++) {
                            if (keystr[1].toLowerCase() == citylist[i].charAt(1).toLowerCase()) {
                                second = citylist[i];
                            }
                        }
                    }
                    if ($(this).text() == second) {
                         $innerListItem = $(this);
                        return false
                    }
                }
            }
            return $innerListItem
        });
        if ($innerListItem != '') {
            $parentDiv.scrollTop($parentDiv.scrollTop() + $innerListItem.position().top);
        }
    }
    setTimeout(function () {
        keystr = [];
        citylist = [];
        second = '';
        $innerListItem = '';
    }, 3000)
});

$('.page, header').on('click', function(e) {
    if(wordInString($(e.target).attr('class'), 'elmnt')||$(this).attr('class')=='page'||$(e.target).attr('class')=='') {
        $('#enhanced-search-result-form').remove();
        $('.commerce-autocomplete').val('');
    }
});

$('.commerce-sub-links li[data-selected-list="0"]>ul').each(function () {
$(this).attr('style', 'display: none !important');
});

var li=$('.selected-filter').parent();
li.parent().attr('style', 'display: block !important');


$('.input_ucfirst').on('keyup', function () {
    var value = $(this).val();
    $(this).val(capitalize(value));

});

const capitalize = (s) => {
    if (typeof s !== 'string') return '';
    return s.charAt(0).toUpperCase() + s.slice(1)
};

$('.alphabetic-list a').click(function () {
    var targetLetter = $(this).data('target');
    $('.alphabetic-list li a').removeClass('active');
    $(this).addClass('active');

    $('.single-letter-brand').addClass('hidden');
    $('.single-letter-brand[data-starting-letter="' + targetLetter + '"]').removeClass('hidden');
})

$('.show-all-brands').click(function () {
    $('.alphabetic-list li a').removeClass('active');
    $('.single-letter-brand').removeClass('hidden');
})

$(document).on('mouseenter', '.login.logged-in ', function (e) {
   // $('.logged-in li .login-register').trigger('click');
    $('.overlay3, .overlay4').addClass('show');
    $('.account-links').addClass('opn show');
    $('.logged-in').css('z-index','999')
 });
$(document).on('mouseleave', '.login.logged-in ', function (e) {
    // $('.logged-in li .login-register').trigger('click');
    $('.overlay3, .overlay4').removeClass('show');
    $('.account-links').removeClass('opn show');
    $('.logged-in').css('z-index','77')
});

$('.new-login ul li .account-links li').hover(function () {
    var str = $(this).find('.acoount-links-img img').attr('src');
    var res = str.charAt(str.length - 5);
    if (res == 's') {
        var text = str.replace('_s.svg', '_t.svg');

    } else {
        var text = str.replace('_t.svg', '_s.svg');

    }
    $(this).find('.acoount-links-img img').attr('src', text)
})


$(function () {
	window.sizeNotSelectedHightlight = true;

	$('.beden-box .input-radio').on('click', function () {
		if ($('body').hasClass('highlight-to-size-container')) {
			$('body').removeClass('highlight-to-size-container');
			$('#add2cart').trigger('click');
		}
	});

	$('input[name="sizeSelection"]').on('change', function () {
		if ($('body').hasClass('highlight-to-size-container')) {
			$('body').removeClass('highlight-to-size-container');
			$('#add2cart').trigger('click');
		}
	});
});