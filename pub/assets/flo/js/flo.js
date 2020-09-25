String.prototype.toCamelCase = function() {
    return this.replace(/^([A-Z])|\s(\w)/g, function(match, p1, p2, offset) {
        if (p2) return p2.toUpperCase();
        return p1.toLowerCase();
    });
};
$.validator.addMethod(
    "maskCharacter",
    function(value, element) {
        var value = value.trim();
        var re = value.substr(0,1);
        if(re == 'Ğ' || re == 'ğ'){
            return false;
        }
        return true;
    },
    "Yazım Hatası: Ğ ile başlayamaz"
);
$.validator.addMethod(
    "characterSpace",
    function(value, element) {
        var res = value.split(" ");
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            if (res[i].length == 1) {
                var geri = i - 1;
                var ileri = i + 1;
                if (typeof res[ileri] !== "undefined" && typeof res[geri] !== "undefined") {
                    if (res[geri].length == 1 || res[ileri].length == 1) {
                        return false;
                    }
                }
            }
        }
        return true;
    },
    "Harfler arasında boşluk olamaz"
);

$(function () {
    var isMobile = $('.mobile-menu').length;
	var $body = $('body');

	$('.nonregister-next-step-button').off('click').click(function () {
		$(".nonregister-form").valid();
	});
    $('.card').off('click');
    $('header .search-form input').off('blur keyup');

    $(document).on('click', '.label-link', function (e) {
        var $self = $(this);
        var href = $self.attr('href');

        if (!href) { return; }

        return window.location.href = href;
    });

    var initSlimScroll = function () {
        $('.size-list, .color-choices, .brand-list').each(function () {
            var $self = $(this);

            if ($self.height() < 210) { return; }

            $self.slimScroll({
                height: '210px',
                size: '6px',
                alwaysVisible: true,
                railVisible: true,
                wheelStep: 50,
                railColor: '#f8f8f8',
                color: '#f58426',
                borderRadius: 0,
                railOpacity: 1,
                opacity: 1
            });
        })
    }

    var initToggleClickAction = function () {
        $('.category_filters a[data-toggle="collapse"]').on('click', function () {
            var $self = $(this);
            var isShow = $self.next('.collapse').hasClass('show');

            if (isShow) {
                $self.closest('.card').removeClass('active');
            } else {
                $self.closest('.card').addClass('active');
            }
        });
	};
	
	var initCollapse = function () {
		$('.category_filters .collapse').off('show.bs.collapse').on('shown.bs.collapse', function () {
			initSlimScroll();
		});
	}

    $(document).on('product.list.dom.change', function () {
        initToggleClickAction();
		initSlimScroll();
		initCollapse();
	});

	$('.filter-form form > .card > .btn-link').off('click');

	initCollapse();
    initToggleClickAction();
    initSlimScroll();

    $('.flo-checkbox input').on('change', function () {
        if ($(this).prop('checked')) {
            $(this).parent().addClass('active')
        }
        else {
            $(this).parent().removeClass('active')
        }
    });

    $('.change-grid').off('click').on('click', function (e) {
        e.preventDefault();

        if (isMobile) { // is mobile
            $('.product-lists').toggleClass('one-column');
        } else {
            $('.product-lists').toggleClass('four-columns');
        }

		var newGridSystem = $(this).attr('value') === '1' ? '2' : '1';
		$.cookie('gorunum', newGridSystem);
		
		if (dataLayer) { // gtm entegrasyonu
			var dataLayerParams = JSON.parse(JSON.stringify(dataLayer)); 
				dataLayerParams = dataLayerParams.reverse();

			// parametreleri sondan başlayarak dönüyor
			for (var i in dataLayerParams) {
				var item = dataLayerParams[i];

				if (item.event && item.event === 'filters') { // en son gönderilen filters eventını yakalıyor

					item.filters.view_filter = newGridSystem; // view_filter parametresini güncellniyor

					dataLayer.push(item); // datalayer a son filters eventı gönderiliyor

					return; // function sonlandırılıyor
				}
			}
		}
    });

    $('.product-other-images').on('mousemove', function (e) {
        var $self = $(this);
        var total = $self.data('total');
        var mousePercent = Math.floor(e.originalEvent.layerX / $self.width() * 100);
        var selectedIndex = Math.floor(total / 100 * mousePercent);

        $self.find('img').hide()
            .eq(selectedIndex).show();
    }).on('mouseleave', function () {
        $(this).find('img').hide();
    });

    /* TODO AmirHome
    * app.js replace
    * */
    $(".guest-form, .nonregister-form").each(function () {
        var $self = $(this);
        var validatorFn = $self.data('validator');
        validatorFn.destroy();


        $self.validate({
            rules: {
                'firstname': {
                    required: true,
                    lettersonly: true,
                    minlength: 2
                },
                'lastname': {
                    required: true,
                    lettersonly: true,
                    minlength: 2
                },
                'email': {
                    required: true,
                    email: true,
                    emaildomain: true
                }
            }
        });
    });

    var $newAddressFormList = $(".new-address-form, .edit-address-form, #addresses-form, #addresses-form-click-collect");
    if ($newAddressFormList.length) {
        $newAddressFormList.each(function () {
            var $newAddressForm = $(this);
			var validatorFn = $newAddressForm.data('validator');
			if (validatorFn) {
				validatorFn.destroy();
			}

            $newAddressForm.find('.has-success').removeClass('has-success');
            $newAddressForm.validate({
                rules: {
                    'firstname': {
                        required: true,
                        maskCharacter:true,
                        characterSpace:true,
                        lettersonly: true,
                        minlength: 2
                    },
                    'lastname': {
                        required: true,
                        characterSpace:true,
                        maskCharacter:true,
                        lettersonly: true,
                        minlength: 2
                    },
                    'telephone': {
                        required: true,
                        minlength: 9,
                    },
                    'city': {
                        required: true
                    },
                    'region': {
                        required: true
                    },
                    'street': {
                        required: true,
                        minlength: 5
                    },
                    'title_address': {
                        required: true,
                        minlength: 2
                    },
                    'id_number': {
                        required: true,
                        number: true,
                        minlength: 10,
                        maxlength:11
                    },
                    'tax_number': {
                        required: true
                    },
                    'tax_office': {
                        required: true
                    },
                    'company': {
                        required: true
                    },
                    'receiver_name': {
                        required: true
                    },
                    'gift_message': {
                        required: true,
                        maxlength: 64
                    },
                    'shipping_address[firstname]': {
                        required: true,
                        lettersonly: true,
                        characterSpace:true,
                        maskCharacter:true,
                        minlength: 2
                    },
                    'shipping_address[lastname]': {
                        required: true,
                        lettersonly: true,
                        characterSpace:true,
                        maskCharacter:true,
                        minlength: 2
                    },
                    'shipping_address[telephone]': {
                        required: true,
                        minlength: 9,
                    },
                    'shipping_address[city]': {
                        required: true
                    },
                    'shipping_address[region]': {
                        required: true
                    },
                    'shipping_address[street]': {
                        required: true,
                        minlength: 5
                    },
                    'shipping_address[title_address]': {
                        required: true,
                        minlength: 2
                    },
					// --
                    'billing_address[firstname]': {
                        required: true,
                        lettersonly: true,
                        characterSpace:true,
                        maskCharacter:true,
                        minlength: 2
                    },
                    'billing_address[lastname]': {
                        required: true,
                        lettersonly: true,
                        characterSpace:true,
                        maskCharacter:true,
                        minlength: 2
                    },
                    'billing_address[telephone]': {
                        required: true,
                        minlength: 9,
                    },
                    'billing_address[city]': {
                        required: true
                    },
                    'billing_address[region]': {
                        required: true
                    },
                    'billing_address[street]': {
                        required: true,
                        minlength: 5
                    },
                    'billing_address[title_address]': {
                        required: true,
                        minlength: 2
                    }
                },
                messages: {
                    'shipping_address[telephone]': {
                        required: 'Lütfen bu alanı doldurunuz',
                        minlength: 'Lütfen geçerli bir telefon numarası giriniz',
                    },
                    'billing_address[telephone]': {
                        required: 'Lütfen bu alanı doldurunuz',
                        minlength: 'Lütfen geçerli bir telefon numarası giriniz',
                    },
                    'telephone': {
                        required: 'Lütfen bu alanı doldurunuz',
                        minlength: 'Lütfen geçerli bir telefon numarası giriniz',
                    },
                    'firstname': {
                       maskCharacter :  "Yazım Hatası: Ğ ile başlayamaz"
                    },
                    'lastname': {
                        maskCharacter :  "Yazım Hatası: Ğ ile başlayamaz"
                    },
                    'shipping_address[firstname]': {
                        maskCharacter :  "Yazım Hatası: Ğ ile başlayamaz"
                    },
                    'shipping_address[lastname]': {
                        maskCharacter :  "Yazım Hatası: Ğ ile başlayamaz"
                    },
                    'billing_address[lastname]': {
                        maskCharacter :  "Yazım Hatası: Ğ ile başlayamaz"
                    },
                    'billing_address[lastname]': {
                        maskCharacter :  "Yazım Hatası: Ğ ile başlayamaz"
                    }
                }
            });
        });

    }

    if ($(window).width() > 768) {
        $('.product-infos .holder').slimScroll({
            height: '150px',
            size: '6px',
            alwaysVisible: true,
            railVisible: true,
            wheelStep: 50,
            railColor: '#f8f8f8',
            color: '#f58426',
            borderRadius: 0,
            railOpacity: 1,
            opacity: 1
        });
    }
    /*
    * End AmirHome
    * */

	var initSwiper = function (container) {
		var $container = $(container).addClass('swiper-autoinit-init');
		var opts = {};
        var dataList = $container.data();

        for (key in dataList) {

            if (String(key).indexOf('swiper') === -1) {
                continue;
            }

            var value = dataList[key];

            key = key.replace('swiper', '').toCamelCase();

            opts[key] = value;
        }

        var $prevButton = $container.find('.swiper-button-prev');
        var $nextButton = $container.find('.swiper-button-next');

        if ($prevButton.length || $nextButton.length) {
            opts['navigation'] = {
                prevEl: $prevButton,
                nextEl: $nextButton,
            };
        }

        var $pagination = $container.find('.swiper-pagination');
        if ($pagination.length) {
            opts['pagination'] = {
                el: $pagination,
                clickable: true,
            }
        }
        var $scrollbar = $container.find('.swiper-scrollbar');
        if ($scrollbar.length) {
            opts['scrollbar'] = {
                el: $scrollbar,

            }
        }

		new Swiper(container, opts);
	};

	var swiperIOCallback = function (entries) {
		var entriesLen = entries.length;

		for (var i = 0; i < entriesLen; i++) {
			var entry = entries[i];

			if (entry.intersectionRatio < 0.2 && !entry.isIntersecting) {
				continue;
			}

			initSwiper(entry.target);

			swiperIO.unobserve(entry.target);
		}
	}
	var swiperIO = new IntersectionObserver(swiperIOCallback, {
		threshold: [0.2],
		rootMargin: '0px',
	});

    $('.swiper-autoinit:not(.swiper-autoinit-init)').each(function () {
		swiperIO.observe(this);
    });

    $('#mobile-filter-form').on('submit', function (e) {
         e.preventDefault();

        $(this).closest('.filter-form').removeClass('active');
        RG.CategoryFilters.refresh();

        $body.removeClass('block-scroll');
        var filtUrl = window.location.href;
        var filtEqual = filtUrl.split("=").length - 1;
        var filtComma = filtUrl.split(",").length - 1;
        var filtMin = filtUrl.split("min").length - 1;
        var filtTotal = filtEqual + filtComma - filtMin + 1;
        $('.filter-button span').text(filtTotal);
        return false;
    });



    $('.add-to-favourites-button').off('click');

    $(document)
        .off('wishlist.add wishlist.remove')
        .on('wishlist.add', function (e, data) {
            e.stopPropagation();

            data.$el.html('<i class="svg-favourited svg-favourited-dims"></i>');
            new Noty({
                text: '<i class="fa fa-heart mr-2"></i> Ürün favorilerinize eklendi.',
                layout: 'bottomRight',
                timeout: 2000
            }).show();
        })
        .on('wishlist.remove', function (e, data) {
            e.stopPropagation();

            data.$el.html('<i class="svg-favourite svg-favourite-dims"></i>');
            new Noty({
                text: '<i class="fa fa-heart-broken mr-2"></i> Ürün favorilerinizden çıkartıldı.',
                layout: 'bottomRight',
                timeout: 2000
            }).show();
        });

    $('.nav-tabs li').click(function(){
        $('.nav-tabs li').removeClass('active');
        $(this).addClass('active');
    });

    $('.cc_date select').change(function () {
        var value = $(this).val();
        $(this).siblings('span').text(value)
    });

    $('.editAddressModal').on('click', function (e) {
        RG.Overlay.block();

        RG.Request.post(
            '/ajax/address/getById',
            {
                id: $(this).data('address-id')
            },
            function (data) {

                if (data.success) {

                    var eForm = $('#address-edit-form');

                    eForm.find('input[name=title_address]').val(data.title_address);
                    eForm.find('input[name=title_address]').parent().addClass('active');

                    eForm.find('input[name=firstname]').val(data.firstname);
                    eForm.find('input[name=firstname]').parent().addClass('active');

                    eForm.find('input[name=lastname]').val(data.lastname);
                    eForm.find('input[name=lastname]').parent().addClass('active');

                    eForm.find('input[name=telephone]').val(data.telephone_mask);
                    eForm.find('input[name=telephone]').parent().addClass('active');

                    eForm.find('textarea[name=street]').val(data.street);

                    eForm.find('select[name=region]').val(data.region);

                    var str = "";
                    for (var item in data.towns) {
                        str += "<option>" + data.towns[item].default_name + "</option>";
                    }
                    eForm.find('select[name=city]').empty().append(str);
                    eForm.find('select[name=city]').val(data.city);

                    //hidden inputs
                    eForm.find('input[name=address_id]').val(data.id);
                    eForm.find('textarea[name=postcode]').val(data.postcode);
                    eForm.find('input[name=country_id]').val(data.country_id);
                    eForm.find('input[name=region_id]').val(data.region_id);
                    eForm.find('input[name=default_shipping]').val(data.default_shipping);
                    eForm.find('input[name=default_billing]').val(data.default_billing);

                    RG.Overlay.unblock();
                } else {
                    RG.Overlay.unblock();
                    RG.General.alert(data.message);
                }

            }, 'json'
        );

    });

    $('.deleteAddressModal').on('click', function (e) {
        $('#btnDeleteAddressModal').attr('data-address-id', $(this).data('address-id'));
    });

    $('.addAddressModal').on('click', function (e) {
        $('.new-address-form').attr('id', 'address-add-form');
    });

    $(document).on('click', '.installment-item', function (e) {
        $('.cc_installment span').text($(this).text());
        $('.cc_installment span').data('value',$(this).data('value'));
    })

    $('.search-panel').on('transitionEnd webkitTransitionEnd msTransitionEnd MozTransitionEnd', function () {
        $('.search-panel').find('input').focus();
    });

    /*$('.basket-page .option').closest('.page').click(function (e) {
        if (!$(e.target).hasClass('option')) {
            if ($('.select').hasClass('open')) {
                $('.select').removeClass('open');
            }
        }
    })*/
    $('.nice-select').click(function () {
        $(this).toggleClass('open')
    });




    var $ccNumber = $('[data-name="cc_number"]');
    if ($ccNumber.length) {
        var cardType = 'visa';
        var $cardType = $('.card-type');

        var cardBrand = 'maximum';
        var $cardBrand = $('.credit-card-box .logo-holder .logo');

        $(document).on('checkout.installments.response', function (e, data) {
            data = data.data;
            if (data.platform) {
                cardBrand = data.platform.toLowerCase();
            }

            var ccNumberVal = ($ccNumber.val() || '').replace(/\s/g, '');
            var ccNumberBin = ccNumberVal.substr(0, 6);

            if (/^5[1-5]/.test(ccNumberBin)) {
                cardType = "mastercard";
            } else if (/^4/.test(ccNumberBin)) {
                cardType = "visa";
            } else if (/^9792/.test(ccNumberBin)) {
				cardType = "troy";
			}

            if (['world', 'axess', 'maximum', 'paraf', 'cardfinans', 'bonus'].indexOf(cardBrand) !== -1) {
                $cardBrand.removeClass('world axess maximum paraf cardfinans bonus').addClass(cardBrand);
            }

            $cardType.removeClass('mastercard visa').addClass(cardType);
		});
		
		$ccNumber.on('keyup', function () {
		var value = $(this).val();
			$('.credit-card-box .number').html(value.replace(/\_/g, ''));
		});
    }

    if (isMobile) {
		var $productDetailSlider = $('.product-detail-slider');
		if ($productDetailSlider.length) {
            var slick = $productDetailSlider.find('.holder').slick('getSlick');
            // var $arrows = ;
            // slick.slickSetOption('arrows', true);
            // slick.slickSetOption('prevArrow', $arrows.filter('.prev'));
            // slick.slickSetOption('nextArrow', $arrows.filter('.next'));
			// console.log(slick);

            $productDetailSlider.find('.arrow').off('click').on('click', function (e) {
                e.preventDefault();

                if ($(this).hasClass('next')) {
                    slick.slickNext();
                } else {
                    slick.slickPrev();
                }
            });
        }
    }

    $('.show-campaign-code').click(function () {}).off('click');

	$(document).on('click', '.show-campaign-code', function () {
        $(this).next().slideToggle();
        $(this).toggleClass('active');
    });

	window.registerFormInitValidate = function ($registerForm) {
		var validatorFn = $registerForm.data('validator');

		if (validatorFn) {
			validatorFn.destroy();
		}

        $registerForm.find('.has-success').removeClass('has-success');
        $registerForm.validate({
            rules: {
                'first_name': {
                    required: true,
                    lettersonly: true,
                    characterSpace:true,
                    maskCharacter:true,
                    minlength: 2,
                },
                'last_name': {
                    required: true,
                    lettersonly: true,
                    characterSpace:true,
                    maskCharacter:true,
                    minlength: 2,
                },
                'email': {
                    required: true,
                    email: true,
                    emaildomain: true
                },
                'phone': {
                    required: true,
                    minlength: 9,
                },
                'password': {
                    required: true,
                    minlength: 6
                },
                'subscribed_kvkk': {
                    required: true
                },
                'uyelik_sozlesmesi': {
                    required: true
                }
            },
            messages: {
                'subscribed_kvkk': {
                    required: "Lütfen onaylayın"
                },
                'uyelik_sozlesmesi': {
                    required: "Lütfen onaylayın"
                },
                'phone': {
                    minlength: 'Lütfen geçerli bir telefon numarası giriniz',
                }
            }
        });
	}


	var $registerForm = $('#customer-register-form');
    if ($registerForm.length) {
		
		registerFormInitValidate($registerForm);

        var $registerCheckbox = $registerForm.find('.uyelik_sozlesmesi, .subscribed_kvkk');
        $registerCheckbox.on('change', function () {
            var $self = $(this);
            var isChecked = $self.prop('checked');

            $registerCheckbox.not($self).prop('checked', isChecked).each(function () {
                var $other = $(this);
                var name = $other.attr('name');

                $('#' + name + '-error')[isChecked ? 'hide' : 'show']().html(
                    isChecked ? '' : 'Lütfen onaylayın'
                );

                if (!isChecked) {
                    $other.parent().removeClass('active');
                }
            });
        });
    }

    var $accountForm = $('.account-form');
    if ($accountForm.length) {
        var validatorFn = $accountForm.data('validator');
        validatorFn.destroy();

        $accountForm.find('.has-success').removeClass('has-success');
        $accountForm.validate({
            ignore: [],
            rules: {
                ignore: [],
                firstname: {
                    required: true,
                    lettersonly: true,
                    characterSpace:true,
                    maskCharacter:true,
                    minlength: 2
                },
                lastname: {
                    required: true,
                    lettersonly: true,
                    characterSpace:true,
                    maskCharacter:true,
                    minlength: 2
                },
                email: {
                    required: true,
                    required: true,
                    emaildomain: true
                },
                phone: {
                    required: true
                },
                gender: {
                    required: true
                },
                uyelik_sozlesmesi: {
                    required: true
                }
            },
            messages: {
                'gender': {
                    required: "Lütfen seçin."
                },
                'uyelik_sozlesmesi': {
                    required: "Lütfen onaylayınn."
                }
            }
        });
    }

    var $passForm = $('.renew-password-form');
    if ($passForm.length) {
        var validatorFn = $passForm.data('validator');
        validatorFn.destroy();

        $passForm.find('.has-success').removeClass('has-success');
        $passForm.validate({
            rules: {
                current_password: {
                    required: true,
                    minlength: 6
                },
                password: {
                    required: true,
                    minlength: 6
                },
                password_confirmation: {
                    required: true,
                    equalTo: '#new-password'
                }
            },
            messages: {}
        });
    }

    var $contactForm = $('#contact_form');
    if ($contactForm.length) {
        var validatorFn = $contactForm.data('validator');
        validatorFn.destroy();

        $contactForm.find('.has-success').removeClass('has-success');
        $contactForm.validate({
            rules: {
                first_name: {
                    required: true,
                    lettersonly: true
                },
                last_name: {
                    required: true,
                    lettersonly: true
                },
                phone_number: {
                    required: true,
                    minlength: 9,
                },
                department: {
                    required: true
                },
                email: {
                    required: true,
                    email: true,
                    emaildomain: true
                },
                subject: {
                    required: true
                },
                message: {
                    required: true
                }
            },
            messages: {
                phone_number: {
                    minlength: 'Lütfen geçerli bir telefon numarası giriniz',
                }
            }
        });
    }
    var $contactForm = $('.subscribe-form');
    if ($contactForm.length) {
        var validatorFn = $contactForm.data('validator');
        validatorFn.destroy();

        $contactForm.find('.has-success').removeClass('has-success');
        $(".subscribe-form").validate({
            ignore: [],
            rules: {
                'subscribed_kvkk': {
                    required: true
                },
            },
            messages: {
                'subscribed_kvkk': {
                    required: "Lütfen Onaylayınız"
                }
            }
        });
    }
    let $yeniTicketForm = $('.yeni-ticket-form');
    if ($yeniTicketForm.length) {
        $($yeniTicketForm).validate({
            ignore: [],
            rules: {
                department_id: {
                    required: true
                },
                department_parent_id: {
                    required: true
                },
                name: {
                    required: true
                },
                message: {
                    required: true
                }
            }
        });
    }

    $('.faq-page-wrapper .category-links a').on('click', function (e) {
        e.preventDefault();

        var $self = $(this);

        $self.closest('ul').find('li').removeClass('active');
        $self.parent().addClass('active');
    });
	
	if (navigator.userAgent.indexOf('Mac OS X') != -1) {
		$body.addClass("mac");
	} else {
		$body.addClass("pc");
	}
	
	$('.card-numbers').inputmask("9999 9999 9999 9999");


	var $sortForm = $('.sort-form');
	if ($sortForm.length) {
		$(document).on('click', function (e) {
			if (!$sortForm.hasClass('active')) { return; }

			var $target = $(e.target);

			if (!$target.hasClass('.sort-form') && !$target.closest('.sort-form').length && !$target.hasClass('sort-button')) {
				$sortForm.removeClass('active');
				$body.removeClass('sort-form-active');
			}
		});
	}

	if (isMobile) {
		$('.delete-card').click(function () {
			$('#deleteCardModal').modal('show');
		});
	}

	$('.main-menu .bottom-menu ul > li > a').on('click', function (e) {
		e.preventDefault();

		var href = $(this).attr('href');

		if (href === '#') { return; }

		return window.location.href = href;
	});

	var price_alert = $('#price_alert');
	if(price_alert.length) {
        if ($.cookie('is_logged_in') == null || $.cookie('is_logged_in') == '0') {
            price_alert.parent('div').remove();
        }
        else {
            var params = {
                'product_id' : price_alert.data('product'),
                'sku'        : price_alert.data('sku')
            };
            RG.Widget.reload('products/price_alert', params);
        }
	}

	$('.input_lowercase').on('blur', function () {
		$(this).val(($(this).val() || '').toLowerCase())
	});

	$('.brand-search').off('click');
	$(document).on('keyup', 'input.brand-search', function () {
        var filter = $(this).val();

        $(".brand-list label").each(function () {
			var $self = $(this);

            if ($self.text().search(new RegExp(filter, "i")) < 0) {
                $self.fadeOut();
            } else {
                $self.show();
            }
        });
	});

	$body
		.off('mouseenter mouseleave', '.bottom-menu .dropdown', App.prototype.toggleDropdown)
		.off('click', '.bottom-menu .dropdown-menu a', App.prototype.toggleDropdown);

	var showMenuDropdownTimer = null;
	var showMenuDropdown = function () {
		var $self = $(this);
		var $menu = $self.find('> .dropdown-menu');

		clearTimeout(showMenuDropdownTimer);
		showMenuDropdownTimer = setTimeout(function () {
			$self.add($menu).addClass('show');
			$body.addClass('megamenu-active');
		}, 300);
	};

	var hideMenuDropdown = function () {
		clearTimeout(showMenuDropdownTimer);
		var $self = $(this);
		var $menu = $self.find('> .dropdown-menu');
		
		$self.add($menu).removeClass('show');
		$body.removeClass('megamenu-active');
	}

	$('.bottom-menu .dropdown')
		.on('mouseenter', showMenuDropdown)
		.on('mouseleave', hideMenuDropdown)
		.find('.dropdown-menu a').on('click', function () {
			hideMenuDropdown.apply($(this).closest('.dropdown').get(0));
		});


	$('.confirm-cart-button').off('click').on('click', function () {
		var $paymentForm = $('.payment-form');
			
		if ($paymentForm.length) {
			$paymentForm.valid();
		}
	});

	var $mobileMenu = $('#mobile-menu-custom');
	if ($mobileMenu.length) {
		$('.open-menu-button').on('click', function (e) {
			e.preventDefault();

			if ($mobileMenu.hasClass('mm-menu')) {
				var api = $mobileMenu.data("mmenu");
				api.open();

				return;
			}

			$mobileMenu.mmenu({
				"navbars": [
					{
						"position": "top",
						"content": [
							"prev",
							"title",
							"close"
						]
					}
				],
				extensions: ["pagedim-black"],
				hooks: {
					"openPanel:start": function( $panel ) {
						$('.mm-navbar .mm-hidden').next().text('TÜM KATEGORİLER')
					},
					"openPanel:finish": function( $panel ) {
			
					}
				}
			}, {
				// configuration
				offCanvas: {
					pageSelector: "#page-wrapper"
				}
			});

			var api = $mobileMenu.data("mmenu");
				api.open();

			$body.trigger('change');
		});
	}

	$('.go-back-link').on('click', function (e) {
		e.preventDefault();

		return window.history.back();
	});

	var $mainSlider = $('.main-slider.slick-initialized');
	if ($mainSlider.length) {
		var slickAPI = $mainSlider.slick('getSlick');

		slickAPI.slickSetOption('autoplay', true);
		slickAPI.slickSetOption('autoplaySpeed', 3000);
		slickAPI.play();
	}
});

