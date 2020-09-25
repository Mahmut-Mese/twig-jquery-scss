$(function () {
	$('.cc_date select').change(function(){
		var value = $(this).val();
		$(this).siblings('span').text(value)
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
	$('.nonregister-next-step-button').click(function () {
		$(".nonregister-form").valid();
		// if($(".nonregister-form").valid()) {
		//     $('#newShippingAddressModal').modal('show');
		//     $('.new-address-form input[name="first_name"]').val($('.nonregister-form input[name="first_name"]').val());
		//     $('.new-address-form input[name="last_name"]').val($('.nonregister-form input[name="last_name"]').val());
		// }
	});
	var $newAddressFormList = $(".new-address-form, #addresses-form");
	if ($newAddressFormList.length) {

		$newAddressFormList.each(function () {
			var $newAddressForm = $(this);
			var validatorFn = $newAddressForm.data('validator');
			validatorFn.destroy();

			$newAddressForm.find('.has-success').removeClass('has-success');
			$newAddressForm.validate({
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
					'tax_office': {
						required: true
					},
					'company_name': {
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
						minlength: 2
					},
					'shipping_address[lastname]': {
						required: true,
						lettersonly: true,
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
					}
				},
				messages: {
					'shipping_address[telephone]': {
						required: 'Lütfen bu alanı doldurunuz',
						minlength: 'Lütfen geçerli bir telefon numarası giriniz',
					},
					'telephone': {
						required: 'Lütfen bu alanı doldurunuz',
						minlength: 'Lütfen geçerli bir telefon numarası giriniz',
					}
				}
			});
		});

	}
	$(".edit-address-form").validate({
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
			'telephone': {
				required: true
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
			}
		}
	});
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
	$('.editAddressModal').on('click', function (e) {

		RG.Request.post(
			'/ajax/address/getById',
			{
				id: $(this).data('address-id')
			},
			function (data) {
				// RG.Overlay.unblock();
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


				} else {
					RG.General.alert(data.message);
				}

			}, 'json'
		);

	});
	/*
	* End AmirHome
	* */
	$("#deeplink #open").click(function(){
		var obj = $('#deeplink');
		if(navigator.userAgent.toLowerCase().indexOf("android") > -1){
			window.location.href = obj.data('deep-url');
			setTimeout(function() {
				window.location.href = obj.data('android-url');
			}, 100);
		}

		if(navigator.userAgent.toLowerCase().indexOf("iphone") > -1){
			window.location.href = obj.data('ios-url');
		}
	})
	if (navigator.userAgent.indexOf('Mac OS X') != -1) {
		$("body").addClass("mac");
	} else {
		$("body").addClass("pc");
	}
	$('.flo-checkbox input').on('change', function () {
		if ($(this).prop('checked')) {
			$(this).parent().addClass('active')
		}
		else {
			$(this).parent().removeClass('active')
		}
	});

	$('.delete-card').off('click').on('click', function () {
		$('#deleteCardModal').modal('show');
	});
	if(window.location.pathname=='/checkout/shipping'){
		$('.shipping-header-container').addClass('ship');
	}
	$("#deeplink #hide").click(function(){

		$('.cookie-deeplink').addClass('hidden');
		$('.site-header .main-menu.deeplink-menu').removeClass('deeplink-menu');

		if (window.location.pathname=='/') {
			RG.General.setCookie("deeplink", 1, 0.333);
		}
	});
});
$('.nav-tabs li').click(function () {

	if($('#pay-home-tab').hasClass('active')){
		$('.banner-area').hide()

	}
	else {
		$('.banner-area').show()


	}


})

$(".order-status-form").validate({
	rules: {
		phone: {
			required: true
		},
		guest_order_no: {
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
	$('.msz-close').on('click', function (e) {
		e.preventDefault();

		$('body').removeClass('mobile-size-container-show');
	});

	$('.msz-size .choices-box label').on('click', function () {
		var $self = $(this);

		$self.closest('.choices-box').find('.active').removeClass('active');
		$self.addClass('active');
	});

	$('#sizeTableModal').on('shown.bs.modal', function () {
		var $self = $(this);

		$self.find('.modal-body').css('max-height', $self.find('.modal-dialog').get(0).clientHeight)
	});

	// Footer read more
	$('.footer-content .read-more').click(function () {
		$('.footer-content').toggleClass('expanded');
		$('.footer-content .read-more span').toggleText('DEVAMI', 'KAPAT');
	});
});

