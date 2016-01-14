/*jslint browser: true*/
/*globals $, window, alert, TweenLite, ease, Power0, SteppedEase, MBP, Hammer, media_url*/
var APP,
    prizeValue = $(".prize-value"),
    footerFadeElem = $('.main-footer').find('.fade'),
    footerText = $('.main-footer').find('.text'),
    animEase = Power0.easeNone,
    footer = $('.main-footer');

APP = APP || {};

APP = {
    doc: $('body'),
    modal: $('.modal'),
    wH: $(window).height(),
    modalOverlay: $('#productModal').find('.modal-overlay'),
    sliderIndex: 0,
    modalContent: $('#productModal').find('.modal-content'),
    defaultPrize: 39,
    boysWrap: $('#boys .wrap'),
    girlsWrap: $('#girls .wrap'),
    girls: $('#girls'),
    boys: $('#boys'),
    owl: null,
    page: {
        currentSex: null,
        currentCarousel: null,
        currentGif: {
            gif0: null,
            gif1: null,
            gif2: null
        }
    }
};

APP.startPage = function () {
    "use strict";
    var layer = document.querySelectorAll(".layer"),
        layerText = document.querySelectorAll(".layer-text"),
        startGirls = document.querySelectorAll(".start-girls"),
        startBoys = document.querySelectorAll(".start-boys"),
        girlsLayerText = $('.layer-text__girls'),
        boysLayerText = $('.layer-text__boys');

    $(".model").css({
        bottom: footer.height()
    });

    function onComplete() {
        TweenLite.fromTo(layer, 0.7, {opacity: 1}, {opacity: 0, ease: animEase});

        APP.init();

        $(layer).remove();
        $(layerText).remove();

        if (APP.page.currentSex === "girls") {
            APP.boys.css({
                right: "-100%"
            });
        }
        if (APP.page.currentSex === "boys") {
            APP.girls.css({
                left: "-100%"
            });
        }
    }

    for (var i = 0; i <= startGirls.length - 1; i = i + 1) {
        new Hammer(startGirls[i]).on("panright tap", function () {
            APP.doc.addClass('girls');

            APP.girls.css('zIndex', 2);
            APP.boys.css('zIndex', 1);

            TweenLite.to(startGirls, 1, {x: "50%", ease: animEase});
            TweenLite.to(girlsLayerText, 0.7, {opacity: 0, ease: animEase});

            TweenLite.to(startBoys, 1, {x: '50%', ease: animEase});
            TweenLite.to(boysLayerText, 1, {x: "100%", opacity: 0, ease: animEase});

            TweenLite.to(APP.girls, 0.5, {left: 0, ease: animEase});
            TweenLite.to(APP.girlsWrap, 0.5, {right: 0, ease: animEase, onComplete: onComplete});

            APP.page = {
                currentSex: "girls",
                currentCarousel: "#girls-carousel",
                currentGif: {
                    gif0: new Gif('.girls .gif0'),
                    gif1: new Gif('.girls .gif1'),
                    gif2: new Gif('.girls .gif2'),
                }
            }

            APP.page.currentGif.gif0.init(false, true);
            APP.page.currentGif.gif1.init(false, false);
        });
    }

    for (var i = 0; i <= startBoys.length - 1; i = i + 1) {
        new Hammer(startBoys[i]).on("panleft tap", function () {
            APP.doc.addClass('boys');

            APP.boys.css('zIndex', 2);
            APP.girls.css('zIndex', 1);

            TweenLite.to(startBoys, 1, {x: "-50%", ease: animEase});
            TweenLite.to(boysLayerText, 0.7, {opacity: 0, ease: animEase});

            TweenLite.to(startGirls, 1, {x: '-50%', ease: animEase});
            TweenLite.to(girlsLayerText, 1, {x: "-100%", opacity: 0, ease: animEase});

            TweenLite.to(APP.boys, 0.5, {right: 0, ease: animEase});
            TweenLite.to(APP.boysWrap, 0.5, {left: 0, ease: animEase, onComplete: onComplete});

            APP.page = {
                currentSex: "boys",
                currentCarousel: "#boys-carousel",
                currentGif: {
                    gif0: new Gif('.boys .gif0'),
                    gif1: new Gif('.boys .gif1'),
                    gif1: new Gif('.boys .gif2')
                }
            }
        });
    }
};


APP.start = function() {
    this.startPage();
    this.timer();

    $('#girls, #boys').css('height', APP.wH);
    $(".prize-value").text(APP.defaultPrize);
    //MBP.preventScrolling();
    //APP.debug();
}

