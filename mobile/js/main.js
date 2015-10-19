/*jslint browser: true*/
/*globals $, window, alert, TweenLite, ease, Power0, SteppedEase, MBP*/
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
    modalOverlay: $('.modal').find('.modal-overlay'),
    category: '',
    sliderIndex: 0,
    modalContent: $('.modal').find('.modal-content')
};

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
        // TIZZY.t.play();
    }

    layerGirls.click(function () {
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

    layerBoys.click(function () {
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

TIZZY.productSize = function () {
    "use strict";
    var $sizeTrigger = $('.sizer__trigger');

    $sizeTrigger.click(function (event) {
        event.preventDefault();
        TIZZY.doc.addClass('modal-active modal-sizes');
        TIZZY.t.pause();
    });

    $('.modal-close').click(function (e) {
        e.preventDefault();
        TIZZY.doc.removeClass('modal-active modal-sizes');
        //TIZZY.t.play();
    });
};

TIZZY.menu = function () {
    "use strict";
    $('.mobilemenu-trigger').click(function () {
        $('.menu').toggleClass('is-active');
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
        TIZZY.t.play();
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
        //TIZZY.t.pause();
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
    }

    var slideLeftElem = $('.modal').find('.slide-left'),
        modalFadeElem = $('.modal').find('.fade');

    TweenLite.to(modalFadeElem, 0.5, {opacity: 0, ease: animEase});
    TweenLite.to(slideLeftElem, 0.3, {x: '-100%', ease: animEase});
    TweenLite.to(TIZZY.modalOverlay, 0.4, {opacity: '0', ease: animEase, onComplete: onCompleteFn});
};




TIZZY.slider = function () {
    "use strict";
    var owlGirls = $("#girls-carousel");

    owlGirls.owlCarousel({
        items: 1,
        dots: false,

        onInitialized: function () {
            var footer = $('.main-footer');

            //gif1 = $('#girls-carousel').find('.owl-item').eq(0).find('.gif');

            $(".model").each(function () {
                var thatModel = $(this);
                thatModel.css({
                    bottom: footer.height()
                });
            });

            // trzeba będzie ustawić domyślny produkt
            prizeValue.text(39);
            // console.log(gif);
            // gif.pause();

            //gifff
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
            //TIZZY.t.pause();
        } else {
            TweenLite.to(footerText, 0.5, {opacity: 0});
            TweenLite.to(footerFadeElem, 0.5, {opacity: 1});
            //TIZZY.t.play();
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
                    bottom: footer.height()
                });
            });

            $(window).resize(function () {
                $(".model").each(function () {
                    var thatModel = $(this);
                    thatModel.css({
                        bottom: footer.height()
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

TIZZY.timer = function () {
    "use strict";
    var until = new Date(2015, 10 - 1, 14);

    $('#defaultCountdown').countdown({until: until, compact: false, padZeroes: true, format: 'HMS'});
};

TIZZY.debug = function () {
    "use strict";
    $(".layer").hide();
    $("body").addClass('girls');
    $("#girls").css('left', 0);
    $("#girls .wrap").css('right', 0);
    $("#boys").css('right', '100%');
};

//tworzymy objekt

//wersja z konstruktorem
function Gif(what) {
    "use strict";
    this.gif = what;
    this.tl = null;
    this.gW = 0;
    this.play = function () {
        this.gW = 2 * $(this.gif).width();
        this.gif = what;
        
        function onCompleteFn() {
            this.restart();
        } 
        var gf = $(this.gif);

        this.tl = TweenLite.to(gf, 3, {backgroundPosition: -(this.gW) + "px 0px", ease: SteppedEase.config(2), onComplete: onCompleteFn});


    };
    this.repeat = function () {
        this.restart();
    };
    this.pause = function () {
        this.tl.pause();
    };
}

var gif1 = new Gif('.gif1');
gif1.play();
//gif1.pause();

// TIZZY.Gif = function (gif) {
//     "use strict";
//     this.name = gif;
//     this.tl = null;
//     this.myObject = {a: 0};
// };

// TIZZY.Gif.prototype.play = function () {
//     "use strict";

//     var gifWidth = 0;
//     var myObject = this.myObject;

//     this.tl;

//     function updateFn() {
//         $(this.name).css('backgroundPosition', myObject.a + 'px 0px');
//     }
//     function repeatFn() {
//         console.log(TIZZY.Gif.call(this.name));
//         //this.tl.restart();
//     }

//     gifWidth = 2 * $(this.name).width();

//     this.tl = TweenLite.to(myObject, 2, {a: -gifWidth, ease: SteppedEase.config(2), onUpdate: updateFn, onComplete: repeatFn});
// };

// TIZZY.Gif.prototype.pause = function () {
//     "use strict";
//     //var tl = this.tl;
//     //tl.pause();
//     alert(this.tl)
// };

// //wersja literal
// var GifL = {
//     gif: '.gif1',
//     play: function () {
//         alert('play: ' + this.gif);
//     },
//     pause: function () {
//         alert('pause: ' + this.gif);
//     }
// }

//wywołujemy metodę

//GifL.play();
//var myGif = new GifC('dupa huj kurwa cipa');
//myGif.play('z leszkiem');




$(function () {
    "use strict";
    wH = $(window).height();
    $('#girls, #boys').css('height', wH);

    TIZZY.startPage();
    TIZZY.productSize();
    TIZZY.slider();
    TIZZY.menu();
    TIZZY.timer();
    MBP.preventScrolling();
    TIZZY.debug();

});