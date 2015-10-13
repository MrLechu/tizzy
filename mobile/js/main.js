/*jslint browser: true*/
/*globals TweenLite, ease, Power0, SteppedEase, MBP*/
var TIZZY,
    wH,
    doc = $('body'),
    modal = $('.modal'),
    modalOverlay = modal.find('.modal-overlay'),
    product,
    prizeValue = $('.prize-value'),
    slideLeftElem = modal.find('.slide-left'),
    modalfadeElem = modal.find('.fade'),
    footerFadeElem = $('.main-footer').find('.fade'),
    footerText = $('.main-footer').find('.text'),
    animEase = Power0.easeNone;

TIZZY = TIZZY || {};

TIZZY.category = '';
TIZZY.sliderIndex = 0;
TIZZY.modalContent = $('.modal-content');
TIZZY.t = '';

TIZZY.startPage = function () {
    var layer = $('.layer'),
        layerGirls = $('#layer-girls'),
        layerBoys = $('#layer-boys'),
        girls = $('#girls'),
        boys = $('#boys'),
        girsLayerText = layerGirls.find('.layer-text'),
        boysLayerText = layerBoys.find('.layer-text'),
        boysWrap = boys.find('.wrap'),
        girlsWrap = girls.find('.wrap');

    function onOpacityComplete() {
        layer.remove();
    }

    function onComplete() {
        TweenLite.fromTo(layer, 0.7, {opacity: 1}, {opacity: 0, ease: animEase, onComplete: onOpacityComplete});
        TIZZY.productDetails();
        TIZZY.t.play();
    }

    layerGirls.click(function () {
        doc.addClass('girls');
        girls.css('zIndex', 2);
        boys.css('zIndex', 1);

        TweenLite.to(layerGirls, 1, {width: '100%', ease: animEase});
        TweenLite.to(layerBoys, 1, {right: '-50%', ease: animEase});

        TweenLite.to(girsLayerText, 0.7, {opacity: 0, left: -50, ease: animEase});
        TweenLite.to(boysLayerText, 0.7, {opacity: 0, ease: animEase});

        TweenLite.to(girls, 0.5, {left: 0, ease: animEase});
        TweenLite.to(girlsWrap, 0.5, {right: 0, ease: animEase, onComplete: onComplete});

        TIZZY.category = 'girls';
    });

    layerBoys.click(function () {
        doc.addClass('boys');
        boys.css('zIndex', 2);
        girls.css('zIndex', 1);

        TweenLite.to(layerBoys, 1, {width: '100%', ease: animEase});
        TweenLite.to(layerGirls, 1, {left: '-50%', ease: animEase});

        TweenLite.to(boysLayerText, 0.7, {opacity: 0, right: -50, ease: animEase});

        TweenLite.to(boys, 0.5, {right: 0, ease: animEase});
        TweenLite.to(boysWrap, 0.5, {left: 0, ease: animEase, onComplete: onComplete});

        TIZZY.category = 'boys';
    });
};

TIZZY.productSize = function () {
    var $sizeTrigger = $('.product__size__trigger'),
        $sizeContainer = $('.product__size__sizes');

    $sizeTrigger.click(function (event) {
        event.preventDefault();
        $sizeTrigger.toggleClass('active');
        $sizeContainer.toggleClass('active');
    });
    // $(document).on('click', function (e) {
    //     console.log(e.target)
    //     // if (!$(e.target).hasClass('product__size__trigger')) {
    //     //     console.log('sfdsd');
    //     //     $sizeContainer.hide();
    //     // }
    // });
};

TIZZY.menu = function () {
    $('.mobilemenu-trigger').click(function () {
        $('.menu').toggleClass('is-active');
    });
};

TIZZY.productDetails = function () {
    var $hideDetails = $('.hide-details');

    $('body.girls').find('.show-details').click(function () {
        TIZZY.productDetails.prototype.showContent('#girls-carousel', TIZZY.sliderIndex);
    });

    $('body.boys').find('.show-details').click(function () {
        TIZZY.productDetails.prototype.showContent('#boys-carousel', TIZZY.sliderIndex);
    });

    $hideDetails.on('click', function () {
        TIZZY.productDetails.prototype.hideContent();
        TIZZY.t.play();
    });
};

