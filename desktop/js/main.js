/*jslint browser: true*/
/*globals $, window, alert, TweenLite, ease, Power0, SteppedEase, MBP, Hammer, media_url, TimelineLite*/
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


TIZZY.config = {
    productImage: "produkty"
};

var config = TIZZY.config;

function Gif(what) {
    "use strict";
    this.gif = what;
    this.gW = 0;
    this.speed = 2.5;
    this.tl = new TimelineLite();
}

Gif.prototype.init = function (speed, isPlaying) {
    "use strict";
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
};


Gif.prototype.play = function (speed) {
    "use strict";
    this.tl.resume();
};

Gif.prototype.pause = function () {
    "use strict";
    this.tl.pause();
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
        if (TIZZY.category === "girls") {
            TIZZY.gifGirl_0.init(false, true);
            TIZZY.gifGirl_1.init(false, false);
        }
        // if (TIZZY.category === "boys") {
        // }
        History.pushState({state:1}, "Strona główna", "?state=start");
    }

    function onComplete() {
        TweenLite.fromTo(layer, 0.7, {opacity: 1}, {opacity: 0, ease: animEase, onComplete: onOpacityComplete});
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
        footer = $('.main-footer'),
        direction = "",
        tmpID = null;

    owlGirls.on('initialized.owl.carousel', function (event) {
        TIZZY.sliderIndex = event.item.index;
        tmpID = TIZZY.sliderIndex;
    });

    owlGirls.owlCarousel({
        items: 1,
        dots: false,
        nav: true,
        onInitialized: function (event) {
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
        $(".product").removeClass("is-showing");
        $(".product").addClass("is-hidding");
    });

    owlGirls.on('dragged.owl.carousel', function (event) {
        $(".product").removeClass("is-hidding");
        $(".product").addClass("is-showing");
    });

    owlGirls.on('translate.owl.carousel', function (event) {
        $(".product").removeClass("is-showing");
        $(".product").addClass("is-hidding");

        if (event.item.index === 0) {
            TIZZY.gifGirl_0.tl.pause();
        }
        if (event.item.index === 1) {
            TIZZY.gifGirl_1.tl.pause();
        }
    });

    owlGirls.on('translated.owl.carousel', function (event) {
        $(".product").removeClass("is-hidding");
        $(".product").addClass("is-showing");

        TIZZY.sliderIndex = event.item.index;

        if (TIZZY.sliderIndex > tmpID) {
            direction = "right";
        } else {
            direction = "left";
        }

        tmpID = TIZZY.sliderIndex;

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

        $(".owl-item")
            .eq(TIZZY.sliderIndex)
            .find(".gif-wrap")
            .removeClass("start-left start-right")
            .addClass("translate");

        if (direction === "right") {
            /*
            Jeśli kierunek slajdera to prawo, dla poprzedniego slajdu ustawiamy klasę .start-right,
            natomiast do następnego slajdu usuwamy istniejące klasy start-left lub start-right i dajemy klasę translate
            */
            $(".owl-item")
                .eq(TIZZY.sliderIndex - 1)
                .find(".gif-wrap")
                .removeClass("start-left start-right translate")
                .addClass("start-right");
        } else {
            /*
            Jeśli kierunek slajdera to prawo, dla poprzedniego slajdu ustawiamy klasę .start-left,
            natomiast do następnego slajdu usuwamy istniejące klasy start-left lub start-right i dajemy klasę translate
            */
            $(".owl-item")
                .eq(TIZZY.sliderIndex + 1)
                .find(".gif-wrap")
                .removeClass("start-left start-right translate")
                .addClass("start-left");
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

        History.pushState({state:2}, "Rozmiarówka", "?state=rozmiar");

        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.tl.pause();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.tl.pause();
        }
    });

    $('.modal-close').click(function (e) {
        "use strict";
        e.preventDefault();
        if (TIZZY.sliderIndex === 0) {
            TIZZY.gifGirl_0.tl.resume();
        }
        if (TIZZY.sliderIndex === 1) {
            TIZZY.gifGirl_1.tl.resume();
        }
        TIZZY.doc.removeClass('modal-active modal-sizes modal-form');
        History.pushState({state:1}, "Strona główna", "?state=start");
    });

    $('.sizer__size').click(function (e) {
        e.preventDefault();
        var thatSize = $(this),
            thatSizeText = thatSize.data("size");

        size = thatSizeText;

        thatSize.siblings('input:radio').prop("checked");

        $(".sizer__trigger span").text("");
        $(".sizer__trigger span").text(size);
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

TIZZY.zoomPhoto = function () {
    "use strict";

    var thumbnail = $(".thumbnail");

    thumbnail.click(function (e) {
        e.preventDefault();

        var that = $(this),
            fullPhotoFileName = that.data("filename"),
            isGif = that.hasClass("is-gif"),
            id = that.attr("href"),
            gif = that.parents(".owl-item").find(".gif-wrap"),
            img = that.parents(".owl-item").find(".model img"),
            thumbnails = that.parents(".owl-item").find(".thumbnails");


        //pokazuje dany podgląd
        gif.removeClass("active");
        img.removeClass("active");

        $(id).addClass("active");
        if (!isGif) {
            zoomPhoto(fullPhotoFileName);
        } else {
            if (TIZZY.sliderIndex === 0) {
                TIZZY.gifGirl_0.tl.resume();
            }
            if (TIZZY.sliderIndex === 1) {
                TIZZY.gifGirl_1.tl.resume();
            }
        }

        //aktywna miniaturka
        thumbnail.removeClass("active");
        that.addClass("active");
    });

    function zoomPhoto(fullPhotoFileName) {
        $(".model img").zoom({
            url: products_url + fullPhotoFileName,
            target: $(".zoom-wrapper"),
            magnify: 1.3,
            onZoomIn: function () {
                $(".zoom-wrapper").addClass("zoom");
                $(document).mousemove(function (ev) {
                    var mouseX = ev.pageX + 40,
                        mouseY = ev.pageY - 150;

                    $(".zoom-wrapper").css({
                        left: mouseX,
                        top: mouseY
                    });
                });
            },
            onZoomOut: function () {
                $(".zoom-wrapper").removeClass("zoom");
            }
        });
    }
};

TIZZY.timer = function () {
    "use strict";
    var until = new Date(2015, 11 - 1, 25);
    $('#defaultCountdown').countdown({until: until, compact: false, padZeroes: true, format: 'HMS'});
};

TIZZY.form = function () {
    "use strict";
    $('.form input:checkbox').checkbox({
        empty: media_url + 'empty.png'
    });
    $('.form input:radio').checkbox({
        empty: media_url + 'empty.png'
    });
    $('.btn--buy').click(function (ev) {
        ev.preventDefault();
        TIZZY.doc.addClass('modal-active modal-form');
        TIZZY.gifGirl_0.tl.pause();
        TIZZY.gifGirl_1.tl.pause();
        History.pushState({state:3}, "Formularz zamówienia", "?zamowienie");
    });
};

TIZZY.debug = function () {
    "use strict";
    $(".layer").hide();
    $("body").addClass('girls');
    $("#girls").css('left', 0);
    $("#girls .wrap").css('right', 0);
    $("#boys").css('right', '100%');
};

TIZZY.pageState = function () {
    History.Adapter.bind (window,'statechange', function(){ // Note: We are using statechange instead of popstate
        var State = History.getState(); // Note: We are using History.getState() instead of event.state

        if (State.title === "" || State.title === "Strona główna") {
            $("body").removeClass("modal-active modal-sizes modal-form modal-default");
            if (TIZZY.sliderIndex === 0) {
                TIZZY.gifGirl_0.tl.resume();
            }
            if (TIZZY.sliderIndex === 1) {
                TIZZY.gifGirl_1.tl.resume();
            }
        }
    });
}

$(function () {
    "use strict";
    wH = $(window).height();
    $('#girls, #boys').css('height', wH);
    TIZZY.startPage();
    TIZZY.slider();
    TIZZY.timer();
    TIZZY.form();
    TIZZY.zoomPhoto();
    TIZZY.pageState();
    //TIZZY.productDetails();
    //TIZZY.debug();


    if (window.location.hash) {
        if (window.location.hash === "#default-view") {
            $("body").addClass("modal-active");
            $("body").addClass("modal-default");
        }
    }
});