APP.init = function() {
    this.productDetails();
    this.productSize();
    this.slider();
    this.menu();
    this.form();
    this.gallery();
    this.changeSection()
}

APP.buttons = {
    showDefaultModalButton: $(".Button_showDefaultModal"),
    hideProductDescriptionButton: $(".Button_hideProductDescription"),
    showGalleryModalButton: $(".Button_showGalleryModal, .gif"),
    showProductDescriptionButton: $(".Button_showProductDescription"),
    hideDetailsButton: $('.hide-details'),
    showModalDefault1: $('.aloha-from-deer-logo, .product__footer'),
    showModalDefault2: $('.timer, .shape-star-red, .discount'),
    showModalDefault3: $('.product__category')
}

APP.buttons.showModalDefault1.on("click", function () {
    APP.doc.addClass('modal-active modal-default modal-default-1');
});

APP.buttons.showModalDefault2.on("click", function () {
    APP.doc.addClass('modal-active modal-default modal-default-2');
});

APP.buttons.showModalDefault3.on("click", function () {
    APP.doc.addClass('modal-active modal-default modal-default-3');
});

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

APP.slider = function () {
    "use strict";
    APP.owl = $(APP.page.currentCarousel);

    APP.owl.owlCarousel({
        items: 1,
        dots: false
    });

    APP.owl.on('translate.owl.carousel', function (event) {
        TweenLite.to($('.show-details'), 0.3, {opacity: 0, scale: 0});
        if (event.item.index === 0) {
            APP.page.currentGif.gif0.tl.pause();
        }
        if (event.item.index === 1) {
            APP.page.currentGif.gif1.tl.pause();
        }
    });

    APP.owl.on('translated.owl.carousel', function (event) {
        TweenLite.to($('.show-details'), 0.3, {opacity: 1, scale: 1});
        APP.sliderIndex = event.item.index;
        if (APP.sliderIndex === 0) {
            //cena po obniżce
            prizeValue.text(APP.defaultPrize);
            APP.page.currentGif.gif0.tl.play();
            APP.page.currentGif.gif1.tl.pause();
            TweenLite.to(footerText, 0.5, {opacity: 0});
            TweenLite.to(footerFadeElem, 0.5, {opacity: 1});
        } else if (APP.sliderIndex === 1) {
            prizeValue.text('45');
            APP.page.currentGif.gif0.tl.pause();
            APP.page.currentGif.gif1.tl.play();
            TweenLite.to(footerText, 0.5, {opacity: 1});
            TweenLite.to(footerFadeElem, 0.5, {opacity: 0});
        } else if (APP.sliderIndex === 2) {
            prizeValue.text('90');
            APP.page.currentGif.gif0.tl.pause();
            APP.page.currentGif.gif1.tl.pause();
            TweenLite.to(footerText, 0.5, {opacity: 1});
            TweenLite.to(footerFadeElem, 0.5, {opacity: 0});
        }
    });
};

APP.changeSection = function () {
    var goToBoysSection = document.getElementById("goToBoysSection"),
        goToGirlsSection = document.getElementById("goToGirlsSection");

    /*
        zmieniając grupę docelową na chłopców lub na dziewczęta należy jeśli to możliwe:
        - owl carozelę
        - zaktualizować obiekt page
    */

    goToBoysSection.addEventListener("click", function () {
        APP.boys.css({
            "z-index": 2,
            "right": 0
        });
        APP.girls.css("z-index", 1);

        APP.boysWrap.css("left", 0);

        APP.doc.removeClass("girls").addClass("boys");

        APP.page = {
            currentSex: "boys",
            currentCarousel: "#boys-carousel",
            currentGif: {
                gif0: new Gif('.boys .gif0'),
                gif1: new Gif('.boys .gif1'),
                gif2: new Gif('.boys .gif2')
            }
        }
        APP.slider();
    }, false);

    goToGirlsSection.addEventListener("click", function () {
        APP.girls.css({
            "z-index": 2,
            "left": 0
        });
        APP.boys.css("z-index", 1);

        APP.girlsWrap.css("left", 0);

        APP.doc.addClass("girls").removeClass("boys");

        APP.slider();

        APP.page = {
            currentSex: "girls",
            currentCarousel: "#girls-carousel",
            currentGif: {
                gif0: new Gif('.girls .gif0'),
                gif1: new Gif('.girls .gif1'),
                gif2: new Gif('.girls .gif2')
            }
        }
        APP.slider();
    }, false);
}