TIZZY.productDetails.prototype.showContent = function (carousel, index) {

    $(carousel)
        .find('.owl-item')
        .eq(index)
        .find('.product')
        .clone()
        .appendTo(TIZZY.modalContent);

    function onStartFn() {
        doc.addClass('modal-active');
        TIZZY.t.pause();
    }

    slideLeftElem = modal.find('.slide-left');
    modalFadeElem = modal.find('.fade');

    TweenLite.to(slideLeftElem, 0.3, {left: '0', ease: animEase});
    TweenLite.fromTo(modalOverlay, 0.4, {opacity: 0}, {opacity: '1', ease: animEase, onStart: onStartFn});
    TweenLite.fromTo(modalFadeElem, 0.5, {opacity: 0}, {opacity: 1, ease: animEase});
};

TIZZY.productDetails.prototype.hideContent = function () {
    event.preventDefault();

    function onCompleteFn() {
        $('.modal-content').find('.product').remove();
        doc.removeClass('modal-active');
    }

    TweenLite.to(modalFadeElem, 0.5, {opacity: 0, ease: animEase});
    TweenLite.to(slideLeftElem, 0.3, {left: '-100%', ease: animEase});
    TweenLite.to(modalOverlay, 0.4, {opacity: '0', ease: animEase, onComplete: onCompleteFn});
};

TIZZY.timer = function () {
    var until = new Date(2015, 10 - 1, 14);

    $('#defaultCountdown').countdown({until: until, compact: false, padZeroes: true, format: 'HMS'});
};

TIZZY.slider = function () {
    var owlGirls = $("#girls-carousel");

    owlGirls.owlCarousel({
        items: 1,
        dots: false,

        onInitialized: function () {
            var footer = $('.main-footer'),
                myObject = {a: 0},
                gif = $('#girls-carousel').find('.owl-item').eq(0).find('.gif');

            $(".model").each(function () {
                var thatModel = $(this);
                thatModel.css({
                    'bottom': footer.height()
                });
            });

            // trzeba będzie ustawić domyślny produkt
            prizeValue.text(39);

            $(window).resize(function () {
                $(".model").each(function () {
                    var thatModel = $(this);
                    thatModel.animate({
                        'height': footer.height()
                    }, 100);
                });
            });
            function updateFn() {
                gif.css('backgroundPosition', myObject.a + 'px 0px');
            }
            function repeatFn() {
                TIZZY.t.restart();
            }

            var gifWidth = $('.gif').css('width');
            gifWidth = 2 * gifWidth.replace('px', '');
            TIZZY.t = TweenLite.to(myObject, 2, {a: -gifWidth, ease: SteppedEase.config(2), onUpdate: updateFn, onComplete: repeatFn});
            TIZZY.t.pause();
        }
    });

    owlGirls.on('translated.owl.carousel', function (event) {
        var itemIndex = event.item.index;
        TIZZY.sliderIndex = itemIndex;

        if (itemIndex === 0) {
            prizeValue.text('39');
        } else if (itemIndex === 1) {
            prizeValue.text('45');
        } else {
            prizeValue.text('90');
        }

        if (itemIndex !== 0) {
            TweenLite.to(footerText, 0.5, {opacity: 1});
            TweenLite.to(footerFadeElem, 0.5, {opacity: 0});
            TIZZY.t.pause();
        } else {
            TweenLite.to(footerText, 0.5, {opacity: 0});
            TweenLite.to(footerFadeElem, 0.5, {opacity: 1});
            TIZZY.t.play();
        }
    });

    var owlBoys = $("#boys-carousel");

    owlBoys.owlCarousel({
        items: 1,
        dots: false,

        onInitialized: function () {
            var footer = $('.main-footer');

            $(".model").each(function () {
                var thatModel = $(this);
                thatModel.css({
                    'bottom': footer.height()
                });
            });

            $(window).resize(function () {
                $(".model").each(function () {
                    var thatModel = $(this);
                    thatModel.css({
                        'bottom': footer.height()
                    });
                });
            });
        }
    });

    owlBoys.on('translated.owl.carousel', function (event) {
        var itemIndex = event.item.index;
        TIZZY.sliderIndex = itemIndex;


    });
};

TIZZY.gif = function () {
    var $gifItemFirst = $('.gif').find('img:first');
    $gifItemFirst.hide();
    $gifItemFirst.next().show();
};

$(function () {
    wH = $(window).height();
    $('#girls, #boys').css('height', wH);

    TIZZY.startPage();
    TIZZY.productSize();
    TIZZY.slider();
    TIZZY.menu();
    TIZZY.timer();
    MBP.preventScrolling();
    TIZZY.gif();
});