if(window.location.pathname=='/checkout/shipping'){
    $('.shipping-header-container').addClass('ship');
}
$('.filter-form .card.sub > .btn-link').click(function () {
     $(this).parent().toggleClass('open');
 });

$(".order-status-form").validate({
    rules: {
        telephone: {
            required: true
        },
        id: {
            required: true
        }
    }
});

$(".order-status-confirmation-form").validate({
    rules: {
        code: {
            required: true
        }
    }
});

var flotomic = new Swiper ('.flotomic-top-slider .swiper-container', {
    slidesPerView          : 1,
    slidesPerGroup         : 1,
    loop                   : true,

    pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
        clickable:true,
    },
         loopFillGroupWithBlank : true,
    navigation             : { nextEl: '.swiper-button-next', prevEl : '.swiper-button-prev' }

});

var flotomicBottom = new Swiper ('.flotomic-bottom-slider .swiper-container', {
    slidesPerView          : 3,
    slidesPerGroup         : 1,
    loop                   : true,

    pagination: {
        el: '.swiper-pagination',
        dynamicBullets: true,
        clickable:true,

    },
    breakpoints: {1023: {slidesPerView: 2, spaceBetween: 20}, 767: {slidesPerView: 1, spaceBetween: 10}},
    loopFillGroupWithBlank : true,
    navigation             : { nextEl: '.swiper-button-next', prevEl : '.swiper-button-prev' }

});


