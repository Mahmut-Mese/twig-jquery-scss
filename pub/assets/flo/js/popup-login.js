$(function () {
	var $customerLoginForm = $('#customer-login-form');
	var customerLoginPopup = function() {};

	if (!$customerLoginForm.length) {
		customerLoginPopup = function (e) {
			e.preventDefault();
	
			RG.General.setCookie("redirectUrl", window.location.href, 1);

			$.get('/customer/login', function (response) {
				var $markup = $(response);
				var $loginForm = $markup.find('#customer-login-form');
	
				if (!$loginForm) {
					window.location.href = '/customer/login';
					return;
				}
	
				$.fancybox.open('<div class="login-page-wrapper is-popup" style="width: 450px;"><script src=\'https://www.google.com/recaptcha/api.js?hl=tr\'></script><div class="text-center  pb-2 mb-3" style="font-size: 20px; color: #000000;">GİRİŞ YAPIN</div>'+ $loginForm.get(0).outerHTML +'</div>', {
					afterShow: function () {
						RG.init();

						setTimeout(function () {
							$('.customer-login').off('click').on('click', customerLoginPopup);
						}, 300);
					}
				});
			});
		}

		$('.customer-login-popup').off('click').on('click', customerLoginPopup);
	}

	var $customerRegisterForm = $('#customer-register-form');

	if (!$customerRegisterForm.length) {
		$(document).on('click', 'a[href="/customer/register"]', function (e) {
			e.preventDefault();
			RG.General.setCookie("redirectUrl", window.location.href, 1);
	
			$.get('/customer/register', function (response) {
				var $markup = $(response);
				var $registerForm = $markup.find('#customer-register-form');
	
				if (!$registerForm) {
					window.location.href = '/customer/register';
					return;
				}
	
				$.fancybox.open('<div class="login-page-wrapper is-popup" style="width: 450px;"><div class="text-center  pb-2 mb-3" style="font-size: 20px; color: #000000;">ÜYE OL / HESAP OLUŞTUR</div>'+ $registerForm.get(0).outerHTML +'</div>', {
					afterShow: function () {
						RG.init();

						$("input.inputmask").inputmask({
							"clearIncomplete": true,
							"autoUnmask": true
						}).blur(function () {
							$(this).valid();
						});

						jQuery.validator.setDefaults({

							errorElement: "span",
							errorPlacement: function (error, element) {
								error.addClass("help-block");
					
								if (element.prop("type") === "checkbox") {
									error.insertAfter(element.parent());
								} else {
									error.insertAfter(element);
								}
							},
							highlight: function (element, errorClass, validClass) {
								$(element).parents('.form-group').addClass("has-error").removeClass("has-success");
							},
							unhighlight: function (element, errorClass, validClass) {
								$(element).parents('.form-group').addClass("has-success").removeClass("has-error");
							}
						});
						
						if (typeof window.registerFormInitValidate === 'function') {
							window.registerFormInitValidate($('#customer-register-form'));
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
					}
				});
			});
		});
	}

	if ($.cookie('is_logged_in') !== '1') {
		$('.add-wishlist').off('click').on('click', customerLoginPopup);
	}
});
