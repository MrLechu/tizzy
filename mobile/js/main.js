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
    gifGirl_0: undefined,
    gifGirl_1: undefined
};
//wersja z konstruktorem

function Gif(what) {
    "use strict";
    this.gif = what;
    this.gW = 0;
    this.speed = 2.5;
    this.tl = new TimelineLite();
}

Gif.prototype.init = function (speed, isPlaying) {
    if (speed) {
        this.speed = speed;
    }
    var myObject = {a: 0},
        gifWidth = $(this.gif).css('width'),
        gif = this.gif;

    function updateFn() {
        $(gif).css("backgroundPosition", myObject.a + "px 0px");
    }
    function repeatFn() {
        this.restart();
    }

    gifWidth = 2 * gifWidth.replace("px", "");

    this.tl = TweenLite.to(myObject, this.speed, {a: -gifWidth, ease: SteppedEase.config(2), onUpdate: updateFn, onComplete: repeatFn});

    if (isPlaying) {
        this.tl.resume();
    } else {
        this.tl.pause();
    }
}

Gif.prototype.play = function (speed) {
    this.tl.resume();
}

Gif.prototype.pause = function () {
    this.tl.pause();
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
        if (TIZZY.category === "girls") {
            TIZZY.gifGirl_0.init(false, true);
            TIZZY.gifGirl_1.init(false, false);
        }
        if (TIZZY.category === "boys") {
            // start pierwszego gifa w sekcji dla chłpców
        }
    }

    function onComplete() {
        TweenLite.fromTo(layer, 0.7, {opacity: 1}, {opacity: 0, ease: animEase, onComplete: onOpacityComplete});
        TIZZY.productDetails();
        TIZZY.productSize();
    }

    layerGirls.hammer().bind("panright click", function () {
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

        TIZZY.gifGirl_0 = new Gif('.gif0');
        TIZZY.gifGirl_1 = new Gif('.gif1');

    });

    layerBoys.hammer().bind("panleft click", function () {
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
        TweenLite.to($('.show-details'), 0.3, {opacity: 0, scale: 0.5});
    });

    owlGirls.on('dragged.owl.carousel', function (event) {
        TweenLite.to($('.show-details'), 0.3, {opacity: 1, scale: 1});
    });


    owlGirls.on('translate.owl.carousel', function (event) {
        if (event.item.index === 0) {
            TIZZY.gifGirl_0.tl.pause();
        }
        if (event.item.index === 1) {
            TIZZY.gifGirl_1.tl.pause();
        }
    });

    owlGirls.on('translated.owl.carousel', function (event) {
        TIZZY.sliderIndex = event.item.index;
        console.log(TIZZY.sliderIndex);
        if (TIZZY.sliderIndex === 0) {
            //cena po obniżce
            prizeValue.text('39');
            TIZZY.gifGirl_0.tl.resume();
            TIZZY.gifGirl_1.tl.pause();
        } else if (TIZZY.sliderIndex === 1) {
            prizeValue.text('45');
            TIZZY.gifGirl_0.tl.pause();
            TIZZY.gifGirl_1.tl.resume();

        } else if (TIZZY.sliderIndex === 2) {
            prizeValue.text('90');
            TIZZY.gifGirl_0.tl.pause();
            TIZZY.gifGirl_1.tl.pause();
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
    var $sizeTrigger = $('.sizer__trigger'),
        size = $(".sizer__trigger > span").text();

    $sizeTrigger.click(function (event) {
        event.preventDefault();
        TIZZY.doc.addClass('modal-active modal-sizes');

        History.pushState(null, "size", "?rozmiar=" + size);

        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.tl.pause();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.tl.pause();
        }
    });

    $('.modal-close').click(function (e) {
        e.preventDefault();
        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.tl.resume();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.tl.resume();
        }
    });

    $('.sizer__size').click(function (e) {
        e.preventDefault();
        var thatSize = $(this),
            thatSizeText = thatSize.data("size");

        size = thatSizeText;

        thatSize.siblings('input:radio').prop("checked");

        $(".sizer__trigger span").text("");
        $(".sizer__trigger span").text(size);

        History.replaceState(null, "size", "?rozmiar=" + size);

        //TIZZY.doc.removeClass('modal-active modal-sizes modal-form');
        $(".sizer__size").removeClass("active");
        thatSize.addClass('active');
    });

    $('.sizer .btn').click(function (e) {
        e.preventDefault();

        TIZZY.doc.removeClass('modal-active modal-sizes modal-form');
        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.tl.resume();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.tl.resume();
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
    });

    //gesty mobile

    var hp = document.getElementById("productModal"),
        swipeDown = new Hammer.Manager(hp);



    swipeDown.add(
        new Hammer.Pan({
            direction: Hammer.DIRECTION_VERTICAL,
            treshold: 80,
            pointers: 0
        })
    );


    //ukrycie szczegółów produktu
    swipeDown.on("panend", function (ev) {
        if (ev.direction === Hammer.DIRECTION_DOWN) {
            TIZZY.productDetails.prototype.hideContent();
        }
    });

    var sp = document.getElementById("girls-carousel"),
    swipeUp = new Hammer.Manager(sp);

    swipeUp.add(
        new Hammer.Pan({
            direction: Hammer.DIRECTION_VERTICAL,
            treshold: 80,
            pointers: 0
        })
    );

    //pokazanie szczegóły produktu
    swipeUp.on("panend", function (ev) {
        if (ev.direction === Hammer.DIRECTION_UP) {
            TIZZY.productDetails.prototype.showContent('#girls-carousel', TIZZY.sliderIndex);
        }
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
        TIZZY.gallery();
    }

    function onCompleteFn() {
        TIZZY.gifGirl_0.tl.pause();
        TIZZY.gifGirl_1.tl.pause();
    }

    var slideLeftElem = $('.modal').find('.slide-left'),
        modalFadeElem = $('.modal').find('.fade');

    TweenLite.to(slideLeftElem, 0.35, {x: '0', ease: animEase});
    TweenLite.fromTo(TIZZY.modalOverlay, 0.35, {opacity: 0}, {opacity: 1, ease: animEase, onStart: onStartFn, onComplete: onCompleteFn});
    TweenLite.fromTo(modalFadeElem, 0.35, {opacity: 0}, {opacity: 1, ease: animEase});
};

TIZZY.productDetails.prototype.hideContent = function () {
    "use strict";
    event.preventDefault();

    function onCompleteFn() {
        $('#productModal').find('.product').remove();
        TIZZY.doc.removeClass('modal-active modal-description');
        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.tl.play();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.tl.play();
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
    var until = new Date(2015, 10 - 1, 31);

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
        TIZZY.gifGirl_0.tl.pause();
        TIZZY.gifGirl_1.tl.pause();
    });
};

TIZZY.gallery = function () {
    var galleryTrigger = $('.gallery-trigger');

    galleryTrigger.click(function (ev) {
        ev.preventDefault();
        TIZZY.doc.addClass('modal-gallery');
    });

    var mySwiper = new Swiper ('.swiper-container', {
        // Optional parameters
        direction: 'horizontal',
        loop: false,
        setWrapperSize: true,
        slidesPerView: 5,
        spaceBetween: 20,
        slidesOffsetBefore: 15,
        slidesOffsetAfter: 15,
        breakpoints: {
            320: {
              slidesPerView: 5
            }
        }
    });

    $('.photo-big').zoom({
        url: media_url + 'img/test.jpg',
        magnify: 1.5
    });
}

$(".modal-close").click(function (ev) {
    "use strict";
    ev.preventDefault();
    var self = $(this);

    if (self.hasClass(".gallery-close")) {
        TIZZY.doc.removeClass('modal-gallery');
    } else {
        TIZZY.doc.removeClass('modal-active modal-sizes modal-form');
    }
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
    TIZZY.slider();
    TIZZY.menu();
    TIZZY.timer();
    TIZZY.form();

    //MBP.preventScrolling();
    //TIZZY.debug();
});

