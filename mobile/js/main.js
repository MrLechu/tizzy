/*jslint browser: true*/
/*globals $, window, alert, TweenLite, ease, Power0, SteppedEase, MBP, Hammer, media_url*/
var TIZZY,
    wH,
    prizeValue = $('.prize-value'),
    footerFadeElem = $('.main-footer').find('.fade'),
    footerText = $('.main-footer').find('.text'),
    animEase = Power0.easeNone;

TIZZY = TIZZY || {};


TIZZY = {
    doc: $('body'),
    modal: $('.modal'),
    modalOverlay: $('#productModal').find('.modal-overlay'),
    category: '',
    sliderIndex: 0,
    modalContent: $('#productModal').find('.modal-content'),
    gifGirl_0: null,
    gifGirl_1: null
};
//wersja z konstruktorem

function Gif(what) {
    "use strict";
    this.gif = what;
    this.gW = 0;
    this.speed = 2.5;
    this.tl = null;
    this.play = function (speed) {
        var myObject = {a: 0},
            gifWidth = $(this.gif).css('width'),
            gif = this.gif;

        //this.gif = what;

        if (speed) {
            this.speed = speed;
        }
        function updateFn() {
            $(gif).css("backgroundPosition", myObject.a + "px 0px");
        }
        function repeatFn() {
            this.restart();
        }

        gifWidth = 2 * gifWidth.replace("px", "");

        this.tl = TweenLite.to(myObject, this.speed, {a: -gifWidth, ease: SteppedEase.config(2), onUpdate: updateFn, onComplete: repeatFn});

    };
    this.pause = function () {
        this.tl.pause();
    };
}