window.onload = function() {
    var playimg= "/pub/assets/flo/images/play.png";
    var pauseimg= "/pub/assets/flo/images/pause.png";
    var muteimg= "/pub/assets/flo/images/mute.png";
    var unmuteimg= "/pub/assets/flo/images/unmute.png";

    $('.video').click(function() {
        if (this.paused == false) {
            this.pause();
            $(this).siblings(".video-controls").find(".play-pause").attr('src', playimg);
             $(this).siblings(".poster").css("display", "block");

        } else {
            this.play();
            $(this).siblings(".poster").css("display", "none");
             $(this).siblings(".video-controls").find(".play-pause").attr('src', pauseimg);

        }
    });
    $('.play-pause').on("click", function() {
        video=$(this).parent().siblings('video')[0];
         if (video.paused == true) {
            // Play the video
            video.play();
              $(this).parent().siblings(".poster").css("display", "none");
             $(this).attr('src', pauseimg);
        } else {
            video.pause();
             $(this).parent().siblings(".poster").css("display", "block");
            $(this).attr('src', playimg);
        }
    });
    $('.mute').on("click", function() {
        video=$(this).parent().siblings('video')[0];

        if (video.muted == false) {
            $(this).siblings(".volume-bar").val("0");
            video.muted = true;
            $(this).attr('src', unmuteimg);
        } else {
            $(this).siblings(".volume-bar").val("1");
            video.muted = false;
            $(this).attr('src', muteimg);
        }
    });
    $('.full-screen').on("click", function() {
        video=$(this).parent().siblings('video')[0];

        if (video.requestFullscreen) {
            video.requestFullscreen();
        } else if (video.mozRequestFullScreen) {
            video.mozRequestFullScreen(); // Firefox
        } else if (video.webkitRequestFullscreen) {
            video.webkitRequestFullscreen(); // Chrome and Safari
        }
    });

    $('.volume-bar').on("click", function() {
        video=$(this).parent().siblings('video')[0];
        video.volume = $(this).val();
    });
    $('.replay-btn').on("click", function() {
        video=$(this).parent().siblings('video')[0];
        video.currentTime = 0;
        $(this).parent().siblings(".poster").css("display", "none");
        video.play();
    });
    $('.next-btn').on("click", function() {
        video=$(this).parent().siblings('video')[0];
        video.currentTime =video.currentTime +5 ;
        video.play();
    });
    $('.prev-btn').on("click", function() {
        video=$(this).parent().siblings('video')[0];
        video.currentTime =video.currentTime -5 ;
        video.play();
    });

    $(".video-seekbar").on("click", function(e){
        video=$(this).parent().siblings('video')[0];
        var offset = $(this).offset();
        var left = (e.pageX - offset.left);
        var totalWidth = $(".video-seekbar").width();
        var percentage = ( left / totalWidth );
        var vidTime = video.duration * percentage;
        video.currentTime = vidTime;
    });
    var currentTimeDuration = function(video){
        var currTimeStr = Math.round(video.currentTime).toString();

        function formatTime(seconds) {
            minutes = Math.floor(seconds / 60);
            minutes = (minutes >= 10) ? minutes : "0" + minutes;
            seconds = Math.floor(seconds % 60);
            seconds = (seconds >= 10) ? seconds : "0" + seconds;
            return minutes + ":" + seconds;
        }
        $(video).siblings('.video-controls') .find('.current-time').text(formatTime(currTimeStr));
    };
    $('.video').on("timeupdate", function() {
        if (this.paused == false) {
            var value = (100 / this.duration) * this.currentTime;
           $(this).siblings('.video-controls') .find('.custom-seekbar').val(value);
            currentTimeDuration(this);
            var percentage = ( this.currentTime / this.duration ) * 100;
            $(this).siblings('.video-controls') .find('.video-seekbar span').css("width", percentage+"%");
        }
    });
 };


