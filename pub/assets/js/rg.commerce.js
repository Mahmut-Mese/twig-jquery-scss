var RG = {
    lastUrl: '',
    memberId: 0,
    isLoginRequired: 0,

    init: function () {
        var self = this,
            obj;

        for (obj in self) {
            if (self.hasOwnProperty(obj)) {
                var _method = self[obj];
                if (_method.selector !== undefined && _method.init !== undefined) {
                    if ($(_method.selector).length > 0) {
                        if (_method.dependencies !== undefined) {
                            (function (_async) {
                                Modernizr.load([
                                    {
                                        load: _async.dependencies,
                                        complete: function () {
                                            _async.init();
                                        }
                                    }
                                ]);
                            })(_method);
                        } else {
                            _method.init();
                        }
                    }
                }
            }
        }
    },

    Overlay: {
        blockTimer: 0,
        message: '',
        tick: '',
        block: function () {
            if (arguments.length > 0) {
                RG.Overlay.message = arguments[0];
            }


            $('#block-box .text').html(RG.Overlay.message + '<br />' + RG.Overlay.tick);
            $('#block-box').show();

            RG.Overlay.blockTicker();
        },

        blockTicker: function () {
            RG.Overlay.blockTimer = setTimeout(function () {
                if (RG.Overlay.tick === '...') {
                    RG.Overlay.tick = '';
                }

                RG.Overlay.tick = RG.Overlay.tick + '.';

                $('#block-box .text').html(RG.Overlay.message + '<br />' + RG.Overlay.tick);

                RG.Overlay.blockTicker();
            }, 500);
        },

        unblock: function () {
            $('#block-box').hide();

            clearTimeout(RG.Overlay.blockTimer);
        }
    },

    Request: {
        post: function () {
            $.post.apply($.post, arguments).statusCode({
                401: function () {
                    // TODO: Cache request and send again after login / register
                    RG.Customer.requireLogin();
                }
            });
        }
    },

    General: {
        slugify: function (text) {
            var trMap = {
                'çÇ': 'c',
                'ğĞ': 'g',
                'şŞ': 's',
                'üÜ': 'u',
                'ıİ': 'i',
                'öÖ': 'o'
            };
            for (var key in trMap) {
                text = text.replace(new RegExp('[' + key + ']', 'g'), trMap[key]);
            }
            return text.replace(/[^-a-zA-Z0-9\s]+/ig, '') // remove non-alphanumeric chars
                .replace(/\s/gi, "-") // convert spaces to dashes
                .replace(/[-]+/gi, "-") // trim repeated dashes
                .toLowerCase();
        },
        alert: function (msg) {
            var callback;
            if (arguments.length >= 2) {
                callback = arguments[1];
            }

            alert(msg);

            if (callback) {
                callback();
            }
        },
        getCookie: function (name) {
            var value = "; " + document.cookie;
            var parts = value.split("; " + name + "=");
            if (parts.length == 2) return parts.pop().split(";").shift();
        },
        setCookie: function (name, value, days) {
            var d = new Date;
            d.setTime(d.getTime() + 24 * 60 * 60 * 1000 * days);
            document.cookie = name + "=" + value + ";path=/;expires=" + d.toGMTString();
        },
        round: function (value, places) {
            return +(Math.round(value + "e+" + places) + "e-" + places);
        },
        queryString: function (key) {
            key = key.replace(/[*+?^$.\[\]{}()|\\\/]/g, "\\$&"); // escape RegEx meta chars
            var match = location.search.match(new RegExp("[?&]" + key + "=([^&]+)(&|$)"));
            return match && decodeURIComponent(match[1].replace(/\+/g, " "));
        },
        replaceQueryString: function (key, value, redirect ) {
			redirect ? redirect: false;
			
            var match = location.search.match(new RegExp("[?&]" + key + "=([^&]*)(&|$)"));
            var seperator = window.location.search.length ? '&' : '?';
            var searchUrl = redirect ? RG.General.removeQueryString('page', searchUrl) : window.location.search;

            if (match) {
                searchUrl = searchUrl.replace(key + "=" + match[1], key + "=" + value);
            } else {
				searchUrl = searchUrl + seperator + key + '=' + value;
				
				if (searchUrl.indexOf('?') === -1) {
					searchUrl = '?' + searchUrl;
				}
			}

            if (redirect) {
                window.location.href = window.location.protocol + '//' + window.location.host + window.location.pathname + searchUrl;
            } else {
                return searchUrl;
            }
        },
        removeQueryString: function (key, searchUrl) {
            if (searchUrl == undefined) {
                searchUrl = window.location.search;
            }

            return searchUrl.replace(new RegExp("[?&]" + key + "=([^&]?)&?"), '');
        },
        removeDisabled: function () {
           // $(".basket-button").not(".widget_products_detail .basket-button,.basket-container.disabled .basket-button").removeClass("disabled");
        },
        removeMask: function (e) {
            var numb   = $(e).val().match(/\d/g).join("");
            return numb;
        },
        beforePushstate: function (e) {
           var urlpush;
            return urlpush;
        },
        campaignCatcher: function(data) {
            var product = 'prd_' + data.productId;
            var source = 'home';
            if(data.categoryId !== "" && data.categoryId != 0) {
                source = 'category:' + data.categoryId;
            } else if(data.manufacturerId !== "" && data.manufacturerId != 0) {
                source = 'manufacturer:' + data.manufacturerId;
            } else if(data.gender !== "" && data.gender != 0) {
                source = 'gender:' + data.gender;
            } else if(data.query !== "" && data.query != 0) {
                source = 'search:' + data.query;
            }

            console.log(data, product,  source);

            RG.General.setCookie(product,  source);

            return false;
        }
    },

    BrandFilter: {
        selector: '#brand-filter',
        init: function () {
            $(RG.BrandFilter.selector).on('keyup', function () {
                console.warn($(this).val());
                if ($(this).val() == '') {
                    $('.brand-item').show();
                    return;
                } else {
                    var value = RG.General.slugify($(this).val().toLowerCase());

                    $('.brand-item').each(function () {
                        if (RG.General.slugify($(this).data('title')).match(value)) {
                            $(this).show();
                        } else {
                            $(this).hide();
                        }
                    })
                }
            });
        }
    },

    Subscription: {
        selector: '#newsletter-subscription, #customer-subscription',
        init: function () {
            $('#newsletter-subscription').off('submit').on('submit', function (e) {
				e.preventDefault();

				var $form = $(this);

				if ($form.hasClass('validation-control')) {
					RG.validation.init($form);
					if(! RG.validation.validate($form)){
						return false;
					}
				}

                RG.Overlay.block(RG.Translate.get('Kayıt Ediliyor'));
                $.post('/ajax/customer/newsletter', $form.serialize(), function (data) {
                    RG.General.alert(data.message, RG.Overlay.unblock);
                }, 'json');
            });

            $('.check-newspaper').off('click').on('click', function () {
                $('#subscriptons-form').trigger('submit');
            });

            $('#subscriptons-form').off('submit').on('submit', function (e) {
                if (e) {
                    e.preventDefault();
                }

                RG.Overlay.block(RG.Translate.get('Kayıt Ediliyor'));
                console.log(e);
                $.post('/ajax/customer/newslettercustomer', $(this).serialize(), function (data) {
                    RG.General.alert(data.message, RG.Overlay.unblock);
                }, 'json');
            });
        }
    },

    Customer: {
        selector: '#customer-login-form, .customer-logout, #customer-register-form,#guest-form',
        init: function () {
			RG.Basket.prepareSidebar();
			
			function getUrlParameter(name) {
				name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
				var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
				var results = regex.exec(location.search);
				return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
			};

            $('#customer-login-form').off('submit').on('submit', function (e) {
                e.preventDefault();
                var elem = $(this);
                // var redirectUrl = getUrlParameter('redirect');
				var redirectUrl = RG.General.getCookie('redirectUrl');
				
				if(!redirectUrl) {
					redirectUrl = getUrlParameter('redirect');
				}

                RG.Overlay.block(RG.Translate.get('Giriş yapılıyor'));
                $.post('/ajax/customer/login', elem.serialize(), function (data) {
                    if (data.success) {
                        RG.DataLayer.trigger("login", {response: data});
                        RG.Wishlist.Refresh();
						RG.Wishlist.setAddedProduct();
						
						$(document).trigger('form.ajax.success', {
							el: elem
						});
                        //Remove redirect cookie
                        RG.General.setCookie("redirectUrl", '', 1);

                        if (typeof elem.data('redirect-url') !== 'undefined'){
                            window.location.href = data.redirect ? elem.data('redirect-url') : BASKET_BASE_URL + '/basket';
                        } else {
                            window.location.href = redirectUrl ? redirectUrl : '/';
                        }
                    } else {
                        RG.General.alert(data.message, RG.Overlay.unblock);
                        if(data.failures_num >= 5){
                            location.reload();
                        }
                    }
                }, 'json');
            });

            $('.customer-logout').off('click').on('click', function (e) {
                e.preventDefault();

                RG.Overlay.block(RG.Translate.get('Çıkış yapılıyor'));
                $.post('/ajax/customer/logout', function (data) {
                    if (data.success) {
                        RG.General.setCookie("wishlist", '', 1);
                        RG.DataLayer.trigger("logout", {response: data});
                        window.location.href = "/";
                    } else {
                        RG.General.alert(data.message);
                    }
                }, 'json');
            });

            $('.customer-login').off('click').on('click', function (e) {
                e.preventDefault();
                RG.General.setCookie("redirectUrl", window.location.href, 1);
                window.location.href = "/customer/login";
            });
            $('.customer-login-register').off('click').on('click', function (e) {
                e.preventDefault();
                RG.General.setCookie("redirectUrl", window.location.href, 1);
                window.location.href = "/customer/register";
            });

            $('#customer-register-form').off('submit').on('submit', function (e) {

                e.preventDefault();
                var elem = $(this);
                var redirectUrl = RG.General.getCookie('redirectUrl');
                RG.validation.init(elem);
                if(! RG.validation.validate(elem)){
                    return false;
                }
                var regModify = elem.serialize();
                RG.Overlay.block(RG.Translate.get('Kayıt Ediliyor'));
                $.post('/ajax/customer/register', regModify, function (data) {
                    if (data.success) {
						RG.DataLayer.trigger("register", {response: data});
						
						$(document).trigger('form.ajax.success', {
							el: elem
						});

						if (elem.closest('.is-popup').length) {
							dataLayer.push({
								'event' : "user_register"
							});
						}
                        window.location.href = redirectUrl ? redirectUrl : '/';

                    } else {
                        RG.General.alert(data.message, RG.Overlay.unblock);
                    }
                }, 'json');
            });
            $('#guest-form').off('submit').on('submit', function (e) {
                e.preventDefault();
                var redirectUrl = $(this).data('redirect-url');
				var elem = $(this);

                RG.validation.init($(this));
                if(! RG.validation.validate($(this))){
                    return false;
                }

                RG.Overlay.block(RG.Translate.get('Giriş yapılıyor'));
                $.post('/ajax/customer/guest', $(this).serialize(), function (data) {
					RG.Overlay.unblock();
                    if (data.success) {

						$(document).trigger('form.ajax.success', {
							el: elem
						});

                        if ('#' == redirectUrl) {
							window.location.href = '/checkout/address';
							return;
                            // flo open popup (modal)

                            // if ('' != $('.nonregister-form input[name="firstname"]').val()
                            //     && '' != $('.nonregister-form input[name="lastname"]').val()
                            //     && '' != $('.nonregister-form input[name="email"]').val()) {
                            //     $('#newShippingAddressModal').modal('show');
                            //     $('.new-address-form input[name="shipping_address[firstname]"]').val($('.nonregister-form input[name="firstname"]').val());
                            //     $('.new-address-form input[name="shipping_address[lastname]"]').val($('.nonregister-form input[name="lastname"]').val());
                            //     $('.new-address-form input[name="guest_email"]').val($('.nonregister-form input[name="email"]').val());
                            // }
                        } else {
                            // instreet redirect
                            window.location.href = redirectUrl;
                        }


                    } else {
                        RG.General.removeDisabled();
                        RG.General.alert(data.message, RG.Overlay.unblock);
                    }
                }, 'json');
            });
        },

        requireLogin: function () {
            // TOOD: Change this to light box

            $.cookie('is_logged_in', 0, {path: '/'});
            $.cookie('_token', '', {path: '/'});
            $.cookie('customer_id', '', {path: '/'});
            $.cookie('cart_hash', '', {path: '/'});
            var path= window.location.pathname;
            var query=  window.location.href.split('?')[1];
            if (!query){redirect=''}
            else{redirect= window.location.href.split('?')[1];}
            window.location.href = document.location.origin+'/customer/login?redirect='+path +'?' + redirect;
        }
    },
    GuestOrder: {
        selector: '.order-status-page-wrapper',
        init: function () {

            $('.order-status-form').off('submit').on('submit', function (e) {
                e.preventDefault();
                RG.validation.init($(".order-status-form"));
                if (!RG.validation.validate($(".order-status-form"))) {
                    return false;
                }
                let data_ser = $(this).serialize();
                RG.Request.post(
                    '/ajax/guest/verifyCodeSend',
                    data_ser,
                    function (data) {
                        if (data.success) {
                            window.location =  '/guest-order-confirm';
                        } else {
                            RG.General.alert(data.message, RG.Overlay.unblock);
                        }
                    }, 'json'
                );
            /* var urlGuest=$(this).serialize();
                console.log(urlGuest)
                window.location = '/guest/order?'+urlGuest+'';*/
            });

            $('.order-status-confirmation-form').off('submit').on('submit', function (e) {
                e.preventDefault();
                RG.validation.init($(".order-status-confirmation-form"));
                if (!RG.validation.validate($(".order-status-confirmation-form"))) {
                    return false;
                }
                /*var timeCount = $('.count').html();
                var timer = timeCount.split(':');
                var minutes = parseInt(timer[0], 10);
                if (minutes != -1) {
                    console.log($(this).serialize())
                }*/

                let form_data = $(this).serialize();
                RG.Request.post(
                    '/ajax/guest/confirmCode',
                    form_data,
                    function (data) {
                        if (data.success) {
                            window.location =  '/guest-order?id='+data.message.orderId;
                        } else {
                            RG.General.alert(data.message, RG.Overlay.unblock);
                        }
                    }, 'json'
                );

            });
            $('.send-sms-again').off('click').on('click', function () {
                window.location = '/guest-order-verify';
            })
        }
    },
    SavedCard: {
        selector: '.saved-card',
        init: function () {
            $(document).on("click", ".my-data-click", function () {
                $('.flo-remove-saved-card').attr('data-saved-id',$(this).data('id'));
            });
            $('.flo-remove-saved-card').off('click').on('click',function () {
                let obj = $(this);
                $.ajax({
                    url:"/ajax/savedcard/delete",
                    data:{'id':$(obj).data('saved-id')},
                    success:function() {
                        RG.Widget.reload('customer/savedcard');
						$('.flomodal').modal('hide').hide();
						$('.modal-backdrop').remove();
                        alert('Kredi kartınız silindi.');
                    }
                });
            });


           /* $('.delete-card').off('click').on('click',function () {
                var obj = $(this);
                var swalWithBootstrapButtons = Swal.mixin({
                    customClass: {
                        confirmButton: 'btn form-submit ml-2 mr-2',
                        cancelButton: 'btn form-submit mr-2 ml-2'
                    },
                    buttonsStyling: false,
                });


                swalWithBootstrapButtons.fire({
                    title: 'Emin misiniz?',
                    text: "Kredi kartınız silinecek.",
                    type: '',
                    showCancelButton: true,
                    confirmButtonText: 'Evet',
                    cancelButtonText: 'Vazgeç',
                    reverseButtons: true
                }).then(function (result) {
                    if (result.value) {
                        $.ajax({
                            url:"/ajax/savedcard/delete",
                            data:{'id':$(obj).data('id')},
                            success:function() {
                                swalWithBootstrapButtons.fire(
                                    {
                                        title: 'Kredi kartınız silindi.',
                                        text: "",
                                        type: 'success',
                                        showCancelButton: false,
                                        showConfirmButton: false,
                                        timer: 1500
                                    }
                                )
                                RG.Widget.reload('customer/savedcard');
                            }
                        });
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        Swal.close()
                    }
                })
            });*/

            $('.remove-saved-card').off('click.card').on('click.card', function (e) {
                e.preventDefault();

                var elem = $(this);

                RG.Overlay.block(RG.Translate.get('Siliniyor'));
                RG.Request.post(
                    '/ajax/savedcard/delete',
                    {
                        id: $(this).data('id'),
                    },
                    function (data) {
                        if (data.status) {
                            elem.closest('.items').remove();
                            RG.General.alert(data.success, RG.Overlay.unblock);
                        }
                    }, 'json'
                );
            });
        }
    },

    Facebook: {
        selector: '.facebook-login',
        init: function () {
            $(RG.Facebook.selector).on('click', function (e) {
                e.preventDefault();

                RG.Facebook.showFacebookLogin();
            });
        },

        showFacebookLogin: function () {
            FB.login(function (response) {
                if (response.authResponse) {
                    RG.Facebook.facebookConnect(response.authResponse.accessToken, response.authResponse.userID);
                } else {
                    RG.General.alert(RG.Translate.get("Facebook bilgileriniz doğrulanamadı, lütfen tekrar deneyiniz."));
                }
            }, {
                scope: 'public_profile,email'
            });
        },

        facebookConnect: function (accessToken, userId) {
            RG.Request.post("/ajax/customer/facebook", 'access_token=' + accessToken + '&social_id=' + userId, function (response) {
                if (response.success) {
                    if (response.data && response.data.redirect_to_register) {
                        window.location = '/customer/register';
                    } else {
                        // RG.General.alert(response.message);

                        RG.DataLayer.trigger("login", {response: response, facebookLogin: 1});
                        if(window.location.pathname=='/customer/register' || window.location.pathname=='/customer/login' || $('.login-page-wrapper.is-popup').length){
                            window.location = '/';
                        }
                        else{
                            window.location = '/checkout/address';
                        }

                    }
                } else {
                    RG.General.alert(response.message);
                }
            }, 'json')


        }
    },

    Coupon: {
        selector: '#cart-coupon, #customer-coupon',
        init: function () {
            $('#cart-coupon').off('submit').on('submit', function (e) {

				e.preventDefault();
				
				var couponCode = $('input[name="code"]').val();

                RG.Overlay.block(RG.Translate.get('Kupon uygulanıyor'));
                RG.Request.post(BASKET_BASE_URL + '/ajax/basket/addCoupon', $(this).serialize(), function (data) {
                    if (data.success) {
                        RG.General.alert(data.message, function () {
                            //RG.Widget.reload('basket/items');
                            RG.Widget.reload('basket/sidebar', [], RG.Overlay.unblock);
                            /*RG.Widget.reload('basket/mini_cart', 'load=1', function() {
                                RG.MiniCart.isLoaded = true;
                                return;
                            });*/
                        });
                        setTimeout(function(){
                            RG.Widget.reload('general/modal_installment_table', {price: RG.Basket.total},RG.Overlay.unblock);
						},2000);

						/* COUPON UPDATED */
						var customer = Object.assign({}, GtmDataLayer.get('customer'));

						if (!Object.keys(customer).length) { return; }
						if (!customer.coupons) { return; }

						var item;
						for (item in customer.coupons) {
							if (customer.coupons[item].code == couponCode) {
								customer.coupons[item].coupon_status = '0';
							}
						}

						GtmDataLayer.set('customer', customer);
                    } else {
						RG.General.alert(RG.Translate.get(data.message || 'Kupon Kullanılamadı'), RG.Overlay.unblock);
						RG.DataLayer.trigger('error', {
							action: 'Basket Error',
							message: data.message || 'Kupon Kullanılamadı',
						});
						
                    }
                }, 'json');
            });

            $('#cart-coupon-remove').off('click').on('click', function (e) {
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                RG.Overlay.block(RG.Translate.get('Kupon Kaldırılıyor'));
                RG.Request.post(BASKET_BASE_URL + '/ajax/basket/removeCoupon', $(this).serialize(), function (data) {
                    if (data.success) {
						RG.General.alert('Kupon Kaldırıldı.');
                        RG.Widget.reload('basket/sidebar', [], RG.Overlay.unblock);
                    }
                    setTimeout(function(){
                        RG.Widget.reload('general/modal_installment_table', {price: RG.Basket.total},RG.Overlay.unblock);
                    },2000)
                }, 'json');
            });
            $("#a-kayitli-kuponlarim").off("click").on("click",function(e){
                e.preventDefault();
                $(".basket-kayitli-kuponlarim").toggleClass("hidden");

            })
            $("button[id^='btn-kupon-kullan_']").off("click").on("click",function(e){
                e.preventDefault ? e.preventDefault() : (e.returnValue = false);
                var coupun_code = $(this).attr("id").replace('btn-kupon-kullan_','');
                $("input[name='code']").val(coupun_code);
            })
            $(".coupon-dropdown-content").off("click").on("click",function(){
                var $temp = $("<input>");
                $("body").append($temp);
                $temp.val($(this).parent().find("span").html()).select();
                document.execCommand("copy");
                $temp.remove();
            })
        }
    },
    RemoveProduct: {
        selector: '.close, .remove-product-from-cart, .remove-product-from-mini-cart',
        init: function () {
            $('.close, .remove-product-from-cart').off('click').on('click', function (e) {
                e.preventDefault();

				var id = $(this).data("id");
                var sku = $(this).data("sku");
				var update = $(this).data("update") ? $(this).data("update") : 0;

				// .close classı popupları kapatan class olduğu için eğer butonda id ya da sku yoksa
				// işleme devam etmiyor
				if (!id || !sku) { return; }

				$.cookie('cart-count', null, { expires: -1 });
                RG.Overlay.block(RG.Translate.get('Siliniyor'));
                RG.Request.post(BASKET_BASE_URL + '/ajax/basket/remove?item_id=' + id + '', $(this).serialize(), function (data) {

                    if (data.success) {
                        RG.DataLayer.trigger("remove_from_cart", {sku: sku, update: update});
                    }

                    if (data.message) {
                        RG.General.alert(data.message, function () {
                            RG.Widget.reload('basket/items');
                            RG.Widget.reload('basket/sidebar',[], RG.Overlay.unblock);
                        });
                    } else {
                        RG.Widget.reload('basket/items');
                        RG.Widget.reload('basket/sidebar', [], RG.Overlay.unblock);
                    }
                    if ($.cookie('cart-count') == 0) {
                        location.reload();
                    }

                }, 'json');
            });
            $('.close-minicart, .remove-product-from-mini-cart').off('click').on('click', function (e) {
                var id = $(this).data("id");
                var sku = $(this).data("sku");
                e.preventDefault();

				$.cookie('cart-count', null, { expires: -1 });
                RG.Overlay.block(RG.Translate.get('Siliniyor'));
                RG.Request.post(BASKET_BASE_URL + '/ajax/basket/remove?item_id=' + id + '', $(this).serialize(), function (data) {

                    if (data.success) {
                        RG.DataLayer.trigger("remove_from_cart", {sku: sku});
                    }

                    if (data.message) {
                        RG.General.alert(data.message, function () {
                            RG.MiniCart.ReloadMinicart(function () {
								RG.Overlay.unblock();

								$('body').trigger('change');
							});
                        });
                    } else {
                        RG.MiniCart.ReloadMinicart(RG.Overlay.unblock);
                    }

                }, 'json');
            });
        }
    },
    ChangeOption: {
        selector: '.optn',
        init: function () {

            $('.optn .select').off('click').on('click', function (e) {
                $(this).toggleClass('open');
                $(this).find('li').toggleClass('list-item');

            });
            $('.optn .select ul li.option:not(:first-child)').off('click').on('click', function (e) {


                var id = $(this).closest("tr").data("id");
                var sku = $(this).data("value");


                e.preventDefault();
                RG.Overlay.block(RG.Translate.get('Değiştiriliyor'));
                $('.optn .select ul li.option:first-child').text($(this).text());
                $.post(BASKET_BASE_URL + '/ajax/basket/change?sku=' + sku + '&item_id=' + id + '', $(this).serialize(), function (data) {

                    if (data.message) {
                        RG.General.alert(data.message, function () {
                            RG.Widget.reload('basket/items');
                            RG.Widget.reload('basket/sidebar', [], RG.Overlay.unblock);
                        });
                    } else {
                        RG.Widget.reload('basket/items');
                        RG.Widget.reload('basket/sidebar', [], RG.Overlay.unblock);
                    }
                }, 'json');
            });
        }
    },
    ChangeQty: {
        selector: '.qty ',
        init: function () {
            var qtyOld;
          //  $('.basket-button').removeClass('disabled');
            $('.qty .select').off('click').on('click', function (e) {
                $(this).toggleClass('open');
                $(this).find('li').toggleClass('list-item');
            });

            $('.qty .select ul li:first-child').off('click').on('click', function (e) {
                $(this).toggleClass('open');
                $(this).find('li').toggleClass('list-item');
                qtyOld = $(this).data("value");
                console.log(parseInt(qtyOld));
			});

			var qtyChange = function (qty, e) {
				var diff = qty - qtyOld;

                /* The maximum order quantity is 8 */
                console.log(parseInt(qty));
                console.log(parseInt($.cookie('cart-count')));
                console.log(parseInt($.cookie('cart-count')) - (parseInt(qtyOld) - parseInt(qty)));

                if (8 < parseInt($.cookie('cart-count')) - (parseInt(qtyOld) - parseInt(qty))) {

                    RG.General.alert(RG.Translate.get('Maksimum 8 adet ürün satın alabilirsiniz.'));
                } else {
                    var id = $(this).closest('tr').data('id');
                    var sku = $(this).closest('tr').data('sku');

                    e.preventDefault();
                    RG.Overlay.block(RG.Translate.get('Değiştiriliyor'));
                    RG.Request.post(BASKET_BASE_URL + '/ajax/basket/update?qty=' + qty + '&item_id=' + id + '', $(this).serialize(), function (data) {
                        var product = GtmDataLayer.get('cartItem' + sku);
                        if (diff > 0) {
                            RG.DataLayer.trigger("add_to_cart", {product: product, quantity: diff, sku: sku, update: 1});
                        } else {
                            RG.DataLayer.trigger("remove_from_cart", {quantity: -diff, sku: sku, update: 1});
                        }

                        // $('.qty .select ul li.option:first-child').text(qty);
                        if (data.message) {
                            RG.General.alert(data.message, function () {
                                RG.Widget.reload('basket/items');
                                RG.Widget.reload('basket/sidebar', [], RG.Overlay.unblock);
                            });
                        } else {
                            RG.Widget.reload('basket/items');
                            RG.Widget.reload('basket/sidebar', [], RG.Overlay.unblock);
                        }
                    }, 'json');
                }
			}

			$('select[name="qty_select"]').off('change').on('change', function (e) {
				qtyChange.call(this, $(this).val(), e);
			});

            $('.qty .select ul li.option:not(:first-child)').off('click').on('click', function (e) {
				var qty = $(this).data("value");
				qtyChange.call(this, qty, e);
            });
        }
    },
    validation: {
        init: function(element) {
            if($.fn.validationEngine)
            {
                $(element).validationEngine('attach', { maxErrorsPerField:1 });
            } else if($.fn.validate) {
                return $(element).valid();
            }
        },
        validate: function(element) {
            if($.fn.validationEngine)
            {
                return $(element).validationEngine('validate');
            } else if($.fn.validate) {
                return $(element).valid();
            }
        }
    },
    cookiePolicy: {
        selector: '.cookie-policy',
        init: function () {
            var cookies_policy = RG.General.getCookie("policy");
            var pushStateArr = window.location.href.split('?');
            var isCheckoutOrBasket = wordInString(pushStateArr[0], 'checkout') || wordInString(pushStateArr[0], 'basket');

            if (!cookies_policy && !isCheckoutOrBasket && window.location.pathname === '/') {
                $(".cookie-policy").removeClass('hide');
            }

            $('.cookie-close').off('click').on('click', function (e) {
                RG.General.setCookie("policy", 1, 30);
            });
        }
    },
    sizeQty: {
        selector: '.size-qty .widget_basket_sidebar',
        init: function () {
			/* Step 1 SEPET in payment */
            $('.size-qty .widget_basket_sidebar .linkto ').off('click').on('click', function (e) {

                var stocks = $('.qty .qty-select .option:first-child');
                var zero_stock = 0;
                $.each(stocks, function(i, item) {
                    if($(item).data('value') == 0) {
                        zero_stock++;
                    }
                });

                if(zero_stock > 0) {
					RG.General.alert('Sepetinizdeki '+zero_stock+' ürünün stoğu tükenmiş. Bu ürünleri sepetinizden çıkarmadan bir sonraki adıma ilerleyemezsiniz.');
					RG.DataLayer.trigger('error', {
						action: 'Stock Error',
						message: 'Sepetinizdeki '+zero_stock+' ürünün stoğu tükenmiş. Bu ürünleri sepetinizden çıkarmadan bir sonraki adıma ilerleyemezsiniz.',
					});
                } else {
					RG.Overlay.block('');
                    window.location.href = '/checkout/shipping';
                }

            })
        }
    },

    ChangeAddress: {
        selector: '.widget_checkout_address',
        click_collect: false,
        storeCity: [],
        storeState: [],
        selectedShop: [],
        getTelephoneFromAddress: function(){
            var tem_data;
            $.ajax({
                async: false,
                type: 'POST',
                url: BASKET_BASE_URL + '/ajax/basket/addressTelephone',
                success: function(data) {
                    tem_data = data;
                }
            });
            return tem_data;
        },
        init: function () {
            RG.Basket.is_cash_on_delivery = 0;
            RG.Basket.prepareSidebar();
            var guest = RG.General.getCookie('guest');

            if (guest) {
                guest = decodeURIComponent(guest);
                guest = JSON.parse(guest);

                $('#guest_email').val(guest.email);
                $('#firstname').val(guest.firstname);
                $('#lastname').val(guest.lastname);
                guest_email_ajax = +'&email=' + guest.email;
            } else {
                $('.field-name-email').addClass("hidden");
                guest_email_ajax = '';
            }

            var shipping_address = '';
            var billing_address = '';
            var same_billing_address = '';
            var same_as_shipping = 0;

            RG.General.setCookie("shipping-method", 'FloShippingMng');
            $("#selected-ship-address").on("change", function (event) { // saved address
                var data = $("#selected-ship-address option:selected").data();

                for (var i in data) {
                    shipping_address += ('&shipping_address[' + i + ']=' + data[i]) + guest_email_ajax;
                    same_billing_address += ('&billing_address[' + i + ']=' + data[i]) + guest_email_ajax;
                };
                RG.Widget.reload('checkout/shipping_methods', shipping_address);
            });

            $("#selected-bill-address").on("change", function (event) { // saved address
                var data = $("#selected-bill-address option:selected").data();

                for (var i in data) {
                    billing_address += ('&billing_address[' + i + ']=' + data[i]) + guest_email_ajax;
                }
			});
			
			$('.custom-shipping-address').on('change', function () {
				$('#selected-ship-address option').removeAttr('selected').filter('[data-id="'+ $(this).attr('data-id') +'"]').attr('selected', 'selected');
                var data = $("#selected-ship-address option:selected").data();

                for (var i in data) {
                    shipping_address += ('&shipping_address[' + i + ']=' + data[i]) + guest_email_ajax;
                    same_billing_address += ('&billing_address[' + i + ']=' + data[i]) + guest_email_ajax;
                };
                RG.Widget.reload('checkout/shipping_methods', shipping_address);
			})
            $('.custom-billing-address').on('change', function () {
                $('#selected-bill-address option').removeAttr('selected').filter('[data-id="'+ $(this).attr('data-id') +'"]').attr('selected', 'selected');
                var data = $("#selected-bill-address option:selected").data();

                for (var i in data) {
                    billing_address += ('&billing_address[' + i + ']=' + data[i]) + guest_email_ajax;
                }
            })

            $("#ship-shop-tab").off('click').on('click', function (e){  // click collect
                RG.ChangeAddress.click_collect = true;
                RG.General.setCookie("shipping-method", 'ClickCollect');
                RG.Widget.reload('basket/sidebar', [], RG.Overlay.unblock);

                $('#self-firstname').keypress(function(e) {
                    var tval = $('#self-firstname').val();
                    if(tval.length > 20){
                        return false;
                    }
                });

                $('#self-lastname').keypress(function(e) {
                    var tval = $('#self-lastname').val();
                    if(tval.length > 20){
                        return false;
                    }
                });


                if(RG.ChangeAddress.storeCity.length == 0){
                    $.ajax({
                        async: false,
                        type: 'POST',
                        url: BASKET_BASE_URL + '/ajax/basket/getStoreCity',
                        success: function(data) {
                            RG.ChangeAddress.storeCity = data;
                        }
                    });
                } // get city list

                $.each(RG.ChangeAddress.storeCity, function(key, value) {
                    $('#ship-shop #city')
                        .append($("<option></option>")
                            .attr("value",value.city)
                            .text(value.city));
                }); // fill city

                $('#ship-shop #city').change(function (e) {
                    $('#ship-shop #district')
                        .find('option')
                        .remove()
                        .end();
                    $.ajax({
                        async: false,
                        type: 'GET',
                        url: BASKET_BASE_URL + '/ajax/basket/getStoreState?city='+this.value,
                        success: function(data) {
                            RG.ChangeAddress.storeState = data;
                        }
                    });
                    $.each(RG.ChangeAddress.storeState, function(key, value) {
                        $('#ship-shop #district')
                            .append($("<option></option>")
                                .attr("value",value.state_province)
                                .text(value.state_province));
                    });
                }); // get region by city and fill list

                $('.search-shop').click(function () {
                    var selectedCity = $('#ship-shop #city').val();
                    var selectedState = $('#ship-shop #district').val();
                    RG.ChangeAddress.selectedShop = [];
                    if(selectedCity.length == 0){
                        RG.General.alert('Lütfen Önce İl Seçin!');
                        $('.show-on-map').hide();
                        return false;
                    }
                    if (selectedState.length == 0) {
                        RG.General.alert('Lütfen Önce İlçe Seçin!');
                        $('.show-on-map').hide();
                        return false;
                    }
                    $('.show-on-map').show();
                    var storeStreet = [];
                    $('.shop-list .row').empty();

                    $.ajax({
                        async: false,
                        type: 'GET',
                        url: BASKET_BASE_URL + '/ajax/basket/getStoreByCityAndState?city='+selectedCity+'&state='+selectedState,
                        success: function(data) {
                            storeStreet = data;
                        }
                    });

                    $.each(storeStreet, function() {
                        $('.shop-list .row').append(
                            '<div class="col-sm-12" data-location-id="'+this.location_id+'">\n' +
                                '<div class="address-card mb-2"\n' +
                                    'data-map="http://maps.google.com/maps?q='+this.latitude+','+this.longitude+'">\n' +
                                    '<label class="flo-radio">\n' +
                                        '<input type="radio" class="select-shop" name="shop_selection"><i></i>\n' +
                                        '<div class="text-holder">\n' +
                                            '<h5 class="text-warning">'+this.name+'</h5>\n' +
                                                '<p>'+this.street+'<br>'+this.city+' / Türkiye<br>'+this.state_province+' / '+this.city+' / Türkiye</p>\n' +
                                        '</div>\n' +
                                    '</label>\n' +
                                '</div>\n' +
                            '</div>')
                    });
                    $('.select-shop').click(function () {
                        RG.ChangeAddress.selectedShop = $(this).parent().parent().parent().data('location-id');
                    });
                }); // when click show shop get shop list

                $("#selected-bill-address-click-collect").on("change", function (event) { // saved address
                    var data = $("#selected-bill-address-click-collect option:selected").data();
                    for (var i in data) {
                        billing_address += ('&billing_address[' + i + ']=' + data[i]) + guest_email_ajax;
                    }
                });
            });

            $('#delivery-address-tab').off('click').on('click', function (e){ // click collect
                RG.ChangeAddress.click_collect = false;
                RG.General.setCookie("shipping-method", 'FloShippingMng'); /* TODO: birden fazla kargo şirketi seçtiğinde set edilecek */
                RG.Widget.reload('basket/sidebar', [], RG.Overlay.unblock);
            });

			$('.widget_checkout_address .linkto').off('click').on('click', function (e) {  // click button
				RG.Overlay.block();
                /* Step 2 ADRES in payment */
                // window.stop();
                if(!RG.ChangeAddress.click_collect) {
                    RG.validation.init($("#addresses-form"));
                    if(! RG.validation.validate($("#addresses-form"))){
						RG.Overlay.unblock();
                        return false;
					}
										
					if ($('.corporate-bill').hasClass('active')) {
                        $('.corporate-infos').find('input').each(function (i) {
							// Bu parametreler kullanılmıyor..
							
                            // shippingparams += ('&shipping_address[' + $(this).attr('name') + ']' + "=" + $(this).val());
                            // billingparams += ('&billing_address[' + $(this).attr('name') + ']' + "=" + $(this).val());
                        });
                    }
                    if (shipping_address == '') { // saved address
                        var data = $('#selected-ship-address option:selected').data();
                        for (var i in data) {
                            shipping_address += ('&shipping_address[' + i + ']=' + encodeURIComponent(data[i])) + guest_email_ajax;
                            same_billing_address += ('&billing_address[' + i + ']=' + encodeURIComponent(data[i])) + guest_email_ajax;
                        };
                    }

                    if ($('#ship_same').hasClass('checked') || $('#ship_same').hasClass('active')  ) {
                        billing_address = same_billing_address;
                        same_as_shipping = 1;
                    }

                    if (billing_address == '') { // saved address
                        var data = $('#selected-bill-address option:selected').data();
                        for (var i in data) {
                            billing_address += ('&billing_address[' + i + ']=' + encodeURIComponent(data[i])) + guest_email_ajax;
                        };
                    }

                    var form_data = $('#addresses-form').serialize();
                    let shipping_choice  = '';
                    let billing_choice  = '';

                    // flo da vergi numarasi ayrı form oldugundan
                    let invoice_method = null;
                    if($("#addresses-form").find("input[name='billing_invoice']").length > 0){
                        invoice_method = $("input[name='billing_invoice']").is(':checked') == true ? 1 : 2;
                        let tax_number = $("input[name='tax_number']").val();
                        let company_name = $("input[name='company']").val();
                        let tax_office = $("input[name='tax_office']").val();
                        if(invoice_method == "2"){
                            tax_number = "";
                            company_name = "";
                            tax_office = "";
                        }

                        shipping_choice += "&shipping_address[tax_number]="+tax_number;
                        shipping_choice += "&shipping_address[company_name]="+company_name;
                        shipping_choice += "&shipping_address[tax_office]="+tax_office;

                        billing_choice += "&billing_address[tax_number]="+ tax_number;
                        billing_choice += "&billing_address[company_name]="+ company_name;
                        billing_choice += "&billing_address[tax_office]="+ tax_office;
                        form_data += shipping_choice + '&invoice_method=' + invoice_method;
                        form_data += billing_choice;
                        if(shipping_address != ''){
                            shipping_address += shipping_choice + '&invoice_method=' + invoice_method;
                            billing_address += billing_choice;
                        }
                    }

                    var defaultShippingMethod = RG.General.getCookie('shipping-method');
                    var shipping_method = '';
                    shipping_method = $('input[name=shipping_method]:checked', '.shipping-method').val();
                    /*
                    if ($('input[name=shipping_method]:checked', '.shipping-method').val() == null) {
                        shipping_method = defaultShippingMethod;
                    } else {
                        shipping_method = $('input[name=shipping_method]:checked', '.shipping-method').val();
                    }
                     */

                    var url = BASKET_BASE_URL + '/ajax/basket/setDelivery?' + shipping_address + '&' + billing_address + '&shipping_method=' + shipping_method;
                    var post_data = $(this).serialize();
                /*    if($("input[name='billing_choice']").is(':checked')){
                        post_data += billing_choice;
                    }*/

                    if (shipping_address === '') {
                        url = BASKET_BASE_URL + '/ajax/basket/setDelivery?same_as_shipping=' + same_as_shipping + '&shipping_method=' + shipping_method;
                        post_data = form_data;
					}

					var $giftPackage = $('input[name="gift_package"]');
					if ($giftPackage.length && $giftPackage.prop('checked')) {
						var giftMessage = $('textarea[name="gift_message"]').val();
						var receiverRame = $('input[name="receiver_name"]').val();

						if(!giftMessage || !receiverRame) {
							RG.Overlay.unblock();
							return window.alert('Hediye notunuzun alıcı adını ve mesajınızı giriniz');
						} 

						url += '&gift_message=' + giftMessage + '&receiver_name=' + receiverRame;
					}

                    RG.Request.post(url, post_data, function (data) {
                        if (data.success) {
                            window.location.href = '/checkout/payment';
                        } else {
							RG.Overlay.unblock();
							RG.General.removeDisabled();
                            RG.General.alert(data.message, function () {

							});
							
							RG.DataLayer.trigger('error', {
								action: 'Shipping Error',
								message: data.message,
							});
                        }
                    }, 'json');
                } else {
                    var selectedShop = [];
                    if(RG.ChangeAddress.selectedShop.length == 0){
						RG.Overlay.unblock();
						RG.General.alert('Teslimat Adresi İçin Lütfen Bir Mağaza Seçin!');
						
						RG.DataLayer.trigger('error', {
							action: 'Shipping Error',
							message: 'Teslimat Adresi İçin Lütfen Bir Mağaza Seçin!',
						});

                        return false;
                    }
                    $.ajax({
                        async: false,
                        type: 'GET',
                        url: BASKET_BASE_URL + '/ajax/basket/getShopById?id='+RG.ChangeAddress.selectedShop,
                        success: function(data) {
                            selectedShop = data;
                            if (!selectedShop){
                                return window.alert('Mağaza Seçilirken Bir Hata Oluştu!');
                            }
                            if(selectedShop.length < 1){
                                return window.alert('Mağaza Seçilirken Bir Hata Oluştu!');
                            }
                        }
                    });
                    var customer_firstname = $('#self-firstname').data('firstname');
                    var customer_lastname = $('#self-lastname').data('lastname');
                    var customer_phone = $('#self-phone').data('phone');
                    var customer_email = $('#self-firstname').data('customer-email');

                    var firstname = customer_firstname;
                    var lastname = customer_lastname;
                    var phone = customer_phone;
                    if(!$('#receive-myself').parent().hasClass('active')){
                        firstname = $('#self-firstname').val();
                        lastname = $('#self-lastname').val();
                        phone = $('#self-phone').val();
                    }

                    if(firstname.length == 0){
						RG.Overlay.unblock();
						RG.General.alert('Alıcı İsmi Boş Bırakılamaz');
						
						RG.DataLayer.trigger('error', {
							action: 'Shipping Error',
							message: 'Alıcı İsmi Boş Bırakılamaz',
						});

                        return false;
                    }
                    if(lastname.length == 0){
						RG.Overlay.unblock();
						RG.General.alert('Alıcı Soyismi Boş Bırakılamaz');
						
						RG.DataLayer.trigger('error', {
							action: 'Shipping Error',
							message: 'Alıcı Soyismi Boş Bırakılamaz',
						});
                        return false;
                    }
                    if(phone.length == 0){
						RG.Overlay.unblock();
						RG.General.alert('Alıcı Telefon Numarası Boş Bırakılamaz');
						
						RG.DataLayer.trigger('error', {
							action: 'Shipping Error',
							message: 'Alıcı Telefon Numarası Boş Bırakılamaz',
						});
                        return false;
                    }

                    if(firstname.length > 20){
						RG.Overlay.unblock();
						RG.General.alert('İsim Alanı 20 Karakterden Fazla Olamaz');
						
						RG.DataLayer.trigger('error', {
							action: 'Shipping Error',
							message: 'İsim Alanı 20 Karakterden Fazla Olamaz',
						});
                        return false;
                    }

                    if(lastname.length > 20){
						RG.Overlay.unblock();
						RG.General.alert('Soyisim Alanı 20 Karakterden Fazla Olamaz');
						
						RG.DataLayer.trigger('error', {
							action: 'Shipping Error',
							message: 'Soyisim Alanı 20 Karakterden Fazla Olamaz',
						});
                        return false;
                    }

                    shipping_address = 'shipping_address[street]='+selectedShop.name + ' - ' +selectedShop.street+'&' +
                        'shipping_address[region]='+selectedShop.city+'&' +
                        'shipping_address[telephone]=08502903356&' +
                        'shipping_address[postcode]=&' +
                        'shipping_address[city]='+selectedShop.state_province+'&' +
                        'shipping_address[email]='+customer_email+'&' +
                        'shipping_address[lastname]='+customer_lastname+'&' +
                        'shipping_address[firstname]='+customer_firstname+'&' +
                        'shipping_address[click_collect_store_code]='+selectedShop.cc_sap_store_id+'&' +
                        'shipping_address[click_collect_buyer_firstname]='+firstname+'&' +
                        'shipping_address[click_collect_buyer_lastname]='+lastname+'&' +
                        'shipping_address[click_collect_buyer_phone]='+phone;

                    if (billing_address == '') { // saved address
                        var data = $('#selected-bill-address-click-collect option:selected').data();
                        for (var i in data) {
                            billing_address += ('&billing_address[' + i + ']=' + encodeURIComponent(data[i]));
                        };
                    }
                    if(billing_address == ''){
						
						var $billingForm = $('#addresses-form-click-collect');

						if(! RG.validation.validate($billingForm)){
							RG.Overlay.unblock();
							return false;
						}

                        billing_address = $billingForm.serialize();
					}
					
                    shipping_method = 'ClickCollect';
                    var url = BASKET_BASE_URL + '/ajax/basket/setDelivery?' + shipping_address + '&' + billing_address + '&shipping_method=' + shipping_method;
                    var post_data = $(this).serialize();

					RG.Overlay.block();
                    RG.Request.post(url, post_data, function (data) {
                        if (data.success) {
                            RG.General.setCookie("shipping-method", 'ClickCollect');
                            RG.Widget.reload('basket/sidebar', [], RG.Overlay.unblock);
                            window.location.href = '/checkout/payment';
                        } else {
							RG.Overlay.unblock();
                            RG.General.removeDisabled();
                            RG.General.alert(data.message, function () {

							});
							
							RG.DataLayer.trigger('error', {
								action: 'Shipping Error',
								message: data.message,
							});
                        }
                    }, 'json');
                }
            });

            $('#ship_same').off('click').on('click', function () {
                $('#ship_same').toggleClass('checked');
                if ($('#ship_same').hasClass('checked')) {
                    $('#bill-address').addClass('hidden');
                } else {
                    $('#bill-address').removeClass('hidden');
                }
            });

            $('#addresses-form-click-collect #city_shipping_address').off('change').on('change', function () {
                RG.Widget.reload('checkout/shipping_methods', $('#addresses-form').serialize());
            });

            $('#e_bill').off('click').on('click', function (e) {
                e.preventDefault();

                if ($(this).parent().hasClass("checked") == true) {
                    $("#kurumsal-fatura").addClass("hidden");
                } else {
                    $("#kurumsal-fatura").removeClass("hidden");
                }
            });

            $("#varsayilan-adres-duzenle, .varsayilan-adres-duzenle").off('click').on('click', function () {

                var ad_id = $('#selected-ship-address option:selected').data('id');
      if($(this).hasClass('edit-address')){
         var ad = $('#selected-ship-address option:selected');
         $(".edit-address-form ").find('input[name=firstname]').val( ad .data('firstname'));
         $(".edit-address-form ").find('input[name=lastname]').val( ad .data('lastname'));
         $(".edit-address-form ").find('input[name=telephone]').val( ad .data('telephone'));
         $(".edit-address-form ").find('textarea[name=street]').val( ad .data('street'));
         $(".edit-address-form ").find('input[name=title_address]').val( ad .data('title'));
         region=ad .data('region_id');
         var cityName=ad .data('city');

         // console.log($(".edit-address-form ").find('select option[data-region-id="1488"]'))

         $(".edit-address-form ").find('select option[data-region-id='+region+']').attr('selected', 'selected');
         //    var key = $(this).data('key');
         //  $('#region_id_' + key).val($(this).find(':selected').data('region-id'));
         var key= $(".edit-address-form ").find('select option[data-region-id='+region+']').data('key');
         RG.Request.post(
             '/ajax/address/getTownsByRegionId',
             {
                 id:$(".edit-address-form ").find('select option[data-region-id='+region+']').data('region-id')
                 //$(this).find(':selected').data('region-id')
             },
             function (data) {

                 if (data.success) {

                     //  var city = $('#city_''+ id+'').empty();
                     var city = $('#city_').empty();

                     $.each(data.data, function (i,item) {
                         if(cityName===item.default_name){

                             city.append('<option >item.default_name</option>');
                         }else{
                             city.append($("<option />").val(item.default_name).text(item.default_name ));

                         }
                     })
                     //  city.niceSelect('update');
                 } else {
					 RG.General.alert(data.message);

					RG.DataLayer.trigger('error', {
						action: 'Shipping Error',
						message: data.message,
					});
                 }

             }, 'json'
         );
     }else{
         window.location.href = "/checkout/address/edit?id=" + ad_id;
     }


            });

            $("#fatura-adres-duzenle").off('click').on('click', function () {
                var ad_id = $('#selected-bill-address option:selected').data('id');
                window.location.href = "/checkout/address/edit?id=" + ad_id;
            })
        }
    },
    payment: {
        selector: '.checkout-payment',
        activationIsEnable: false,
        init: function () {
            $(".icbtn").off('click').on("click", function () {
                $(this).toggleClass("checked");
            });

            if ($(".icbtn").hasClass("checked")) {

            }

            RG.Basket.is_cash_on_delivery = 0;
            RG.Basket.prepareSidebar();

            var use_saved_cart = false;
            var selected_saved_card_id = 0
            // var save_my_card = 0;
            var d3_secure = 0;
            if ($('#3d-secure').hasClass('checked')||$('#3d-secure').hasClass('active') || $('#3d-secure').children().is(':checked')) {
                d3_secure = 1;
            }
            $('#3d-secure').on('change', function (e) {
                if ($(this).hasClass('checked')||$(this).hasClass('active') || $(this).children().is(':checked')) {
                    d3_secure = 1

                } else {
                    d3_secure = 0;
                }
                $.cookie('d3_secure', d3_secure);
            })

            if ($('.use-saved-cart').attr('hidden')) {
                use_saved_cart = false;
            } else {
                use_saved_cart = true;
                // save_my_card = 0;
                selected_saved_card_id = $("#saved-card-list option:selected").data('id');
                selected_saved_card_platform = $("#saved-card-list option:selected").data('platform');
                if ($('.cc_installment ul.list li').length == 1) {
                    RG.payment.prepareInstallment('platform', selected_saved_card_platform);
                }
                $('#saved-card-list').off('change').on('change', function (e) {
                    selected_saved_card_id = $("#saved-card-list option:selected").data('id');
                    selected_saved_card_platform = $("#saved-card-list option:selected").data('platform');
                    RG.payment.prepareInstallment('platform', selected_saved_card_platform);
                });

                $('.continue-new-card').off('click').on('click', function (e) {
                    setTimeout(function(){
                        $(".card-numbers").focus();
                    },300)

                    use_saved_cart = false;
                    $('.use-saved-cart').attr('hidden', true);
                    $('.use-card-number').removeAttr('hidden');
                    $('.save-card').removeAttr('hidden');
                    $('.continue-saved-card').remove();
                    $('.use-card-number').append('<a class="continue-saved-card fl-right" href="javascript:void(0);">Kayıtlı Kart İle Devam Et</a>');

                    $('.continue-saved-card').off('click').on('click', function (e) {
                        use_saved_cart = true;
                        $('.use-card-number').attr('hidden', true);
                        $('.save-card').attr('hidden', true);
                        $('.use-saved-cart').removeAttr('hidden');
                        $('.credit-card-box .number').text('');
                        $('.credit-card-box .card-expiration-date').text('');
                        $('.credit-card-box .card-type').text('');
                        $('.credit-card-box .ccv').text('');

                        selected_saved_card_platform = $("#saved-card-list option:selected").data('platform');
                        RG.payment.prepareInstallment('platform', selected_saved_card_platform);
                    })
                })
			}
			
			$('#save-card-command').on('click', function (e) {
				var save_my_card = 0;

				if ($(this).hasClass('checked') || $(this).children().is(':checked')) {
					save_my_card = 1;
				}

				$.cookie('creditcard_saved', save_my_card);
			});

            $('.checkout-payment .linkto').off('click').on('click', function (e) {
                /* Step 3 ODEME in payment */
                //  window.stop();
             if($(this).hasClass('flo-theme')&&(!$('.iread').hasClass('active'))){
				 $('.note-basket-required').addClass('d-block');
				 $(document).trigger('checkout.agreement.fail');
                 e.stopPropagation() }
              else {
                var payment_info = "";
                var payment_method = "";
                var method_name = "";
                var cc_date = $(".cc_date span").text();
                var cc_installment = $(".cc_installment span").data('value');
                 if($(this).hasClass('flo-theme-desktop')) {var cc_installment = $(".cc_installment tr.selected-installment").data('value');}

                 selected_saved_card_id = $("#saved-card-list option:selected").data('id');
                $('.online input').each(function () {
                    payment_info += ("&" + $(this).data('name') + "=" + $(this).val());
                });

                $('.nav-tabs li.active  input').each(function () {
                    payment_method += ($(this).data('name') + "=" + $(this).val());
                    method_name = $(this).val();
                });
                if (method_name == "cashondelivery"){

                    RG.validation.init($("#kapida-odeme"));
                    if(! RG.validation.validate($("#kapida-odeme"))){
                        return false;
                    }

					RG.Overlay.block();
					$.ajax({
                        async: false,
                        type: 'POST',
						url: BASKET_BASE_URL + '/ajax/basket/activationIsEnable',
                        success: function(data) {
							RG.Overlay.unblock();

							if(data.value == 1){
                                RG.payment.activationIsEnable = true;
                            }
						}
                    });

                    if(RG.payment.activationIsEnable == true){
                        // $('#clicksmsactivation').trigger('click');
                        RG.payment.smsActivation(payment_method);
                        return false;
                    }
                }

               // if (!$(".checkout-payment .basket-container").hasClass("disabled")) {

                    RG.validation.init($("#cc_cart_info"));
                    if(! RG.validation.validate($("#cc_cart_info"))){
                        return false;
                    }

                    RG.Overlay.block(RG.Translate.get('Ödeme gerçekleştiriliyor'));

					var query = '';
					var $saveCardCommand = $('#save-card-command');
					var save_my_card = $saveCardCommand.children().is(':checked') || $saveCardCommand.hasClass('checked') ? '1' : '0';

					$.cookie('creditcard_saved', save_my_card);

                    if (use_saved_cart) {
                        query = payment_method + payment_info + '&card_id=' + selected_saved_card_id + '&installment=' + cc_installment + '&3d_secure=' + d3_secure;
                    } else {
                        query = payment_method + payment_info + '&cc_date=' + cc_date + '&installment=' + cc_installment + '&cc_saved_card=' + save_my_card + '&3d_secure=' + d3_secure;
					}

					$.cookie('is_use_saved_card', use_saved_cart ? '1' : '0');

                    RG.Request.post(BASKET_BASE_URL + '/ajax/basket/setPayment', $(this).serialize() + '&' + query, function (data) {

                        if (data.success) {
                            var redirectUrl = '/checkout/success?order_id=' + data.order_id + '&hsh=' + data.hash;
                            if (data.redirect) redirectUrl = data.redirect;
                            window.location.href = redirectUrl;
                        } else {
                            RG.General.removeDisabled();
                            RG.General.alert(data.message, RG.Overlay.unblock);
							
							RG.DataLayer.trigger('error', {
								action: 'Payment Error',
								message: data.message,
							});

                            if (data.redirect) {
                                window.location.href = data.redirect;
                            }
                        }
                    }, 'json');
               /* }
                else{
                    var methodx = $('li.active .payment-method-choice ').data('method');
                    if(methodx=='cashondelivery'){
                        if( !$('.iread-cash').hasClass('checked')) {
                            $('.note-basket').fadeIn();
                        }
                    }
                    else{
                        if( !$('.iread-payu').hasClass('checked')) {
                            $('.note-basket').fadeIn();
                        }
                        else{
                            $('.note-basket-required').fadeIn();

                        }
                    }
            }*/
            }});


            $(".payment-method-choice").off('click').on("click", function () {
                var method = $(this).data('method');
                if (method == 'cashondelivery') {
                    RG.Basket.is_cash_on_delivery = 1;
                    $('.cashondelivery-label').show();
                    if ($('.cashondelivery-label').parent().is("tr")) {
                        $('.cashondelivery-label').parent().show();
                    }
                    $('.cash-text').show();
                } else {
                    RG.Basket.is_cash_on_delivery = 0;
                    if ($('.cashondelivery-label').parent().is("tr")) {
                        $('.cashondelivery-label').parent().hide();
                    }
                    $('.cash-text').hide();
                    $('.cashondelivery-label').hide();
                }
                RG.Basket.prepareSidebar();
                RG.Basket.prepareInstallmentSelect();
                RG.payment.setMethod(method);
            });

            $(".card-numbers").off("focusout").on("focusout", function () {
                var ccnum = $("input[data-name*='cc_number']").val();
                 RG.payment.prepareInstallment('number', ccnum);
                RG.Basket.prepareSidebar();
                RG.Basket.prepareInstallmentSelect();
            });
            $("#mesafeli-satis-sozlesmesi,#mesafeli-satis-sozlesmesi2").click(function () {
                $('html, body').animate({scrollTop: $(".widget_checkout_agreement1").offset().top}, 'slow');
            })
            $("#on-bilgilendirme-sozlesmesi,#on-bilgilendirme-sozlesmesi2").click(function () {
                $('html, body').animate({scrollTop: $(".widget_checkout_agreement2").offset().top}, 'slow');
            })
            $("#saved-card-list").trigger("change");
        },
        installment: function (ins) {
            var id = ins || 0;

            RG.Request.post(BASKET_BASE_URL + '/ajax/basket/setInstallment?installment=' + id, function (data) {
                if (data.success) {
                    $('.cc_installment>span.current').data('value', id);
                    if($('.list').hasClass('flo-theme-desktop')) {var cc_installment = $(".cc_installment tr.selected-installment").data('value', id);}

                    // RG.Widget.reload('general/modal_installment_table', {price: data.response.grand_total});
                }
            });
        },
        prepareInstallment: function (key, value) {
            var requestPath = '';
            if (key == 'number')
                requestPath = BASKET_BASE_URL + '/ajax/basket/installments?cc_number=' + value;

            if (key == 'platform')
                requestPath = BASKET_BASE_URL + '/ajax/basket/installmentsByPlatform?platform=' + value;


            RG.Request.post(requestPath, function (data) {
                if (data.message) {
                    RG.General.alert(data.message, function () {
					});
					
					RG.DataLayer.trigger('error', {
						action: 'Payment Error',
						message: data.message,
					});
                }

                if (data.installments.length) {
                    var installments = data.installments;
                    var target = $('.cc_installment');
                    $('span.current', target).data('value', installments[0].installment).html(installments[0].label);
                    var list = $('.list', target);
                    list.html('');
                    var total = $('span.generic-total').html().replace(' ' + RG.Translate.get('TL'), '').replace(',', '#').replace('.', '').replace('#', '.');

                    $.each(installments, function (i, item) {
                        var perMonth = RG.General.round(((total * (1 + (item.rate / 100))) / item.installment), 2);

                        var installmentRateWithMonth = [];
                        installmentRateWithMonth[item.installment] = item.installment * perMonth;
                        var label = item.label + " ( " + item.installment + "x " + perMonth + " " + RG.Translate.get('TL') + " )";
                        var id = item.id;
                        var value = item.installment;
                        if (i === 0) {
                            label = "Tek Çekim";
                            id = 0;
                            value = 1;
                        }
                        var li_installment='';
if (list.hasClass('flo-theme-desktop'))
{
      li_installment=$('<tr data-id="' + id + '" data-value="' + value + '" data-rate="' + item.rate + '" class="   option focus' + (i === 0 ? ' selected-installment' : '') + ' " > <td> <label class="flo-radio mb-0 text-gray"><input type="radio" name="installment" ' + (i === 0 ? ' checked=""' : '') + ' > <i></i><div class="text-holder d-flex justify-content-between">'+label+' </div></label></td></tr>');

}
else{
    li_installment=  $('<li data-id="' + id + '" data-value="' + value + '" data-rate="' + item.rate + '" class="installment-item option focus' + (i === 0 ? ' selected' : '') + '">' + label + '</li>');

}

                        li_installment.on('click', function () {
                            if($(this).parent().hasClass('flo-theme-desktop')) {
                                $('tr').removeClass('selected-installment');
                                $(this).addClass('selected-installment');
                            }


                                var item = $(this);
                                 RG.Basket.is_installment_set = item.data('value');

                                RG.Basket.prepareSidebar(item.data('rate'));

                                RG.payment.installment(item.data('id'));
                            }).appendTo(list);
                    });

                    RG.payment.installment();
				}
				
				$(document).trigger('checkout.installments.response', {
					data: data,
				});
            }, 'json');
        },
        setMethod: function (method) {
            RG.Request.post(BASKET_BASE_URL + '/ajax/basket/setPaymentMethod?method=' + method, function (data) {
                if (data.message) {
                    RG.General.alert(data.message, function () {
					});

					RG.DataLayer.trigger('error', {
						action: 'Payment Error',
						message: data.message,
					});
                }

                if (data.success) {
                    //RG.Widget.reload('basket/items');
                    //RG.Widget.reload('basket/sidebar');
                }
            }, 'json');
        },
        smsActivation: function (payment_method) {			
            var addressInfo = RG.ChangeAddress.getTelephoneFromAddress();
            var phone = addressInfo.telephone;
            var params = '?phone='+phone;

            $.ajax({
                type: 'POST',
                url: BASKET_BASE_URL + '/ajax/basket/sendActivationSms'+params,
                asyn: false,
                beforeSend: function() {
                    RG.Overlay.block(RG.Translate.get('Doğrulama Kodu Gönderiliyor'));
                },
                success: function(data) {
                    if(data.success){
                        $('#clicksmsactivation').trigger('click');
                        RG.payment.checkActivationCode(payment_method);
                    } else {
						RG.General.alert(RG.Translate.get(data.success), RG.Overlay.unblock);
						RG.DataLayer.trigger('error', {
							action: 'Payment Error',
							message: data.message,
						});
                    }
                    return true;
                },
                error: function(xhr) {
					RG.General.alert(RG.Translate.get('Doğrulama Kodu Gönderilemedi! Lütfen Tekrar Deneyiniz.'), RG.Overlay.unblock);
					RG.DataLayer.trigger('error', {
						action: 'Payment Error',
						message: 'Doğrulama Kodu Gönderilemedi! Lütfen Tekrar Deneyiniz.',
					});
                    return false;
                },
                complete: function() {
                    RG.Overlay.unblock();
                    return true;
                },
                dataType: 'json'
            });
        },
        checkActivationCode: function (payment_method) {
            $("#check_activation_sms").off('click').on('click', function (e) {
                e.preventDefault();

                var code = $('#activation_code').val();
                var addressInfo = RG.ChangeAddress.getTelephoneFromAddress();
                var phone = addressInfo.telephone;

                $.ajax({
                    type: 'POST',
                    url: BASKET_BASE_URL + '/ajax/basket/checkActivationSms?code='+code+'&phone='+phone,
                    asyn: false,
                    beforeSend: function() {
                        RG.Overlay.block(RG.Translate.get('Doğrulama Yapılıyor'));
                        /*$('#check_activation_sms').css('background', '#fafafa');
                        $('#check_activation_sms').css('color', '#a0a0a0');
                        $('#check_activation_sms').val('DOĞRULAMA YAPILIYOR...');*/
                    },
                    success: function(data) {
                        RG.Overlay.unblock();
                        if(data.status){
                            RG.payment.setCodPayment(payment_method);
                        } else {
							RG.General.alert(data.message, RG.Overlay.unblock);
							RG.DataLayer.trigger('error', {
								action: 'Payment Error',
								message: data.message,
							});
                            /*$('#check_activation_sms').css('background', '#ffd200');
                            $('#check_activation_sms').css('color', '#000');
                            $('#check_activation_sms').val(RG.Translate.get('GÖNDER'));*/
                        }
                        return true;
                    },
                    error: function(xhr) {
						RG.General.alert(RG.Translate.get('Doğrulama Başarısız. Tekrar Deneyin.'), RG.Overlay.unblock);
						
						RG.DataLayer.trigger('error', {
							action: 'Payment Error',
							message: 'Doğrulama Başarısız. Tekrar Deneyin.',
						});
                    },
                    complete: function() {
                        RG.Overlay.unblock();
                    },
                    dataType: 'json'
                });

                return false;
            });
        },
        setCodPayment: function (payment_method) {
            $.ajax({
                type: 'POST',
                url: BASKET_BASE_URL + '/ajax/basket/setPayment?' + payment_method,
                async: false,
                beforeSend: function() {
                    RG.Overlay.block(RG.Translate.get('Sipariş Tamamlanıyor'));
                },
                success: function(data) {
                    // RG.Overlay.block(RG.Translate.get('Sipariş Tamamlanıyor'));
                    if (data.success) {
                        var redirectUrl = '/checkout/success?order_id=' + data.order_id + '&hsh=' + data.hash;
                        if (data.redirect) redirectUrl = data.redirect;
                        window.location.href = redirectUrl;
                    } else {
						RG.General.alert(data.message, RG.Overlay.unblock);
						
						RG.DataLayer.trigger('error', {
							action: 'Payment Error',
							message: data.message,
						});

                        if (data.redirect) {
                            window.location.href = data.redirect;
                        }
                    }
                    return true;
                },
                error: function(xhr) {
					RG.General.alert(RG.Translate.get('Sipariş Tamamlanamadı. Tekrar Deneyin.'), RG.Overlay.unblock);
					
					RG.DataLayer.trigger('error', {
						action: 'Payment Error',
						message: 'Sipariş Tamamlanamadı. Tekrar Deneyin.',
					});

                    return false;
                },
                complete: function() {
                    RG.Overlay.unblock();
                    return true;
                },
                dataType: 'json'
            });
        }
    },
    Basket: {
        selector: '.cart-detail',
        is_cash_on_delivery: '',
        is_installment_set: '',
        shipping_amount: '',
        base_total: '',
        free_shipping_limit: '',
        cash_on_delivery_fee: '',
        default_payment_method: 'payu',
        default_shipping_method: 'FloShippingMng',
        total: 0,
        init: function () {
            RG.Basket.is_cash_on_delivery = 0;
            RG.Basket.prepareSidebar();
        },
        prepareSidebar: function (installmentRate) {
            $('.shipping-amount-label').find('.cargomoney').html(accounting.formatMoney(RG.Basket.shipping_amount, RG.Translate.get('TL'), 2, ".", ",", "%v %s"));
            if (RG.Basket.shipping_amount == 0) {
                RG.Basket.shipping_amount = 0;
                $('.shipping-amount-label').find('.cargomoney').html(RG.Translate.get('ÜCRETSİZ'));
            }
            var temp_cash_on_delivery = RG.Basket.cash_on_delivery_fee;
            if (RG.Basket.is_cash_on_delivery == 0) {
                temp_cash_on_delivery = 0;
            }
            RG.Basket.total = RG.Basket.base_total + RG.Basket.shipping_amount + temp_cash_on_delivery;
            if (typeof installmentRate !== 'undefined') {
                RG.Basket.total = RG.Basket.total * (1 + (installmentRate/100));
            }
            RG.Basket.prepareCartTotalHtml(RG.Basket.total);
        },
        prepareCartTotalHtml: function (price) {
            var cleanPrice = accounting.formatMoney(price, RG.Translate.get('TL'), 2, ".", ",", "%v %s");
            $('.generic-total').html(cleanPrice);
        },
        prepareInstallmentSelect: function () {
            var spanElement = $('.cc_installment').find('span');
            var liElement = $('.cc_installment').find('li');
            spanElement.data('value', liElement.data('value'));
            spanElement.html(liElement.html());
        },
    },
    Cart: {
        selector: '.cart-count',
        init: function () {
            RG.Cart.refreshBasketCount();
        },
        CartInfo: [],
        refresh: function () {
            if (!RG.Cart.CartInfo || RG.Cart.CartInfo.length == 0) {
                $.cookie('cart-count', 0, {path: '/'});
                RG.Request.post(BASKET_BASE_URL + '/ajax/basket/get', function (data) {
                    RG.Cart.CartInfo = data;
                    RG.Cart.setCartCountToCookie();
                }, 'json');
            } else {
                RG.Cart.setCartCountToCookie();
            }
        },

        refreshBasketCount: function () {
            if ($.cookie('cart-count') == null) {
                $.cookie('cart-count', 0, {path: '/'});
            }
            $('.cart-count').text($.cookie('cart-count'));

            if ($.cookie('cart-count') > 0) {
                RG.Cart.ItemCountShow();
            } else {
                RG.Cart.ItemCountHide();
                $('.cart-text').text('bulunmamaktadır');
            }
        },

        setCartCountToCookie: function () {
            $.cookie('cart-count', RG.Cart.CartInfo.items_qty, {path: '/'});
            RG.Cart.refreshBasketCount()
        },
        ItemCountShow: function () {
            $('.cart-count').show();
            $('header .top .head-top .basket > ul > li > a').removeClass('mobil-minicart-background');
        },
        ItemCountHide: function () {
            $('.cart-count').hide();
            $('header .top .head-top .basket > ul > li > a').addClass('mobil-minicart-background');
        }
    },

    MiniCart: {
        selector: '#commerce-mini-cart-icon, #commerce-mini-cart-mobile',
        isLoaded: false,
        init: function () {
            // if (!RG.MiniCart.isLoaded) {
            //     RG.MiniCart.ReloadMinicart();
            // }
            //RG.Cart.refresh();
            //RG.MiniCart.ReloadMinicart();
            $('#commerce-mini-cart-icon a').off('click.minicart').on('click.minicart', function (e) {
                RG.MiniCart.clickedMinicart();
            });
            $('#commerce-mini-cart-mobile').off('click.minicart').on('click.minicart', function (e) {
                RG.MiniCart.clickedMinicart();
            });
        },
        clickedMinicart: function () {
            if ($.cookie('cart-count') == 0 && document.location.pathname == "/basket") {
                document.location.reload(true);
            } else {
                var minicartObject = $('#mini-cart');
                if (minicartObject.is(':visible')) {
                    minicartObject.hide();
                    return;
                }

                if (!RG.MiniCart.isLoaded) {
                    RG.MiniCart.ReloadMinicart(function () {
                        minicartObject.show();
                    });
                } else {
                    minicartObject.show();
                    return;
                }
            }
        },
        ReloadMinicart: function () {
            var callback = null;
            if (arguments.length > 0) {
                callback = arguments[0];
            }

            RG.Cart.refresh();
            RG.Widget.reload('basket/mini_cart', 'load=1', function () {
				$('body').trigger('change');

				if (typeof callback === 'function') {
					callback();
				}
			});

			RG.MiniCart.isLoaded = true;
        },
    },

    Input: {
        selector: '.input',
        init: function () {
            $(RG.Input.selector).off('click.input').on('click.input', function (e) {
                e.preventDefault();

                if ($(this).data('is-selected')) {
                    $(this).data('is-selected', 0);
                    $(this).removeClass('selected');
                } else {
                    if($(this).data('only-one') && $(this).hasClass('ac-category')) {
                        $('.ac-category').removeClass('selected').attr('data-is-selected', 0);
                    }
                    $(this).data('is-selected', 1);
                    $(this).addClass('selected');
                }
            });
        }
    },

    InputRadio: {
        selector: '.input-radio',
        init: function () {
            $(RG.InputRadio.selector).off('click').on('click', function (e) {
                //
                var name = $(this).data('name');
                var obj = $('[data-name="' + name + '"]');
                obj.data('is-selected', 0);
                obj.removeClass('selected');

                $(this).data('is-selected', 1);
                $(this).addClass('selected');
                $('#add2cart').data('sku', $(this).data('value'));
                $('#add2cart').parent().parent().removeAttr("disabled");
                if ($(this).data('disabled')) {
                    $('#add2cart').text(RG.Translate.get('HABER VER')).css('pointer-events', '');
                } else if ($(this).data('soldout')) {
                    $('#add2cart').text(RG.Translate.get('TÜKENDİ'));
                    $('#add2cart').off('click').css('pointer-events', 'none');
                } else {
                    $('#add2cart').text(RG.Translate.get('SEPETE EKLE')).css('pointer-events', '');
                }
            });
        }
    },

    SubLinks: {
        selector: '.commerce-sub-links',
        init: function () {
            $(RG.SubLinks.selector + ' li > span').off('click').on('click', function (e) {
                e.preventDefault();

                var ul = $(this).parent().children('ul');
                     document.location.href = $(this).parent().data('href');
 					ul.toggleClass('hidden');
					
					if (!ul.hasClass('hidden')) {
						$(this).addClass('child-opened');
					}else{
						$(this).removeClass('child-opened');
					}


            });
        }
    },

    noStock: {
        selector: '.no-stock',
        init: function () {
            $('.no-stock a').off('click').on('click', function (e) {
                e.preventDefault();
                var termstock;
                $('.basket-page .my-basket .basket-list .basket-detail table tbody tr').each(function () {
                    termstock = $(this).find(' td .qty-select ul li');
                    if (termstock.data('value') == 0) {
                        $(this).find(' td .remove i').click();
                        $(this).find(' td .remove').click();
                    }
                });
                $('.no-stock .close').click();
            });
        }
    },

    Autocomplete: {
        selector: '.commerce-autocomplete',
        delay: 15,
        timeout: 0,

        init: function () {
            $(RG.Autocomplete.selector).off('keyup.autocomplete').on('keyup.autocomplete', function (e) {
                if (RG.Autocomplete.timeout) {
                    clearTimeout(RG.Autocomplete.timeout);
                }
                RG.Autocomplete.timeout = setTimeout(RG.Autocomplete.refresh, RG.Autocomplete.delay)
            });

            $('#enhanced-search-result-form .input').off('click.autocomplete').on('click.autocomplete', function (e) {
                e.preventDefault();

                RG.Autocomplete.refresh();
                ;
            });
        },

        refresh: function () {
            RG.Widget.reload('products/autocomplete', "autocomplete_query=" + $(RG.Autocomplete.selector).val() + RG.Autocomplete.serialize(), function () {
                var $wrapper = $('.search-form-wrapper');

                if ($wrapper.length) {
					$wrapper.addClass('show-search-results').trigger('search.result.show');
                }
            });
        },

        serialize: function () {
            var params = "";
            $('#enhanced-search-result-form .input').each(function () {

                if ($(this).data('is-selected')) {
                    params += ("&" + $(this).data('name') + "=" + encodeURI($(this).data('value')));
                }
            });

            return params;
        }
    },

    AddToCart: {
        selector: '.add-to-cart',
        init: function () {
            $(RG.AddToCart.selector).off('click.add-to-cart').on('click.add-to-cart', function (e) {
                e.preventDefault();

                var productId = $(this).data('product-id');
				var productSku = $(this).data('sku');
				var quantity = $('#product-detail-quantity').val() || 1;
                var postParameters = {sku: productSku, quantity: quantity};
                var stockAlertParams = {id: productId};
                var disabledStatus = 0;

                if ($(this).data('has-option')) {
                    var selectedInput = $('[data-name="option_sku_' + productId + '"].selected');
                    postParameters.sku = selectedInput.data('value');
                    stockAlertParams.id = selectedInput.data('option-id');
                    disabledStatus = selectedInput.data('disabled');

                    postParameters.is_child = true;
                    if (!postParameters.sku) {

						RG.DataLayer.trigger("add_to_cart_validation_error", {
							product: ecommerce.detail.products[0],
							quantity: quantity,
							// option: optionVal,
							sku: productSku
						});

						var $mobileSizeContainer = $('#mobile-size-container');
						if ($mobileSizeContainer.length) {
							$('body').addClass('mobile-size-container-show');

							return;
						}

						if (window.sizeNotSelectedHightlight === true) {
							$('body').addClass('highlight-to-size-container');
						} else {
							RG.General.alert(RG.Translate.get('Lütfen beden seçimi yapınız'));
						}
						
                        return;
                    }

                    var optionVal = selectedInput.data('option');
                }

                var sourceCheck = RG.General.queryString('campaign');
                if(sourceCheck && sourceCheck !== '') {
                    var campData = sourceCheck.split('_');
                    var source = '';
                    if(campData[0] === 'c') {
                        source = 'category';
                    } else if(campData[0] === 'm') {
                        source = 'manufacturer';
                    } else if(campData[0] === 'g') {
                        source = 'gender';
                    } else if(campData[0] === 's') {
                        source = 'search';
                    }

                    if(source !== '') postParameters.source = source + ':' + campData[1];
                }

                if (disabledStatus) {
                    RG.Overlay.block(RG.Translate.get('Stok Alarmı ekleniyor'));
                    RG.Request.post('/ajax/stock/create', stockAlertParams, function (data) {

                        if (data.success) {
                            RG.General.alert(RG.Translate.get('Stok alarmı eklenmiştir. Ürün stoğa girdiğinde bilgilendirileceksiniz.'), RG.Overlay.unblock);
                        } else {
							RG.General.alert(data.message, RG.Overlay.unblock);

							RG.DataLayer.trigger('error', {
								action: 'Stock Error',
								message: data.message,
							});
                        }
                    }, 'json');
                } else {
                    /* The maximum order quantity is 8 */
                    if (8 <= $.cookie('cart-count')) {
						RG.General.alert(RG.Translate.get('Maksimum 8 adet ürün satın alabilirsiniz.'));
						RG.DataLayer.trigger('error', {
							action: 'Stock Error',
							message: 'Maksimum 8 adet ürün satın alabilirsiniz.',
						});

                    } else {
						$.cookie('cart-count', null, { expires: -1 });
                        RG.Overlay.block(RG.Translate.get('Sepete Ekleniyor'));
                        RG.Request.post(BASKET_BASE_URL + '/ajax/basket/add', postParameters, function (data) {
                            if (data.success) {
                                RG.Overlay.unblock();
                                RG.DataLayer.trigger("add_to_cart", {
                                    product: ecommerce.detail.products[0],
                                    quantity: quantity,
                                    option: optionVal,
                                    sku: productSku
                                });
                                RG.Cart.CartInfo = data.basket;
                                RG.MiniCart.ReloadMinicart(function () {
									$(document).trigger('basket:addtocart:success', {
										params: postParameters,
										response: data,
									});
								});
                                $('#clickSepeteekle').trigger('click');
                            } else {
                                RG.Cart.CartInfo = data.basket;
                                RG.MiniCart.ReloadMinicart();
								RG.General.alert(data.message, RG.Overlay.unblock);
								
								RG.DataLayer.trigger('error', {
									action: 'Stock Error',
									message: data.message,
								});
                            }
                        }, 'json');
                    }
                    if ( $( ".msz-close" ).length ) $('.msz-close').click();
                }
            });
        }
    },

    ProductDetail: {
        selector: '#product-detail-page',
        init: function () {

        }
    },

    CategoryFilters: {
        selector: '#commerce-product-list',
        form: $('#commerce-product-list'),
        priceFindMinMax:function(){
            var min_array = [];
            var max_array = [];
            var prices=[];
            $('.selected').find('.price').each(function(){
                min_array.push( $(this).data('min') );
                max_array.push( $(this).data('max') );
            });
            var biggest = Math.max.apply( null, max_array );
            var smallest = Math.min.apply( null, min_array );
            if(biggest=='-Infinity') biggest='';
            if(smallest=='Infinity') smallest='';


            var $minInput = $('input[name="min"]');
            if ($minInput.length && $minInput.val()) {
                smallest = $minInput.val();
            }

            var $maxInput = $('input[name="max"]');
            if ($maxInput.length && $maxInput.val()) {
                biggest = $maxInput.val();
            }

            prices.push( smallest);
            prices.push( biggest );

            return prices

		},
        percentPriceFindMinMax:function(){
            var min_array = [];
            var max_array = [];
            var prices=[];
            $('.selected').find('.price_percent').each(function(){
                min_array.push( $(this).data('min') );
                max_array.push( $(this).data('max') );
            });

            var biggest = Math.max.apply( null, max_array );
            var smallest = Math.min.apply( null, min_array );

            if(biggest=='-Infinity') biggest='';
            if(smallest=='Infinity') smallest='';

            var $minInput = $('input[name="percent_min"]');
            if ($minInput.length && $minInput.val()) {
                smallest = $minInput.val();
            }

            var $maxInput = $('input[name="percent_max"]');
            if ($maxInput.length && $maxInput.val()) {
                biggest = $maxInput.val();
            }

            prices.push( smallest);
            prices.push( biggest );
            return prices

        },

        getChangedFilter: function (e,t) {
			var queryString = window.location.href.split('?');
			if (queryString.length === 1) { return ''; }
			var queryStringJSON = {};
			var splittedQueryString = queryString[1].split('&');
			for (var item in splittedQueryString) {
				var keyVal = splittedQueryString[item].split('=');

				if ((keyVal[0] /* key */ === e)||(keyVal[0] /* key */ === t)) {
					queryStringJSON[keyVal[0]] = keyVal[1];
				} else if (!e & !t && ['min', 'max', 'percent_min', 'percent_max', 'sort', 'gorunum'].indexOf(keyVal[0]) !== -1) {
					queryStringJSON[keyVal[0]] = keyVal[1];
				}
			}

			var querystrings = $.map(queryStringJSON, function (val,key) {
				return key + '=' + val;
			}).join('&');

			if (querystrings) {
				return '&' + querystrings;
			}

			return '';
		},

        init: function () {
            $('.commerce-sort-order').off('click.sorting').on('click.sorting', function (e) {
                e.preventDefault();
                RG.General.replaceQueryString('sort', $(this).data('sort'), true);
            });

			$('#product-list-sorting-dropdown').off('change').on('change', function (e) {
                e.preventDefault();
                RG.General.replaceQueryString('sort', $(this).val(), true);
			});

            var activeSorting = $('#commerce-sort-order').val();
            $('.commerce-sort-order[data-sort="' + activeSorting + '"]').addClass('active');

            $('.remove-filter').off('click.remove_filter').on('click.remove_filter', function () {
                RG.CategoryFilters.removeFilter($(this).data('filter-value'));
            });
            $('.remove-filter-all').off('click.remove_filter').on('click.remove_filter', function () {
                $('.active-filters a').each(function(){
                   RG.CategoryFilters.removeAllFilter($(this).data('filter-value'))
                })
                RG.CategoryFilters.refresh();
               var url = window.location.href.split('?')[0];

                RG.CategoryFilters.pushState(url, null);
            });

            $('.commerce-filter-button').off('click.category_filters').on('click.category_filters', function () {
                $(this).parent().find('.filter').toggleClass('hidden');
            });

            $('.gorunum').off('click.rg').on('click.rg', function (e) {
                e.preventDefault();
                RG.CategoryFilters.changeView();
            });
            $('.back-filt').off('click').on('click', function (e) {
                e.preventDefault();
                RG.CategoryFilters.removeAllFilter();
                var modalOff=$('.toggle-box');
                modalOff.parent().parent().removeClass('acik');
                $('.overlay2').fadeOut();
                modalOff.next().slideUp();
                modalOff.parent().removeClass('open');
                modalOff.prev().removeClass('open');
                RG.CategoryFilters.refresh();
                window.location.href=RG.General.beforePushstate.urlpush;
            });
            var fbt = $('.filter .mc-md-4 button.toggle-box,.apply-button');

            fbt.off('click').on('click', function (e) {
                e.preventDefault();
                var oldUrl=window.location.href;
                RG.General.beforePushstate.urlpush=oldUrl;
                if ($(this).parent().hasClass('open')) {
                    $(this).parent().parent().removeClass('acik');
                    $('.overlay2').fadeOut();
                    $(this).next().slideUp();
                    $(this).parent().removeClass('open');
                    $(this).prev().removeClass('open');
                } else {
                    $(this).parent().parent().addClass('acik');
                    $('.overlay2').fadeIn();
                    fbt.next().slideUp();
                    fbt.parent().removeClass('open');
                    fbt.prev().removeClass('open');
                    $(this).parent().addClass('open');
                    $(this).prev().addClass('open');
                    $(this).next().slideDown();
                }

             //   RG.CategoryFilters.refresh();

            });
             $('.input,.input-radio').off('click.filter').on('click.filter', function (e) {
				 var idclick=$(this).closest( '.collapse' ).attr('id');
				
				 var $self = $(this);

				 if ($self.hasClass('no-filter')) { 
					// listeleme sayfasında quickview da beden seçiminde filtre gibi davranıyor.
					// eğer no-filter class ı varsa filtreleme işlemi başlatmayacak
					 return;
				 }

                 $('#' + idclick + '').addClass('is-clicked');
                    var pushState = $(this).attr('href');
                if ($(this).data('is-selected') == 0) {
                    pushState = $(this).data('without-query');
                    if (pushState == '') {
                        pushState = window.location.href.split('?')[0] + '?';
                    }
				}

                 pushState += RG.CategoryFilters.getChangedFilter('sort');

                RG.CategoryFilters.refresh();
                 RG.CategoryFilters.pushState(pushState, null);
                 var id_append = setInterval(idAppend, 100);
                 function idAppend() {
                     if (( !$('#' + idclick + '').hasClass('is-clicked')||$('.not-found').length)){
                        $('#' + idclick + '').addClass('show');
                        $('#' + idclick + '').parent().addClass('active');
                        clearInterval(id_append);
             }  }

            });

            var beden = $('.beden-box .list .form-group .checkbox label');
            beden.off('click.bind').off('click.bind', function () {
                if ($(this).parent().hasClass('active')) {
                    $(this).parent().removeClass('active');
                    $(this).prev().removeClass('active');
                } else {
                    beden.parent().removeClass('active');
                    beden.prev().removeClass('active');
                    $(this).addClass('active');
                }
            });
            $('.fav a').off('click.fav').on('click.fav', function () {
                $(this).parent().toggleClass('open');
            });

            $('.checkboxs').parent().addClass('mar');
            $('.checkbox').parent().addClass('mar');

            var side = $('.sidebar  span');
            side.off('click.bind').on('click.bind', function () {
                if ($(this).hasClass('open')) {
                    $(this).removeClass('open');
                    $(this).prev().removeClass('open');
                    $(this).parent().find('.all').slideUp();
                    $(this).parent().find('.scss').slideUp();
                } else {
                    $(this).parent().find('.all').slideDown();
                    $(this).parent().find('.scss').slideDown();
                    side.parent().removeClass('open');
                    side.prev().removeClass('open');
                    $(this).addClass('open');
                    $(this).prev().addClass('open');
                }
            });

            $('.checkboxs label').off('click.bind').on('click.bind', function () {
                $(this).parent().toggleClass('active');
            });

            $(".page .product-list .hidden").off('click.bind').on('click.bind', function () {
                $(this).next().slideToggle();
            });

            $('.page .product-list .filtreList ul li i').off('click.bind').on('click.bind', function () {
                $(this).parent().hide();
            });
            $('.page .product-list .filtreList ul li:nth-child(1)').addClass('last');
            $('.page .product-list .filtreList ul li:nth-child(2)').prev().removeClass('last');
            $('.page .product-list .filtreList ul li.last i').off('click.bind').on('click', function () {
                $('.filtreList').hide();
            });

            $.urlParam = function (name) {
                var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
                if (results == null) {
                    return null;
                } else {
                    return decodeURI(results[1]) || 0;
                }
            }

            $(".min-max .checkbox").off("click").on("click", function (event, ui) {
                var idclick = $(this).closest('.collapse').attr('id');
                $('#' + idclick + '').addClass('is-clicked');
                $('input[name="min"]').val('');
                $('input[name="max"]').val('');
                if ($(this).find('.price_percent').length) {
                    $('input[name="percent_min"]').val('');
                    $('input[name="percent_max"]').val('');
                } else {
                    $('input[name="min"]').val('');
                    $('input[name="max"]').val('');
                }
                $(this).toggleClass('selected');
                var $inputs = $(this).closest('.card').find('input[name="min"], input[name="max"]');
                if ($inputs.length) {
                    $inputs.val('');
                }
                var $inputs = $(this).closest('.card').find('input[name="percent_min"], input[name="percent_max"]');
                if ($inputs.length) {
                    $inputs.val('');
                }

                var pushStateArr = window.location.href.split('?');
                var pushState = '';
                if (pushStateArr[1]) pushState = pushStateArr[1];
                // var url = new URL(window.location.href);
                var min = $.urlParam("min");
                var max = $.urlParam("max");
                var percent_min = $.urlParam("percent_min");
                var percent_max = $.urlParam("percent_max");
                if (parseInt(min) > parseInt(max)) {
                    min = parseInt(min) + parseInt(max);
                    max = min - max;
                    min = min - max;
                }
                if (parseInt(percent_min) > parseInt(percent_max)) {
                    percent_min = parseInt(percent_min) + parseInt(percent_max);
                    percent_max = percent_min - percent_max;
                    percent_min = percent_min - percent_max;
                }
                //  var page = $.urlParam("page") ? $.urlParam("page") : '1';
                var queryStringsObj = queryStringToJSON(window.location.search || '');
                var prices = RG.CategoryFilters.priceFindMinMax();
                var percent_prices = RG.CategoryFilters.percentPriceFindMinMax();
                if ($(this).closest('.collapse').attr('id') == 'collapse-price') {
                    queryStringsObj['min'] = prices[0];
                    queryStringsObj['max'] = prices[1];
                    var pushStateNew = 'min=' + prices[0] + "&" + 'max=' + prices[1];
                }
                if ($(this).closest('.collapse').attr('id') == 'collapse-price_percent') {
                    queryStringsObj['percent_min'] = percent_prices[0];
                    queryStringsObj['percent_max'] = percent_prices[1];
                    var pushStateNew = 'percent_min=' + percent_prices[0] + "&" + 'percent_max=' + percent_prices[1];

                }
                if (window.location.href.indexOf('?') > -1) {
                    RG.CategoryFilters.pushState(window.location.pathname + '?' + $.param(queryStringsObj));
                } else {

                    RG.CategoryFilters.pushState(window.location.pathname + '?' + pushStateNew);
                }
                RG.CategoryFilters.refresh();
                var id_append = setInterval(idAppend, 100);
                function idAppend() {
                    if ((!$('#' + idclick + '').hasClass('is-clicked') || $('.not-found').length)) {
                        $('#' + idclick + '').addClass('show');
                        $('#' + idclick + '').parent().addClass('active');
                        clearInterval(id_append);
                    }
                }
            });


            // $('#commerce-product-list').keypress(function(e) {
            //     var key = e.which;
            //     if (key == 13)
            //     {
            //         RG.CategoryFilters.refresh();
            //         return false;
            //     }
            // });



            window.onpopstate = function (event) {
                window.location.reload();
            };
            var active_filters = $(".active-filters").data('filter-value');
            if(typeof active_filters !== "undefined"){
                $(".footer-description").addClass('hidden');
            }else{
                $(".footer-description").removeClass('hidden');
            }

        },

        removeFilter: function (value) {
            var input = $('.input[data-value="' + value + '"]');
            input.data('is-selected', 0);
            $('.input-radio[data-value="' + value + '"]').data('is-selected', 0);
            RG.CategoryFilters.refresh();
            var url = input.data('without-query');
            if (url == '') {
                url = window.location.href.split('?')[0];
            }
            RG.CategoryFilters.pushState(url, null);
        },
        removeAllFilter: function (value) {
            var input = $('.input[data-value="' + value + '"]');
            input.data('is-selected', 0);
            $('.input-radio[data-value="' + value + '"]').data('is-selected', 0);


            },

        refresh: function () {

            RG.Overlay.block(RG.Translate.get('Yükleniyor'));
            var queryless_url = window.location.href.split('?')[0];
            var prices = RG.CategoryFilters.priceFindMinMax();
            var minNew = prices[0];
            var maxNew = prices[1];
            var price_values = [
                minNew,
                maxNew
            ];

            var prices_percent = RG.CategoryFilters.percentPriceFindMinMax();
            var percent_minNew = prices_percent[0];
            var percent_maxNew = prices_percent[1];
            var percent_price_values = [
                percent_minNew,
                percent_maxNew
            ];

            var price_query ="";

            if(price_values[0] !== "" || price_values[1] !== "") {
                price_query += "&min=" + price_values[0] + "&max=" + price_values[1];
            }

            if(percent_price_values[0] !== "" || percent_price_values[1] !== "") {
                price_query += "&percent_min=" + percent_price_values[0] + "&percent_max=" + percent_price_values[1];
            }
            var cat_query = RG.General.queryString('kategori');
            var search = RG.General.queryString('q');
            var search_query = search ? "&q=" + search : '';

            var paramsArr = [];

            var firstPart = $(RG.CategoryFilters.selector).serialize();
            if(firstPart !== "") { paramsArr.push(firstPart); }
            var secondPart = RG.CategoryFilters.serialize();
            if(secondPart !== "") { paramsArr.push(secondPart); }
            if(price_query !== "") { paramsArr.push(price_query); }
            if(search_query !== "") { paramsArr.push(search_query); }


            var params = paramsArr.join('&');
            //var encoded = encodeURI(params);
            if(cat_query && !$('.flo-category-filters').length) {
                params = 'kategori=' + cat_query + '&' + params;
            }

            //console.log(encoded);

			//var stateUrl = queryless_url + '?' + encoded;

			params += RG.CategoryFilters.getChangedFilter();

            $.get(queryless_url, params, function (data) {
				RG.Overlay.unblock();

				if(($(data).find('.product-lists').html()=='')||($(data).find('.product-lists').html()==undefined)||($(data).find('.product-lists').html()==null)){
                    $('.product-lists').html('<div class="whitepage not-found"><p>İlgili fiyat aralığında ürün bulunmamaktadır.</p></div>');
                } else {
					$('.product-lists').html($(data).find('.product-lists').html());
					$('.category_filters').html($(data).find('.category_filters').html());
					$('.breadcrumb ').html($(data).find('.breadcrumb ').html());
					$('.GTM-activeFilters').remove();
					$(data).find('.GTM-activeFilters').appendTo('body');

					var $productCount = $('.product-count');
					if ($productCount.length) {
						$productCount.html($(data).find('.product-count').html())
					}
					// window.history.pushState({}, document.title, document.location.href);
					RG.init();
				}

				$(document).trigger('product.list.dom.change');
            });

            $(".price-check-div").removeClass('active');
            $(".price-check").each(function (i, row) {
                if(parseInt($(row).data('min')) < minNew) {
                    if($(row).is(":checked")) {
                        $(row).prop('checked', false);
                        $(row).trigger('change');
                    }
                }

                if(parseInt($(row).data('max')) > maxNew) {
                    if($(row).is(":checked")) {
                        $(row).prop('checked', false);
                        $(row).trigger('change');
                    }
                }

                if(minNew != "" && parseInt($(row).data('min')) == minNew && $(row).not(":checked")) {
                    $(row).prop('checked', true);
                    $(row).trigger('change');
                }
            });

            $(".percent-check").each(function (i, row) {
                if(percent_maxNew != "" && percent_minNew != "") {
                    if(parseInt($(row).data('min')) >= percent_minNew && parseInt($(row).data('max')) <= percent_maxNew) {
                        if($(row).not(":checked")) {
                            $(row).prop('checked', true);
                            $(row).trigger('change');
                            $(row).parent('.percent-check-div').addClass('active');
                        }
                    } else {
                        if($(row).is(":checked")) {
                            $(row).prop('checked', false);
                            $(row).trigger('change');
                            $(row).parent('.percent-check-div').removeClass('active');
                        }
                    }
                }
            });
        },

        pushState: function (url, data) {
            data = data || null;
            history.pushState(data, null, url);
        },

        serialize: function () {
            var params = "";

            RG.CategoryFilters.form.find('.input,.input-radio').each(function (i, item) {
                if ($(this).data('is-selected')) {
                    if(i !== 0) params += "&";
                    params += ($(this).data('name') + "=" + $(this).data('value'));
                }
            });

            return params;
        },
        changeView: function () {
			$('.overlay2').hide();
			
            if ($(".gorunum").val() == '2') {
                $('.product-lists').removeClass('one');
                $('.product-lists').addClass('two');
                $('.product-container').removeClass('mc-md-6 mc-xs-12');
                $('.product-container').addClass('mc-md-4 mc-xs-6');
                $('.gorunum').val('1');
            } else if ($(".gorunum").val() == '1') {
                $('.product-lists').addClass('one');
                $('.product-lists').removeClass('two');
                $('.product-container').addClass('mc-md-6 mc-xs-12');
                $('.product-container').removeClass('mc-md-4 mc-xs-6');
                $('.gorunum').val('2');
            }

			var value = $('.gorunum').val();
            $.cookie('filter_view', value);
            $.cookie('gorunum', value);
        }
    },

    Wishlist: {
        selector: '.add-wishlist, #wishlist-items,.favourites-page-wrapper',
        productList: [],
        addedProduct: '',
        init: function () {
            RG.Wishlist.setAddedProduct();
            $('.fav a').off('click');
            $('.add-wishlist').off('click.add-wishlist').on('click.add-wishlist', function (e) {
                e.preventDefault();
                var product = $(this);
                var productId = product.data('product-id');
                var sku = product.data('sku');

                if(product.parent().hasClass('open')){
                    product.parent().removeClass('open');
                    removeWishlist(productId, sku, product);
                } else {
                    //RG.Overlay.block(RG.Translate.get('Ekleniyor'));
                    RG.Request.post(
                        '/ajax/wishlist/save',
                        {
                            product_id: productId,
                            option: '',
                            qty: 1,
                        },
                        function (data) {
                            if (!data.status) {
                                document.location.href = "/customer/login";
                            } else {
                                RG.DataLayer.trigger("add_to_favorites", {sku: sku});
                                RG.Wishlist.Refresh();
                                product.parent().addClass('open');

                                $(document).trigger('wishlist.add', {
                                    $el: product,
                                });
                            }
                        }, 'json'
                    );
                }

            });

            $('.remove-from-favourites-button').off('click').on('click',function (e) {
                /**
                 * flo favorilerim
                 */
                e.preventDefault();
                var selectedProduct = $(this).closest('.product-box');
                var product_id = $(this).data('product-id');
                var sku = $(this).data('sku');
                //Ajax request
                removeWishlist(product_id, sku, selectedProduct.parent());
                selectedProduct.parent().remove();
                if($(".product-box").length == 0){
                    RG.Widget.reload('wishlist/items', {
						cache_refresh: 1
					});
                }
            });

            $('.remove-wishlist').off('click.remove-wishlist').on('click.remove-wishlist', function (e) {
                e.preventDefault();
                var product_id = $(this).find("img").data('product-id');
                var sku = $(this).find("img").data('sku');
                $(this).closest('tr').remove();
//                RG.Overlay.block('Siliniyor');
                removeWishlist(product_id, sku, $(this));


            });

            function removeWishlist(product_id, sku, $el) {
                RG.Request.post(
                    '/ajax/wishlist/delete',
                    {
                        product_id: product_id
                    },
                    function (data) {
                        var myList = RG.General.getCookie('wishlist');
                        var newList = [];
                        if(myList !== undefined) {
                            RG.Wishlist.addedProduct = myList.split(',');
                            $.each( RG.Wishlist.addedProduct, function( index, value ){
                                if(value != product_id){
                                    newList.push(value);
                                }
                            });
                            RG.General.setCookie("wishlist", '', 1);
                            RG.General.setCookie("wishlist", newList, 1);
                        }
                        RG.DataLayer.trigger("remove_from_favorites", {sku: sku});

                        $(document).trigger('wishlist.remove', {
                            $el: $el,
                        });

                    }, 'json'
                );
            }
        },
        setAddedProduct: function () {
           var myList = RG.General.getCookie('wishlist');
           if(myList !== undefined){
               RG.Wishlist.addedProduct = myList.split(',');
               $('.add-wishlist').each(function(i, obj) {
                   var elem = $(this);
                   $.each( RG.Wishlist.addedProduct, function( index, value ){
                       if(String(value) == String(elem.data('product-id'))){
                           elem.parent().addClass('open');
                           //elem.attr('data-remove-wishlist', 1);
                       }
                   });
               });
           }

        },
        Refresh: function () {
            RG.Request.post(
                '/ajax/wishlist/getList',{},
                function (data) {
                    RG.Wishlist.productList = [];
                    $.each( data, function( index, value ){
                        RG.Wishlist.productList.push(value['product_id']);
                    });
                    RG.General.setCookie("wishlist", '', 1);
                    RG.General.setCookie("wishlist", RG.Wishlist.productList, 1);
                }, 'json'
            );
        }
    },

    LoadMore: {
        selector: '.commerce-load-more-button',
        init: function () {
            $(document).scroll(function () {
                var gorunum = $(".gorunum").val();
                $(RG.LoadMore.selector).each(function () {
                    if ($(this).visible()) {
                        var params = $(this).data('params');
                        var widgetContainer = $(this).parents('.widget');
                        var widgetName = widgetContainer.data('widget');
                        var widgetParams = widgetContainer.find('.widget_params').val();

                        params += ('&' + $('#commerce-product-list').serialize());
                        params += ('&' + $(RG.CategoryFilters.selector).serialize() + '&' + RG.CategoryFilters.serialize());

                        var cat = RG.General.queryString('kategori');
                        var cat_query = '';
                        if(cat && !$('.flo-category-filters').length) {
                            cat_query = '&kategori=' + cat;
                        }

                        var minNew=RG.CategoryFilters.priceFindMinMax()[0];
                        var maxNew=RG.CategoryFilters.priceFindMinMax()[1];
                        var price_values = [
                            minNew,
                            maxNew
                        ];
                        var price_query = "&min=" + price_values[0] + "&max=" + price_values[1];

                        $(this).remove();

                        cat_query += '&gorunum=' + gorunum;

                        RG.Widget.append(widgetName, (widgetParams ? widgetParams : '') + '&' + (params ? params : '') + price_query + cat_query + '&load_more=1', '.commerce-load-more', function () {
                            $(document).trigger('product.list.dom.change');
                        });
                    }
                })
            });
        }
    },

    PageNoAnchor: {
        selector: 'a[data-page-no]',
        pageSelector: '.products-wrapper',
        init: function () {
            $(document).scroll(function () {
                var $pageWrappers = $(RG.PageNoAnchor.pageSelector);
                var sortedPageWrappers = $pageWrappers.percentWithinViewport().map(function ($item) {
                    return {
                        el: $item,
                        percent: parseInt($item.attr('data-percent-viewport')),
                    }
                }).sort(function (a, b) {
                    return b.percent - a.percent;
                });


                var $activePage = sortedPageWrappers.length ? sortedPageWrappers[0].el : $pageWrappers.first();
                var $pager = $activePage.find(RG.PageNoAnchor.selector);
                var pageNo = $pager.data('page-no');

                if (pageNo > 1 && RG.General.queryString('page') != pageNo) {
                    var pageUrl = window.location.pathname + RG.General.replaceQueryString('page', pageNo);
                    history.pushState('', '', pageUrl);
                }

                if (RG.General.queryString('page') != undefined && RG.General.queryString('page') > 1 && window.scrollY < 100) {
                    var pageUrl = window.location.pathname + RG.General.removeQueryString('page');
                    history.pushState('', '', pageUrl);
                }
            });
        }
    },

    Widget: {
        reload: function (name, params) {
            var callback = null;
            if (arguments.length > 2) {
                callback = arguments[2];
            }

            RG.Request.post('/widget/get?widget=' + name, params, function (data) {
                name = name.replace('/', '_');
                $('.widget_' + name).html(data);

                RG.init();

                if (callback) {
					callback();
					
					$('body').trigger('change');
                }
            });
        },

        append: function (name, params, target_element, callback) {
            RG.Request.post('/widget/get?widget=' + name, params, function (data) {
                name = name.replace('/', '_');

                $('.widget_' + name + ' ' + target_element).append(data);

                RG.init();

                if (callback) {
                    callback();
                }
            });
        }
    },

    customerSave: {
        selector: "#btn-customer-save",
        form: $('#customer-edit-form'),
        init: function () {
            var customer_info=false;

            $(":input").on("keyup change paste", function(e) {
                 if ($(this).attr('name') !== 'uyelik_sozlesmesi') { console.log("ffff");customer_info=true;}
            })
                $('#customer-edit-form').off('submit').on('submit', function (e) {
                    e.preventDefault();

                    RG.validation.init($(this));
                    if(! RG.validation.validate($(this))){
                        return false;
                    }
                   if(customer_info){
                       RG.Overlay.block(RG.Translate.get('Kaydediliyor'));
                       RG.Request.post('/ajax/customer/save', $(this).serialize(), function (data) {
                           if (data.success) {
                               // window.location.href = '/';
                               RG.General.alert(data.message, RG.Overlay.unblock);
                           } else {
                               RG.General.alert(data.message, RG.Overlay.unblock);
                           }
                       }, 'json');
                   }



                });
        }

    },
    passwordSave: {
        selector: "#btn-password-save",
        form: $('#customer-password-form'),
        init: function () {

            $('#customer-password-form').off('submit').on('submit', function (e) {
                e.preventDefault();

                RG.validation.init($(this));
                if(! RG.validation.validate($(this))){
                    return false;
                }
                RG.Overlay.block(RG.Translate.get('Kaydediliyor'));
                RG.Request.post('/ajax/customer/password-save', $(this).serialize(), function (data) {
                    if (data.success) {
                        RG.General.alert(data.message, function () {
                            window.location.href = '/';
                        });

                    } else {
                        RG.General.alert('İşleminiz şu anda gerçekleştirilemiyor. Lütfen tüm bilgilerin doğru olduğuna emin olun.', RG.Overlay.unblock);
                    }
                }, 'json');
            });
        }

    },
    passwordForget: {
        selector: "#btn-forget-save",
        form: $('#customer-forget-form'),
        init: function () {

            $('#customer-forget-form').off('submit').on('submit', function (e) {
                e.preventDefault();

                RG.Overlay.block(RG.Translate.get('Kaydediliyor'));
                RG.Request.post('/ajax/customer/reset', $(this).serialize(), function (data) {
                    if (data.success) {
                        RG.General.alert(data.message, function () {
                            window.location.href = window.location.protocol + '//' + window.location.host + '/customer/password-forget-success';
                        });
                    } else {
                        RG.General.alert(data.message, RG.Overlay.unblock);
                    }
                }, 'json');
            });
        }

    },
    passwordResetForget: {
        selector: "#btn-reset-password-save",
        form: $('#customer-reset-form'),
        init: function () {

            $('#customer-reset-form').off('submit').on('submit', function (e) {
                e.preventDefault();

                RG.Overlay.block(RG.Translate.get('Kaydediliyor'));
                RG.Request.post('/ajax/customer/password-reset-save', $(this).serialize(), function (data) {
                    if (data.success) {
                        RG.General.alert(data.message, function () {
                            window.location.href = '/';
                        });
                    } else {
                        RG.General.alert(data.message, RG.Overlay.unblock);
                    }
                }, 'json');
            });
        }

    },

    customerAddress: {
        selector: '#addressRemove,#formAddresSave,#formAddress,#adressss',
        form: $('#address-edit-form'),
        init: function () {

            $('.address-remove').off('click.address-remove').on('click.address-remove', function (e) {
                e.preventDefault();

                if ($(this).data('no_confirm') === true || confirm(RG.Translate.get('Silmek istediğinize emin misiniz?'))) {
                    var success_url = $(this).data('success_url');
                    RG.Overlay.block(RG.Translate.get('Siliniyor'));
                    RG.Request.post(
                        '/ajax/address/remove',
                        {
                            id: $(this).data('address-id')
                        },
                        function (data) {
                            RG.Overlay.unblock();
                            if (data.success) {
                                RG.Widget.reload('address/customer_address_index');
                                // RG.Overlay.unblock();
                                RG.General.alert(data.message);
                            } else {
                                RG.Overlay.unblock();
                                RG.General.alert(data.message);
                            }

                            if (typeof success_url !== 'undefined') {
                                window.location.href = success_url;
                            }

                        }, 'json'
                    );
                }

                // $(this).closest('div.items').remove();
            });

            $('.sifirla').click(function () {
                RG.General.setCookie("newShip", '', 1);
                RG.General.setCookie("shipping_address", '', 1);
                RG.General.setCookie("billing_address", '', 1);
                RG.General.setCookie("checked",   1, 1);
            })
$('.address-cookie').click(function () {


    var si=$(".ship-address .selected").index();
    var bi=$(".bill-address .selected").index();

    if(si != -1){
        var s=$("#selected-ship-address option").eq(si).data('id');
        var b=$("#selected-bill-address option").eq(bi).data('id');

    }
    else{
        var  s= $( "#selected-ship-address option:selected" ).data('id');
        var  b= $( "#selected-bill-address option:selected" ).data('id');

    }
    if($(this).hasClass('address-cookie-add'))
    { RG.General.setCookie("newShip", 'ship', 1);}
    else{
        RG.General.setCookie("newShip", '', 1);
    }

    RG.General.setCookie("shipping_address", s, 1);
    RG.General.setCookie("billing_address", b, 1);
    RG.General.setCookie("checked", $("input[name='billing_choice']").is(':checked') == true ? 0 : 1, 1);

})
            $('#address-edit-form').off('submit.edit').on('submit.edit', function (e) {
                e.preventDefault();
                RG.Overlay.block(RG.Translate.get('Kayıt Ediliyor'));
				RG.validation.init($(this));
				var $addressForm = $(this);
                if(! RG.validation.validate($(this))){
                    RG.Overlay.unblock();
                    return false;
                }




                RG.Request.post('/ajax/address/update', $(this).serialize(), function (data) {
                    if (data.success) {
						if (!$addressForm.hasClass('no-redirect')) {
							window.location.href = data.data.redirect;
						} else {
							$addressForm.attr('data-redirect-to', data.data.redirect);
							$(document).trigger('address.updated');
						}
                    } else {
                        RG.Overlay.unblock();
                        RG.General.alert(data.message);
                    }
                }, 'json');
            });

             $('.new-address-form, #address-add-form').off('submit.add').on('submit.add', function (e) {
                e.preventDefault();
                RG.Overlay.block(RG.Translate.get('Kayıt Ediliyor'));

                RG.validation.init($(this));
                if(! RG.validation.validate($(this))){
                    RG.Overlay.unblock();
                    return false;
                }

                var addresMOdify = $(this).serialize();
                var newShip= $(this).hasClass('new-shipping-address')  == true ? 'ship' : 'bill';

                RG.General.setCookie("newShip", newShip, 1);
                RG.Request.post('/ajax/address/create', addresMOdify, function (data) {
                    if (data.success) {
                        window.location.href = data.data.redirect;
                    } else {
                        RG.Overlay.unblock();
                        RG.General.alert(data.message);
                    }
                }, 'json');
            });
            $('[id^="country_"]').off('change.address-country').on('change.address-country', function (e) {
                e.preventDefault();
                var key = $(this).data('key');
                $('#region_id_' + key).val($(this).find(':selected').data('country-id'));

                RG.Request.post(
                    '/ajax/address/getTownsByCityId',
                    {
                        id: $(this).find(':selected').data('country-id')
                    },
                    function (data) {
                        if (data.success) {

                            var city = $('#region_' + key);
                            city.empty().append('<option data-display=""></option>');
                            $.each(data.data, function (i, row) {
                                $(city).append("<option data-region-id='" + row.region_id + "'>" + row.default_name + "</option>")
                            })
                            city.niceSelect('update');
                        } else {
                            RG.General.alert(data.message);
                        }

                    }, 'json'
                );
                // $(this).closest('div.items').remove();
            });
            $('[id^="region_"]').off('change.address-region').on('change.address-region', function (e) {
                e.preventDefault();
                var key = $(this).data('key');
                var regionId = $(this).find(':selected').data('region-id');
                $(this).parent().find('#region_id_' + key).val(regionId);
                var city = $(this).parent().parent().parent().parent().find('#city_' + key);
                RG.Request.post(
                    '/ajax/address/getTownsByRegionId',
                    {
                        id: regionId
                    },
                    function (data) {
                        if (data.success) {
                            //console.log('regionId');
                            city.empty().append('<option data-display="" value="">İlçe Seçiniz</option>');
                            $.each(data.data, function () {
                                city.append($("<option />").val(this.default_name).text(this.default_name));
                            })
                            if (typeof city.niceSelect === "function") city.niceSelect('update');

                        } else {
                            RG.General.alert(data.message);
                        }

                    }, 'json'
                );
            });
        }
    },
    yeniTicketSave: {
        selector: "#btn-ticket",
        form: $('#yeni-ticket-form'),
        init: function () {
            $('#yeni-ticket-form').off('submit').on('submit', function (e) {
                RG.validation.init($(this));
                let contactForm = $(this);
                RG.validation.init(contactForm);
                if(! RG.validation.validate(contactForm)){
                    return false;
                }

                e.preventDefault();

                RG.Overlay.block(RG.Translate.get('Kaydediliyor'));
                RG.Request.post('/ajax/ticket/save', $(this).serialize(), function (data) {
                    if (data.success) {
                        RG.General.alert(data.message, function () {
                            window.location.href = '/ticket/list';
                        });
                    } else {
                        RG.General.alert(data.message, RG.Overlay.unblock);
                    }
                }, 'json');
            });

            $('#department_id').off('change').on('change',function(e){
                e.preventDefault();
                var post_data = {
                    "department_id": $(this).val(),
                }
                RG.Request.post('/ajax/ticket/sub-department', post_data, function (data) {
                    if (data.success) {
                        var parent_id = $('#department_parent_id');
                        parent_id.empty().append('<option data-display="">'+RG.Translate.get('DEPARTMAN KONUSU SEÇİNİZ')+'</option>');
                        $.each(data.data, function (i,row) {
                            parent_id.append($("<option />").val(row.id).text(row.title));
                        })
                        parent_id.niceSelect('update');
                    } else {
                        RG.General.alert(data.message);
                    }
                }, 'json');
            })
        }

    },
    ticketCevapYaz: {
        selector: "#ticket-detail,.ticket-detail",
        form: $('#ticket-cevap-form'),
        init: function () {
            $("#btn-cevap-yaz").off('click.answer').on("click.answer", function () {
                $('#ticket-cevap-form').submit();
            });


            $('#btn-close-request').off('click.request').on('click.request', function (e) {
                e.preventDefault();
                let data = {
                    'ticket_id': $(this).data("ticket_id")
                }

                RG.Overlay.block(RG.Translate.get('Talebiniz kapatılıyor'));
                RG.Request.post('/ajax/ticket/close', data, function (data) {
                    if (data.success) {
                        RG.General.alert(data.message);
                        window.location.href = '/ticket/list';
                    } else {
                        RG.General.alert(data.message, RG.Overlay.unblock);
                    }
                }, 'json');
            });


            $('#ticket-cevap-form').off('submit').on('submit', function (e) {
                e.preventDefault();

                RG.Overlay.block(RG.Translate.get('Kaydediliyor'));
                RG.Request.post('/ajax/ticket/answer', $(this).serialize(), function (data) {
                    if (data.success) {
                        RG.General.alert(data.message);
                        window.location.href = '/ticket/list';
                    } else {
                        RG.General.alert(data.message, RG.Overlay.unblock);
                    }
                }, 'json');
            });

        }
    },
    stockAlert: {
        selector: '#stockAlert',
        init: function () {

            $('.stockAlert-remove').off('click.stockAlert-remove').on('click.stockAlert-remove', function (e) {
                e.preventDefault();

                if (confirm(RG.Translate.get("Silmek istediğinize emin misiniz?"))) {
                    $(this).closest('tr').remove();
                    $(this).parent().parent().parent().remove();

                    RG.Request.post(
                        '/ajax/stock/remove',
                        {
                            product_id: $(this).find("img").data('product-id')
                        },
                        function (data) {
                            RG.General.alert(data.message, function () {
                            })


                        }, 'json'
                    );
                }
            });
        }
    },
    bultenSave: {
        selector: "#btn-bulten-save",
        form: $('#customer-bulten-form').find('input,checkbox'),
        init: function () {
            $('#customer-bulten-form').off('submit').on('submit', function (e) {
                e.preventDefault();
                RG.validation.init($(this));
                if(! RG.validation.validate($(this))){
                    return false;
                }

                RG.Overlay.block(RG.Translate.get('Kaydediliyor'));

                RG.Request.post('/ajax/customer/subscriptonsSave', $(this).serialize(), function (data) {
					data.newsletterUpdate = 1;
					RG.Overlay.unblock();
					
                    if (data.success) {
                        RG.DataLayer.trigger("login", {response: data});
                        RG.General.alert(data.message, function () {
                            window.location.href = '/customer/subscriptions';
                        });
                    } else {
                        RG.General.alert(data.message, RG.Overlay.unblock);
                    }
                }, 'json');
            });
        }
    },

    DataLayer: {
        trigger: function (eventName, params) {
            $(document).trigger('datalayer.' + eventName, {params: params, data: window.dataLayer});
        }
    },

    Translate: {
        get: function (text) {
            if (typeof RG.Translate.translations[text] !== "undefined") {
                return RG.Translate.translations[text];
            } else {
                return text;
            }
        },
        translations: []
    },

    Orders: {

        selector: "#siparis-cancel,.siparis-cancel",
        //form: $('#customer-bulten-form').find('input,checkbox'),
        init: function () {

            $("a[id*='siparis_iptal']").off('click').on('click', function (e) {
				e.preventDefault();
				var $self = $(this);

				if ($self.closest('.modal').length) {
					siparisIptal(this);

					return;
				}
				
                var r = confirm(RG.Translate.get('Sipariş iptal edilecektir. Emin misiniz ?'));
                if (r == true) {
                    siparisIptal(this);
                }
            });

            /*$("#flo_siparis_iptal").off('click').on('click', function (e) {
                e.preventDefault();
                siparisIptal(this);
            });*/

            function siparisIptal(obj){
                //var id_arr = $(obj).attr('id').split('_');
                var increment_id = $(obj).data('increment-id');
                var warehouse_transaction_id = $(obj).data('warehouse-transaction-id');
                var data = {
                    "increment_id": increment_id,
                    "warehouse_transaction_id": warehouse_transaction_id
                };
                RG.Overlay.block(RG.Translate.get('İptal Ediliyor'));
                $.post('/ajax/customer/ordercancel', data, function (data) {
                    if (data.success == true) {
						RG.DataLayer.trigger('refund', {
							id: String(increment_id),
						});
						
                        RG.General.alert(RG.Translate.get('Başarılı bir şekilde iade yapıldı'), function () {
                            window.location.href = '/customer/orders';
                        });
                    } else {
                        RG.General.alert(RG.Translate.get('Üzgünüz, siparişiniz şu anda iptal edilemedi. Lütfen daha sonra tekrar deneyiniz.'), RG.Overlay.unblock);
                    }

                }, 'json');
                RG.Overlay.unblock;
                $("#cancelOrderModal").modal("hide");

            }
            $(".siparis_iptal_modal").off("click").on("click",function(){
                $("#flo_siparis_iptal").attr("data-increment-id",$(this).data("increment-id"));
                $("#flo_siparis_iptal").attr("data-warehouse-transaction-id",$(this).data("warehouse-transaction-id"));
                $("#cancelOrderModal").modal("show");
                $('.order-detail-box, .mm-page').siblings('.modal-backdrop').remove();
            })


        }

    },
    countries: {

        selector: ".new-countries-list",
        init: function () {

            var text = RG.General.getCookie("text");


            if ((text == "") || (text == undefined)) {
                text = 'DE';
            }

            $('.new-countries .new-icon img').attr('src', '/pub/assets/floshoes/images/mobile_' + text.toLowerCase() + '.png');
            $('.new-countries .new-icon .country-name').text(text);

            $('.new-countries-list li').click(function () {
                var text = $(this).find('a').text();
                $('.new-countries .new-icon img').attr('src', '/pub/assets/floshoes/images/mobile_' + text.toLowerCase() + '.png');
                $('.new-countries .new-icon .country-name').text(text);
                $('.new-countries-list').fadeOut();

                RG.General.setCookie("text", text, 365);
                var text = RG.General.getCookie("text");
            });
        }
    },
    cookieDeeplink: {
        selector: '.cookie-deeplink',
        init: function () {
            var cookies_deeplink = RG.General.getCookie("deeplink");

            if (!cookies_deeplink && window.location.pathname === '/') {
                $('.cookie-deeplink').removeClass('hide');
                $('body').addClass('deeplink-open');
                $(".site-header .main-menu").addClass("deeplink-menu")
            }
        }
    },
    franchiseForm: {
        selector: 'form#franchise_form',
        init: function () {
            $('form#franchise_form').off('submit').on('submit', function (e) {

                RG.validation.init($(this));
                if(! RG.validation.validate($(this))){
                    return false;
                }
                e.preventDefault();
                var formData = new FormData(this);
                RG.Overlay.block(RG.Translate.get('Kayıt Ediliyor'));
                $.ajax({
                    url: "/ajax/franchise/save",
                    type: 'POST',
                    data: formData,
                    async: false,
                    success: function (data) {
                        RG.Overlay.unblock();
                        if(data.success == true){
                            RG.General.alert(data.message, function () {
                                window.location.href = '/';
                            });
                        }else{
                            RG.General.alert(data.message);
                        }
                    },
                    cache:false,
                    contentType: false,
                    processData: false
                });

                return false;
            });


        }
    },
    brands: {
        selector: '.brands-page-wrapper',
        init: function () {
            $(RG.brands.selector).off('keyup.autocomplete').on('keyup.autocomplete', function (e) {

                var value = $(".autocomplete").val().toLowerCase();
                $(".brand-boxes .filter_div").filter(function () {
                    $(this).toggle($(this).find('span').text().toLowerCase().indexOf(value) > -1)
                });
                $(".single-letter-brand").filter(function () {
                    if (value != '') {
                        $(this).toggle($(this).find('ul li a').text().toLowerCase().indexOf(value) > -1)
                    } else {
                        $(".single-letter-brand").filter(function () {
                            $(this).toggle($(this).find('ul li a').text().toLowerCase().charAt(0) != value.charAt(0))
                        });
                    }
                });

            });
        }
    },
    distributorForm: {
        selector: 'form#distributor_form',
        init: function () {
            $('form#distributor_form').off('submit').on('submit', function (e) {

                RG.validation.init($(this));
                if(! RG.validation.validate($(this))){
                    return false;
                }
                e.preventDefault();
                var formData = new FormData(this);
                $.ajax({
                    url: "/ajax/franchise/distributorSave",
                    type: 'POST',
                    data: formData,
                    async: false,
                    success: function (data) {
                        if(data.success == true){
                            RG.General.alert(data.message, function () {
                                window.location.href = '/';
                            });
                        }else{
                            RG.General.alert(data.message);
                        }
                    },
                    cache:false,
                    contentType: false,
                    processData: false
                });

                return false;
            });


        }
    },
    wholesalerForm: {
        selector: 'form#wholesaler_form',
        init: function () {
            $('form#wholesaler_form').off('submit').on('submit', function (e) {

                RG.validation.init($(this));
                if(! RG.validation.validate($(this))){
                    return false;
                }
                e.preventDefault();
                var formData = new FormData(this);
                $.ajax({
                    url: "/ajax/franchise/wholesalerSave",
                    type: 'POST',
                    data: formData,
                    async: false,
                    success: function (data) {
                        if(data.success == true){
                            RG.General.alert(data.message, function () {
                                window.location.href = '/';
                            });
                        }else{
                            RG.General.alert(data.message);
                        }
                    },
                    cache:false,
                    contentType: false,
                    processData: false
                });

                return false;
            });


        }
    },
    contactForm: {
        selector: 'form#contact_form,#help_form,.yeni-ticket-form',
        init: function () {
            $('#contact_form').off('submit').on('submit', function (e) {

                RG.validation.init($(this));
                var contactForm = $(this);
                RG.validation.init(contactForm);
                if(! RG.validation.validate(contactForm)){
                    return false;
                }

                var contactFormModify = contactForm.serialize();

                RG.Overlay.block(RG.Translate.get('Kayıt Ediliyor'));
                e.preventDefault();
                $.post('/ajax/franchise/contactSave', contactFormModify, function (data) {
                    if (data.success == true) {
                        RG.General.alert(RG.Translate.get(data.message), function () {
							if (!$(this).hasClass('no-redirect')) {
								window.location.href = '/';
							}
                        });
                    } else {
                        RG.General.alert(RG.Translate.get(data.message), RG.Overlay.unblock);
                    }
                    RG.Overlay.unblock();

                }, 'json');
            });
            $('#help_form').off('submit').on('submit', function (e) {
                RG.validation.init($(this));
                if(! RG.validation.validate($(this))){
                    return false;
                }
                e.preventDefault();
                $.post('/ajax/franchise/helpSave', $(this).serialize(), function (data) {
                    if (data.success == true) {
                        RG.General.alert(RG.Translate.get(data.message), function () {
                            window.location.href = '/';
                        });
                    } else {
                        RG.General.alert(RG.Translate.get(data.message), RG.Overlay.unblock);
                    }

                }, 'json');
            });
            $("#department").off('change').on('change',function(e){
                e.preventDefault();
                var post_data = {
                    "department_id": $(this).val(),
                }
                RG.Request.post('/ajax/ticket/sub-department', post_data, function (data) {
                    if (data.success) {
                        $("#subject option:gt(0)").remove();
                        $.each(data.data, function (i,row) {
                            $("#subject").append($("<option />").val(row.id).text(row.title));
                        })
                    } else {
                        RG.General.alert(data.message);
                    }
                }, 'json');

            })


        }
    },
    productsPriceAlert:{
        selector:'.discount-alert,.price-page-wrapper',
        init:function(){
            $('#add_price_alert').off('click').on('click',function(){
                var obj = $(this);
                var data ={
                    'product_id':$(obj).data('product-id'),
                    'sku': $(this).data('sku')
                }
                RG.Request.post('/ajax/price_alert/create',data, function (data) {
                    if (data.success == true) {
                        RG.General.alert(RG.Translate.get(data.message), function () {
                            RG.Widget.reload('products/price_alert',{'product_id': $(obj).data('product-id'),'sku': $(obj).data('sku')});
                        });
                    } else {
                        RG.General.alert(RG.Translate.get(data.message), RG.Overlay.unblock);
                    }

                }, 'json');

            })
            $('#remove_price_alert').off('click').on('click',function(){
                var obj = $(this);
                var data ={
                    'product_id':$(obj).data('product-id'),
                }
                $.post('/ajax/price_alert/remove',data, function (data) {
                    if (data.success == true) {
                        RG.General.alert(RG.Translate.get(data.message), function () {
                            RG.Widget.reload('products/price_alert',{'product_id': $(obj).data('product-id'),'sku': $(obj).data('sku')});
                        });
                    } else {
                        RG.General.alert(RG.Translate.get(data.message), RG.Overlay.unblock);
                    }

                }, 'json');

            })
            $('.remove-from-price-button').off('click').on('click',function(e){
                e.preventDefault();
                var obj = $(this);
                var data ={
                    'product_id':$(obj).data('product-id'),
                }
                $.post('/ajax/price_alert/remove',data, function (data) {
                    if (data.success == true) {
                        RG.General.alert(RG.Translate.get(data.message), function () {
                            var say = $(".favourites-page-wrapper .product-box").length;
                            if(say == 0){
                                RG.Widget.reload('customer/price_notification');
                            }
                        });
                    } else {
                        RG.General.alert(RG.Translate.get(data.message), RG.Overlay.unblock);
                    }

                }, 'json');

            })
        }
	},
	QuickView: {
		selector: '.product-quick-view-open',
		init: function () {
			$(RG.QuickView.selector).off('click').on('click', RG.QuickView.open);
		},
		open: function (e) {
			e.preventDefault();
			var $self = $(this);
			var productId = $self.data('product-id');

			$.fancybox.open({
				src  : '<div data-widget="products/detail" class="widget widget_products_detail"><div style="padding: 100px"><div class="fancybox-loading"></div></div></div>',
				type : 'inline',
				opts : {
					afterShow : function( instance, current ) {
						$('body').addClass('product-quickview-opened');

						RG.Widget.reload('products/detail', {
							product_id: productId,
							is_quick_view: 1,
						}, function () {
							$('body').trigger('change');

							$(document).trigger('product.quickview.show');
						});

						$('#fancybox-container-' + instance.id).addClass('fancybox-quickview');
					},
					afterClose: function () {
						$('body').removeClass('product-quickview-opened');
						$('.zoomContainer').remove();
					}
				}
			});

		}
	},

    LoginAsCustomer: {
        selector: '.site-header',
        init: function () {
            if ($.cookie('login_as_customer_message') == 1) {
                $('#login-as-customer-message').show();
            }
        },
    },
    MostProducts: {
        selector: '.most-page-wrapper',
        init: function () {
            $('.remove-from-most-button').off('click').on('click',function (e) {
                /**
                 * flo favorilerim
                 */
                e.preventDefault();
                var selectedProduct = $(this).closest('.product-box');
                var product_id = $(this).data('product-id');

                //Ajax request
                removeMostlist(product_id, selectedProduct.parent());
                selectedProduct.parent().remove();
            });
            $('.remove-most').off('click.remove-most').on('click.remove-most', function (e) {
                e.preventDefault();
                var product_id = $(this).find("img").data('product-id');
                $(this).closest('tr').remove();
                removeMostlist(product_id, $(this));
            });

            function removeMostlist(product_id, $el) {
                RG.Request.post(
                    '/ajax/wishlist/mostProductDelete',
                    {
                        product_id: product_id
                    },
                    function (data) {
                        if(data.success){
                            RG.General.alert(RG.Translate.get(data.message), function () {
                                if($(".product-box").length == 0){
                                    RG.Widget.reload('customer/most_viewed_products', {
                                        cache_refresh: 1
                                    });
                                }
                            });
                        }

                    }, 'json'
                );
            }
        },
	},
	ShippingMethods: {
		selector: 'input[name="shipping_method"]',
		init: function () {
			$(document).on('change', RG.ShippingMethods.selector, function () {
				$.cookie('selected_shipping_method', $(this).val());
			});

			var selectedShippingMethod = $.cookie('selected_shipping_method');
			if (selectedShippingMethod) {
				$(RG.ShippingMethods.selector).filter('[value="'+ selectedShippingMethod +'"]').prop('checked', true).trigger('change');
			}
		}
	}
};

$(function () {
    RG.init();
});