TIZZY.startPage = function () {
    "use strict";
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

        TIZZY.gifGirl_0.play();

        if (TIZZY.category === "girls") {
            $("#boys").remove();
        }
        if (TIZZY.category === "boys") {
            $("#girls").remove();
        }
    }

    layerGirls.hammer().bind("swpieright click", function () {
        TIZZY.doc.addClass('girls');

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

    layerBoys.hammer().bind("swpieleft click", function () {
        TIZZY.doc.addClass('boys');
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

TIZZY.slider = function () {
    "use strict";
    var owlGirls = $("#girls-carousel"),
        footer = $('.main-footer');

    owlGirls.owlCarousel({
        items: 1,
        dots: false,
        onInitialized: function () {
            // var gifGirlImg_0 = $('#girls-carousel').find('.owl-item').eq(0).find('.gif0'),
            //     gifGirlImg_1 = $('#girls-carousel').find('.owl-item').eq(1).find('.gif1');

            TIZZY.gifGirl_0 = new Gif('.gif0');
            TIZZY.gifGirl_1 = new Gif('.gif1');

            $(".model").each(function () {
                var thatModel = $(this);
                thatModel.css({
                    bottom: footer.height()
                });
            });
            // trzeba będzie ustawić domyślny produkt
            prizeValue.text(39);
        }
    });
    owlGirls.on('drag.owl.carousel', function (event) {
        console.log(event);
        if (event.item.index === 0) {
            TIZZY.gifGirl_0.pause();
        }
        if (event.item.index === 1) {
            TIZZY.gifGirl_1.pause();
        }
        TweenLite.to($('.show-details'), 0.3, {opacity: 0, scale: 0.5});
    });

    owlGirls.on('dragged.owl.carousel', function (event) {
        if (event.item.index === 0) {
            TIZZY.gifGirl_0.play();
        }
        if (event.item.index === 1) {
            TIZZY.gifGirl_1.play();
        }
        TweenLite.to($('.show-details'), 0.3, {opacity: 1, scale: 1});
    });

    owlGirls.on('translated.owl.carousel', function (event) {
        TIZZY.sliderIndex = event.item.index;
        TweenLite.to($('.show-details'), 0.3, {opacity: 1, scale: 1});
        if (TIZZY.sliderIndex === 0) {
            //cena po obniżce
            prizeValue.text('39');

            //uruchomienie danego gifa
            TIZZY.gifGirl_0.play();

            //zatrzymanie pozostałych gifów
            //TIZZY.gifGirl_1.pause();

        } else if (TIZZY.sliderIndex === 1) {
            prizeValue.text('45');
            //TIZZY.gifGirl_0.pause();
            TIZZY.gifGirl_1.play();
        } else if (TIZZY.sliderIndex === 2) {
            prizeValue.text('90');
            TIZZY.gifGirl_0.pause();
            TIZZY.gifGirl_1.pause();
        }

        /*zmiana stopki*/
        if (TIZZY.sliderIndex === 0) {
            TweenLite.to(footerText, 0.5, {opacity: 0});
            TweenLite.to(footerFadeElem, 0.5, {opacity: 1});
        } else {
            TweenLite.to(footerText, 0.5, {opacity: 1});
            TweenLite.to(footerFadeElem, 0.5, {opacity: 0});
        }
    });

    var owlBoys = $("#boys-carousel");

    owlBoys.owlCarousel({
        items: 1,
        dots: false
    //     ,
    //     onInitialized: function () {
    //         var footer = $('.main-footer');

    //         $(".model").each(function () {
    //             var thatModel = $(this);
    //             thatModel.css({
    //                 bottom: footer.height()
    //             });
    //         });

    //         $(window).resize(function () {
    //             $(".model").each(function () {
    //                 var thatModel = $(this);
    //                 thatModel.css({
    //                     bottom: footer.height()
    //                 });
    //             });
    //         });
    //     }
    });

    owlBoys.on('translated.owl.carousel', function (event) {
        var itemIndex = event.item.index;
        TIZZY.sliderIndex = itemIndex;
    });
};

TIZZY.productSize = function () {
    "use strict";
    var $sizeTrigger = $('.sizer__trigger');

    $sizeTrigger.click(function (event) {
        event.preventDefault();
        TIZZY.doc.addClass('modal-active modal-sizes');
        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.pause();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.pause();
        }
    });

    $('.modal-close').click(function (e) {
        e.preventDefault();

        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.play();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.play();
        }
    });
};


TIZZY.productDetails = function () {
    "use strict";
    var $hideDetails = $('.hide-details');

    $('body.girls').find('.show-details').click(function () {
        TIZZY.productDetails.prototype.showContent('#girls-carousel', TIZZY.sliderIndex);
    });

    $('body.boys').find('.show-details').click(function () {
        TIZZY.productDetails.prototype.showContent('#boys-carousel', TIZZY.sliderIndex);
    });

    $hideDetails.on('click', function () {
        TIZZY.productDetails.prototype.hideContent();
        //TIZZY.t.play();
    });
};

TIZZY.productDetails.prototype.showContent = function (carousel, index) {
    "use strict";
    $(carousel)
        .find('.owl-item')
        .eq(index)
        .find('.product')
        .clone()
        .appendTo(TIZZY.modalContent);

    function onStartFn() {
        TIZZY.doc.addClass('modal-active modal-description');
        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.pause();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.pause();
        }
    }

    var slideLeftElem = $('.modal').find('.slide-left'),
        modalFadeElem = $('.modal').find('.fade');

    TweenLite.to(slideLeftElem, 0.3, {x: '0', ease: animEase});
    TweenLite.fromTo(TIZZY.modalOverlay, 0.4, {opacity: 0}, {opacity: 1, ease: animEase, onStart: onStartFn});
    TweenLite.fromTo(modalFadeElem, 0.5, {opacity: 0}, {opacity: 1, ease: animEase});
};

TIZZY.productDetails.prototype.hideContent = function () {
    "use strict";
    event.preventDefault();

    function onCompleteFn() {
        $('#productModal').find('.product').remove();
        TIZZY.doc.removeClass('modal-active modal-description');
        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.play();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.play();
        }
    }

    var slideLeftElem = $('.modal').find('.slide-left'),
        modalFadeElem = $('.modal').find('.fade');

    TweenLite.to(modalFadeElem, 0.5, {opacity: 0, ease: animEase});
    TweenLite.to(slideLeftElem, 0.3, {x: '-100%', ease: animEase});
    TweenLite.to(TIZZY.modalOverlay, 0.4, {opacity: '0', ease: animEase, onComplete: onCompleteFn});
};

TIZZY.menu = function () {
    "use strict";
    $('.mobilemenu-trigger').click(function () {
        $('.menu').toggleClass('is-active');
        $("body").toggleClass('menu-active');
    });
};

TIZZY.timer = function () {
    "use strict";
    var until = new Date(2015, 10 - 1, 30);

    $('#defaultCountdown').countdown({until: until, compact: false, padZeroes: true, format: 'HMS'});
};

TIZZY.form = function () {
    "use strict";
    $('.form input:checkbox').checkbox({
        empty: media_url + 'img/empty.png'
    });
    $('.form input:radio').checkbox({
        empty: media_url + 'img/empty.png'
    });
    $('.btn--buy').click(function (ev) {
        ev.preventDefault();
        TIZZY.doc.addClass('modal-active modal-form');
        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.pause();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.pause();
        }
    });

};


$(".modal-close").click(function (ev) {
    "use strict";
    ev.preventDefault();
    TIZZY.doc.removeClass('modal-active modal-sizes modal-form');
});


TIZZY.debug = function () {
    "use strict";
    $(".layer").hide();
    $("body").addClass('girls');
    $("#girls").css('left', 0);
    $("#girls .wrap").css('right', 0);
    $("#boys").css('right', '100%');
};


$(function () {
    "use strict";
    wH = $(window).height();
    $('#girls, #boys').css('height', wH);

    TIZZY.startPage();
    TIZZY.productSize();
    TIZZY.slider();
    TIZZY.menu();
    TIZZY.timer();
    TIZZY.form();
    //MBP.preventScrolling();
    //TIZZY.debug();

});