$(function () {
	var $window = $(window);
	var $backToTop = $('.back-to-top');

	if ($backToTop.length) {
		$window.on('scroll', function () {
			if ($window.scrollTop() > 300) {
				$backToTop.fadeIn();
			} else {
				$backToTop.fadeOut();
			}
		});

		$backToTop.on('click', function (e) {
			e.preventDefault();

			$('html, body').animate({
				scrollTop: 0
			}, 300);
		})
	}

	$('#card-expiration-month, #card-expiration-year').change(function () {
        m = $('#card-expiration-month option').index($('#card-expiration-month option:selected'));
        m = (m < 10) ? '0' + m : m;
        y = $('#card-expiration-year').val();
        $('.card-expiration-date div').html(m + '/' + y);
	});


	$("#cc_cart_info").validate({
        ignore: [],
        rules: {
            'cc_number': {
                required: function(element) {
                    return $("input[name='cc_number']").is(':empty') && !$('.use-saved-cart').attr('hidden') === "undefined";
                },
                minlength:16

            },
        },
        messages: {
            'cc_number': {
                required: 'Lütfen geçerli bir kart numarası giriniz.',
                minlength: 'Lütfen geçerli bir kart numarası giriniz.'
            }
        }
	});

	$(document).on('address.updated', function () {
		RG.Overlay.unblock();
		
		new Noty({
            text: '<div class="address-update-noty"><div class="address-update-noty-inner"><i class="svg-addresses svg-addresses-dims"></i> Adres Başarıyla Güncellenmiştir.</div></div>',
            layout: 'bottomRight',
			timeout: 3000,
			callbacks: {
				afterClose: function () {
					var redirectTo = $('#address-edit-form').attr('data-redirect-to');
					if (redirectTo) {
						window.location.href = redirectTo;
					}
				}
			}
        }).show();
	});
});