APP.productSize = function () {
    "use strict";
    var $sizeTrigger = $('.sizer__trigger'),
        size = $(".sizer__trigger > span").text();

    $sizeTrigger.click(function (event) {
        event.preventDefault();
        APP.doc.addClass('modal-active modal-sizes');

        History.pushState(null, "size", "?rozmiar=" + size);

        switch(APP.sliderIndex) {
            case 0:
                APP.page.currentGif.gif0.pause();
                break;
            case 1:
                APP.page.currentGif.gif1.pause();
                break;
        }
    });

    $('.modal-close:not(".gallery-close")').click(function (e) {
        e.preventDefault();
        switch(APP.sliderIndex) {
            case 0:
                APP.page.currentGif.gif0.play();
                break;
            case 1:
                APP.page.currentGif.gif1.play();
                break;
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

        //APP.doc.removeClass('modal-active modal-sizes modal-form');
        $(".sizer__size").removeClass("active");
        thatSize.addClass('active');
    });

    $('.sizer .btn').click(function (e) {
        e.preventDefault();

        APP.doc.removeClass('modal-active modal-sizes modal-form');
        switch(APP.sliderIndex) {
            case 0:
                APP.page.currentGif.gif0.pause();
                break;
            case 1:
                APP.page.currentGif.gif1.pause();
                break;
        }
    });
};

APP.productDetails = function () {
    "use strict";
    APP.buttons.hideDetailsButton.on('click', function () {
        APP.productDetails.prototype.hideContent();
    });

    APP.buttons.hideProductDescriptionButton.on("click", function () {
        APP.productDetails.prototype.hideContent();
    });

    APP.buttons.showProductDescriptionButton.on("click", function () {
        APP.productDetails.prototype.showContent(APP.page.currentCarousel, APP.sliderIndex);
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
            APP.productDetails.prototype.hideContent();
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
            APP.productDetails.prototype.showContent('#girls-carousel', APP.sliderIndex);
        }
    });
};

APP.productDetails.prototype.showContent = function (carousel, index) {
    "use strict";

    var products,
        product,
        idx = 0;

    products = document.querySelectorAll(".product");
    product = document.getElementById("product" + index);

    for (idx; idx <= products.length - 1; idx = idx + 1) {
        products[idx].style.opacity = 0;
        products[idx].style.visibility = "hidden";
    }

    product.style.opacity = 1;
    product.style.visibility = "visible";

    function onStartFn() {
        APP.doc.addClass('modal-active modal-description');

    }

    function onCompleteFn() {
        APP.page.currentGif.gif0.pause();
        APP.page.currentGif.gif1.pause();
    }

    var slideLeftElem = document.querySelectorAll('.modal .slide-left'),
        modalFadeElem = document.querySelectorAll('.modal .fade');

    TweenLite.set(slideLeftElem, {x: "-100%", y: 0, z: 0});

    TweenLite.to(slideLeftElem, 0.45, {x: "0%", ease: animEase});

    TweenLite.fromTo(APP.modalOverlay, 0.45, {opacity: 0}, {opacity: 1, ease: animEase, onStart: onStartFn, onComplete: onCompleteFn});
    TweenLite.fromTo(modalFadeElem, 0.45, {opacity: 0}, {opacity: 1, ease: animEase});
};

APP.productDetails.prototype.hideContent = function () {
    "use strict";

    var products = document.querySelectorAll(".product"),
        modalFadeElem = $('.modal').find('.fade'),
        idx = 0;

    function onCompleteFn() {
        APP.doc.removeClass('modal-active modal-description');

        switch(APP.sliderIndex) {
            case 0:
                APP.page.currentGif.gif0.play();
                break;
            case 1:
                APP.page.currentGif.gif1.play();
                break;
        }
    }

    function onStart() {
        for (idx; idx <= products.length - 1; idx = idx + 1) {
            products[idx].style.opacity = 0;
            products[idx].style.visibility = "hidden";
        }
    }

    TweenLite.to(modalFadeElem, 0.35, {opacity: 0, ease: animEase});
    TweenLite.to(APP.modalOverlay, 0.35, {opacity: '0', ease: animEase, onStart: onStart, onComplete: onCompleteFn});
};

