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

    CategoryFilters: {
        selector: '.category_filters',
        form: $('.category_filters'),
        init: function () {
            $('.checkbox').iCheck({checkboxClass: 'icheckbox_square_gold', radioClass: 'iradio_square_gold'});
            $('.checkboxs').iCheck({checkboxClass: 'icbtn', radioClass: 'iradio_square_gold'});
            $('.checkboxa').iCheck({checkboxClass: 'icbtn', radioClass: 'iradio_square_gold'});
            $('.checkboxab').iCheck({checkboxClass: 'icbtn', radioClass: 'iradio_square_gold'});
            $('.checkboxabc').iCheck({checkboxClass: 'icbtn', radioClass: 'iradio_square_gold'});

            $(RG.CategoryFilters.selector + ' label').off('click.filter').on('click.filter', function () {
                setTimeout(RG.CategoryFilters.refresh, 10);
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
        },
        refresh: function () {
            $.post(window.location.href, $(RG.CategoryFilters.selector).serialize(), function (data) {
                $('.product-lists').html($(data).find('.product-lists').html());
                $('.category_filters').html($(data).find('.category_filters').html());

                RG.CategoryFilters.init();
            });
        }

    }

};

$(document).ready(function () {
    RG.init();
    $("#btn_deneme").click(function(){
        alert("dddd");
    })
});