$(document).on('mouseenter', '#user-menu ', function (e) {
    $('body').addClass('megamenu-active');
    $('.logged-in .dropdown, .logged-in .dropdown-menu').addClass('show');
    $(".logged-in .dropdown-menu").css({"position": "absolute", "transform": "translate3d(0px, -35px, 0px)  ","top":"0px","left":"0px","will-change":"transform"," transition":"all 2300ms;"});
});

$(document).on('mouseleave', '#user-menu ', function (e) {
    $('body').removeClass('megamenu-active');
    $('.logged-in .dropdown, .logged-in .dropdown-menu').removeClass('show');
    $(".logged-in .dropdown-menu").css({"position": "static", "transform": "none","top":"0px","left":"0px","will-change":"transform"," transition ":"all 2300ms;"});
});

$(function () {
	setTimeout(function () {
		const $aggreementWrapper = $('.flo-agreement-wrapper');
		if ($aggreementWrapper.length) {
			$('.iread a').removeAttr('data-toggle').removeAttr('data-target').off('click').on('click', function (e) {
				e.preventDefault();
				
				$('html, body').animate({
					scrollTop: $aggreementWrapper.offset().top,
				})
			});
		}
	}, 300);

	var $sizeChartAccordions = $('.sc-accordion');
	if ($sizeChartAccordions.length) {
		$sizeChartAccordions.find('.sc-accordion-title').off('click').on('click', function (e) {
			e.preventDefault();
			var $self = $(this);
			var $selfAccordion = $self.closest('.sc-accordion');
			var $accordionParent = $selfAccordion.parent();

			$accordionParent.find('.sc-accordion').removeClass('active');
			$selfAccordion.addClass('active');

			var $target = $($self.attr('data-target'));
			var targetIsVisible = $target.first().is(':visible');

			$self.closest('.sc-accordion-wrapper').find('.sc-accordion-target').hide();

			if (!targetIsVisible) {
				$target.fadeIn();
			} else {
				$self.closest('.sc-accordion').removeClass('active');
			}
		});
	}

	$('.category_filters .btn-link').on('click', function (e) {
		var $self = $(this);
		var $collapse = $self.nextAll('.collapse');

		if ($collapse.is(':visible')) {
			$collapse.collapse('hide');
		} else {
			$collapse.collapse('show');
		}
	});

	var collapseShowCategoryFilters = function () {
		$('.flo-category-filters .btn-link.selected').parents('.collapse').addClass('show');
	}

	$(document).on('product.list.dom.change', collapseShowCategoryFilters);
	setTimeout(collapseShowCategoryFilters, 100);

	var acc =  $(".discover");
	var i;
	for (i = 0; i < acc.length; i++) {
		acc[i].addEventListener("click", function() {
			$(this).toggleClass("active");
			var panel = $(this).parent().parent().siblings(".one-collection");
			panel.toggleClass('open');
		});
	}


	$('.product-detail-image-fullscreen').on('click', function (e) {
		e.preventDefault();

		var activeIndex = 0;
		var images = $('#product-gallery .thumb').map(function () {
			var $self = $(this);

			if ($self.hasClass('active')) {
				activeIndex = $self.index();
			}

			return {
				src  : $self.attr('data-zoom-image')
			}
		}).get();

		$.fancybox.open(images, {
			onInit: function (api) {
				api.jumpTo(activeIndex);
			}
		})
	});
});