APP.menu = function () {
    "use strict";
    $('.mobilemenu-trigger').on("click", function () {

        $('.menu').toggleClass('is-active');
        $("body").toggleClass('menu-active');

        if ($(".menu").hasClass("is-active")) {
            switch(APP.sliderIndex) {
                case 0:
                    APP.page.currentGif.gif0.pause();
                    break;
                case 1:
                    APP.page.currentGif.gif1.pause();
                    break;
            }
        } else {
            switch(APP.sliderIndex) {
                case 0:
                    APP.page.currentGif.gif0.play();
                    break;
                case 1:
                    APP.page.currentGif.gif1.play();
                    break;
            }
        }
    });

    $(".menu__item a").on("click", function (ev) {
        ev.preventDefault();
        $('.menu').removeClass('is-active');
        $("body").removeClass('menu-active');
    });
};

APP.timer = function () {
    "use strict";
    var until = new Date(2015, 10 - 1, 31);

    $('#defaultCountdown').countdown({until: until, compact: false, padZeroes: true, format: 'HMS'});
};

APP.form = function () {
    "use strict";
    $('.form input:checkbox, .form input:radio').checkbox({
        empty: media_url + 'img/empty.png'
    });
    $('').checkbox({
        empty: media_url + 'img/empty.png'
    });
    $('.btn--buy').click(function (ev) {
        ev.preventDefault();
        APP.doc.addClass('modal-active modal-form');
        APP.page.currentGif.gif0.play();
        APP.page.currentGif.gif1.pause();
    });
};

APP.gallery = function () {
    var galleryTrigger = $('.gallery-trigger');


    galleryTrigger.click(function (ev) {
        ev.preventDefault();
        APP.doc.addClass('modal-gallery');
    });

    APP.buttons.showGalleryModalButton.on("click", function () {
        APP.doc.addClass('modal-active modal-gallery on-gif');
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

    var img,
        marginLeft,
        marginTop;

    new Hammer($(".pan")[0], {
        domEvents: true
    });

    $(".pan").on("panstart", function(e) {
        img = $(".pan img");
        marginLeft = parseInt(img.css("margin-left"), 10);
        marginTop = parseInt(img.css("margin-top"), 10);
    });

    $(".pan").on("pan", function(e) {
        var deltaLeft = marginLeft + e.originalEvent.gesture.deltaX,
            deltaTop = marginTop + e.originalEvent.gesture.deltaY;
      //if ( delta >= -1750 && delta <= -150 ) {
        img.css({
            "margin-left": marginLeft + e.originalEvent.gesture.deltaX,
            "margin-top": marginTop + e.originalEvent.gesture.deltaY
        });
      //}
    });

    // pinch
    var ham = new Hammer($(".pinch")[0], {
            domEvents: true
        }),
        width = 1200,
        height = 1200,
        left = 600,
        top = 600;

    ham.get('pinch').set({enable: true});

    $(".pinch").on("pinch", function(e) {
       $(this).find("img").css({
            "-webkit-transform": "scale(" + e.originalEvent.gesture.scale + ")",
            "-ms-transform": "scale(" + e.originalEvent.gesture.scale + ")",
            "transform": "scale(" + e.originalEvent.gesture.scale + ")",
            // width: width * e.originalEvent.gesture.scale,
            // "margin-left": -left * e.originalEvent.gesture.scale,
            // height: height * e.originalEvent.gesture.scale,
            // "margin-top": -top * e.originalEvent.gesture.scale
       });
    });
    $(".pinch").on("pinchend", function(e) {
        width = width * e.originalEvent.gesture.scale;
        height = height * e.originalEvent.gesture.scale;
        left = left * e.originalEvent.gesture.scale;
        top = top * e.originalEvent.gesture.scale;
    });
}


$(".modal-close").click(function (ev) {
    "use strict";
    ev.preventDefault();
    var self = $(this);

    if (self.hasClass("gallery-close")) {
        //zamykanie gallerii wywołanej po kliknięciu link w opisie
        APP.doc.removeClass('modal-gallery');
    } else {
        //pozostałe modale
        APP.doc.removeClass('modal-active modal-default modal-default-2 modal-default-3 modal-sizes modal-form');
    }

    if (APP.doc.hasClass("on-gif")) {
        //zamykanie gallerii wywołanej po kliknięciu na gif
        APP.doc.removeClass("modal-active modal-gallery on-gif");
    }
});


APP.debug = function () {
    "use strict";
    $(".layer, .layer-text").hide();
    $("body").addClass('girls');
    $("#girls").css('left', 0);
    $("#girls .wrap").css('right', 0);
    $("#boys").css('right', '100%');
};

$(function () {
    "use strict";
    APP.start();
});