function changePasType(){
    if($('.change-pass').text()=='Göster'){
        var  password='text';
        var  showText='Gizle';
    }
  else{
        var  password='password';
        var  showText='Göster';
     }
    $('.change-pass').text(showText);
    $("input[name='password']").attr('type',password)
}
// poster frame click event
$(document).on('click','.js-videoPoster',function(ev) {
    ev.preventDefault();
    var $poster = $(this);
    var $wrapper = $poster.closest('.js-videoWrapper');
    $('.top-left').hide();
    videoPlay($wrapper);
});
function videoPlay($wrapper) {
    var $iframe = $wrapper.find('.js-videoIframe');
    var src = $iframe.data('src');
// hide poster
    $wrapper.addClass('videoWrapperActive');
// add iframe src in, starting the video
    $iframe.attr('src', src);
}
// play the targeted video (and hide the poster frame)
$(function () {

    $(window).scroll(function () {
        if ($(this).scrollTop() >= $(window).height()) {        // If page is scrolled more than 50px
            $('#return-to-top').fadeIn(200);    // Fade in the arrow
        } else {
            $('#return-to-top').fadeOut(200);   // Else fade out the arrow
        }
    });
    $('#return-to-top').click(function () {      // When arrow is clicked
        $('body,html').animate({
            scrollTop: 0                       // Scroll to top of body
        }, 500);
    });
    var hmgr = 0;
    $('.hamburger').on('click', function () {

        if (hmgr == 0) {
            $(this).attr('src', '/pub/assets/flo/images/close.png')
            hmgr = 1;
            $('.main-slider,.open-hamburger').toggleClass('d-none');
        } else if (hmgr == 1) {
            $(this).attr('src', '/pub/assets/flo/images/hamburger.png')
            hmgr = 0;
            $('.main-slider,.open-hamburger').toggleClass('d-none');
        }


    })
});





var swiperOverview = new Swiper('.slider-product-overview .swiper-container', {
    slidesPerView: 4,
    pagination: {
        el: '.slider-product-overview .swiper-pagination',
        clickable: true,
    },
    scrollbar: {
        el: '.slider-product-overview .swiper-scrollbar',
     },
    breakpoints: {
        768: {
            slidesPerView: 2,
            spaceBetween: 40,
        }}
});
var swiperInterest= new Swiper('.slider-interest .swiper-container', {
    slidesPerView: 3,
    navigation: {
        nextEl: '.slider-interest .swiper-button-next',
        prevEl: '.slider-interest .swiper-button-prev',
    },
    scrollbar: {
        el: '.slider-interest .swiper-scrollbar',
    },
    breakpoints: {
        768: {
            slidesPerView: 2,

        }}
});
