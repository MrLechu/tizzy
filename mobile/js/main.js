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
        girlsLayer = $(".layer-girls"),
        boysLayer = $(".layer-boys"),
        girlsLayerText = $('.layer-text__girls'),
        boysLayerText = $('.layer-text__boys');

    $(".model").css({
        bottom: footer.height()
    });

    APP.doc.addClass("slide0");

    function onGirlsComplete() {
        APP.boys.css({
            right: "-100%"
        });
        APP.page = {
            currentSex: "girls",
            currentCarousel: "#girls-carousel",
            currentGif: {
                gif0: new Gif('.girls .gif0'),
                gif1: new Gif('.girls .gif1'),
                gif2: new Gif('.girls .gif2')
            }
        }

        TweenLite.set(APP.girls, {left: 0, x: "0%"});
        TweenLite.set(APP.girlsWrap, {right: 0, x: "0%"});
        TweenLite.set(APP.boys, {right: 0});
        TweenLite.set(APP.boysWrap, {left: 0});

        APP.page.currentGif.gif0.init(false, true);
        APP.page.currentGif.gif1.init(false, false);
        APP.page.currentGif.gif2.init(false, false);

        APP.init();
        $(layer).remove();
        $(layerText).remove();
    }

    function onBoysComplete(){
        APP.girls.css({
            left: "-100%"
        });
        APP.page = {
            currentSex: "boys",
            currentCarousel: "#boys-carousel",
            currentGif: {
                gif0: new Gif('.boys .gif0'),
                gif1: new Gif('.boys .gif1'),
                gif2: new Gif('.boys .gif2')
            }
        }

        APP.page.currentGif.gif0.init(false, true);
        APP.page.currentGif.gif1.init(false, false);
        APP.page.currentGif.gif2.init(false, false);

        TweenLite.set(APP.boys, {right: 0, x: "0%"});
        TweenLite.set(APP.boysWrap, {left: 0, x: "0%"});
        TweenLite.set(APP.girls, {left: 0});
        TweenLite.set(APP.girlsWrap, {right: 0});

        APP.init();
        $(layer).remove();
        $(layerText).remove();


    }
    new Hammer(girlsLayerText[0]).on("panright tap", function () {

        APP.doc.addClass('girls');
        $(".girls").find("#product0").addClass("active");

        APP.girls.css('zIndex', 2);
        APP.boys.css('zIndex', 1);

        /*layer*/
        TweenLite.to(girlsLayer, 1, {x: "50%", opacity: 0, ease: animEase, onComplete: onGirlsComplete});
        TweenLite.to(boysLayer, 1, {x: "50%", opacity: 0, ease: animEase});

        TweenLite.to(girlsLayerText, 0.7, {x: "10%", opacity: 0, ease: animEase});
        TweenLite.to(boysLayerText, 0.7, {x: "50%", opacity: 0, ease: animEase});

        /*main-body*/
        TweenLite.to(APP.girls, 0.5, {x: "50%", ease: animEase});
        TweenLite.to(APP.girlsWrap, 0.5, {x: "-50%", ease: animEase});

    });

    new Hammer(boysLayerText[0]).on("panleft tap", function () {
        APP.doc.addClass('boys');
        $(".boys").find("#product0").addClass("active");

        APP.boys.css('zIndex', 2);
        APP.girls.css('zIndex', 1);

        /*layer*/
        TweenLite.to(boysLayer, 1, {x: "-50%", opacity: 0, ease: animEase, onComplete: onBoysComplete});
        TweenLite.to(girlsLayer, 1, {x: "-50%", opacity: 0, ease: animEase});

        TweenLite.to(boysLayerText, 0.7, {x: "-10%", opacity: 0, ease: animEase});
        TweenLite.to(girlsLayerText, 0.7, {x: "-50%", opacity: 0, ease: animEase});

        /*main-body*/
        TweenLite.to(APP.boysWrap, 0.5, {x: "50%", ease: animEase});
        TweenLite.to(APP.boys, 0.5, {x: "-50%", ease: animEase});
    });
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
    this.changeSection();
}

APP.triggers = {
    showDefaultModalButton: $(".Button_showDefaultModal"),
    hideProductDescriptionButton: $(".Button_hideProductDescription"),
    showGallery: $(".gif, .gallery-trigger"),
    showProductDescriptionButton: $(".show-details"),
    hideDetailsButton: $('.hide-details'),
    showModalDefault1: $('.aloha-from-deer-logo, .product__footer'),
    showModalDefault2: $('.timer, .shape-star-red, .discount, .product__category'),
    showModalDefault3: $(''),
    showFaq: $('#faq'),
    showRegulations: $('#regulations'),
    showContact: $('#contact'),
    showSizes: $(".sizer__trigger")
}

APP.modals = {
    showModal: function (modalClassName) {
        //modalClassName = string
        APP.doc.addClass("modal-active " + modalClassName);
        History.pushState(null, "modal", "?modal=1");
    },
    hideModal: function () {
        if (APP.doc.hasClass("source-description")) {
            APP.doc.removeClass("modal-gallery modal-default modal-default-3 source-description source-logo")
        } else if (APP.doc.hasClass("source-logo")) {
            APP.doc.removeClass("modal-default modal-default-1 source-description source-logo")
        } else {
            APP.doc.removeClass("modal-faq modal-regulations modal-contact modal-active modal-default modal-default-1 modal-default-2 modal-default-3 modal-sizes modal-gallery modal-form source-description source-logo");
        }
    }
}

$(".modal-close").click(function (ev) {
    ev.preventDefault();
    var that = $(this);
    APP.modals.hideModal();
});


APP.triggers.showFaq.on("click", function () {
    APP.modals.showModal("modal-default modal-faq");
});

APP.triggers.showRegulations.on("click", function () {
    APP.modals.showModal("modal-default modal-regulations");
});

APP.triggers.showContact.on("click", function () {
    APP.modals.showModal("modal-default modal-contact");
});


APP.triggers.showModalDefault1.on("click", function () {
    var that = $(this);
    if (that.hasClass("product__footer")) {
        APP.modals.showModal("modal-default modal-default-1 source-logo");
    } else {
        APP.modals.showModal("modal-default modal-default-1");
    }
});

APP.triggers.showModalDefault2.on("click", function () {
    APP.modals.showModal("modal-default modal-default-2");
});

APP.triggers.showModalDefault3.on("click", function () {
    if (APP.doc.hasClass("modal-description")) {
        APP.modals.showModal("modal-default modal-default-3 source-description");
    } else {
        APP.modals.showModal("modal-default modal-default-3");
    }

});
APP.triggers.showGallery.on("click", function () {
    var that = $(this);
    if (that.hasClass("gallery-trigger")) {
        APP.modals.showModal("modal-gallery source-description");
    } else {
        APP.modals.showModal("modal-gallery");
    }
});

APP.triggers.hideDetailsButton.on('click', function () {
    APP.productDetails.prototype.hideContent();
});

APP.triggers.hideProductDescriptionButton.on("click", function () {
    APP.productDetails.prototype.hideContent();
});

APP.triggers.showProductDescriptionButton.on("click", function () {
    APP.productDetails.prototype.showContent(APP.page.currentCarousel, APP.sliderIndex);
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

    APP.owl.on('drag.owl.carousel', function (event) {
        TweenLite.to($('.show-details'), 0.3, {opacity: 0, scale: 0});
    });

    APP.owl.on('dragged.owl.carousel', function (event) {
        TweenLite.to($('.show-details'), 0.3, {opacity: 1, scale: 1});
    });

    APP.owl.on('translate.owl.carousel', function (event) {
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

        $(".gallery").css({
            opacity: 0,
            visibility: "hidden"
        });
        $("#gallery" + APP.sliderIndex).css({
            opacity: 1,
            visibility: "visible"
        });

        APP.doc.removeClass("slide0 slide1 slide2");
        APP.doc.addClass("slide" + APP.sliderIndex);

        if (APP.sliderIndex === 0) {
            //cena po obniżce
            prizeValue.text(APP.defaultPrize);
            APP.page.currentGif.gif0.tl.play();
            APP.page.currentGif.gif1.tl.pause();
            TweenLite.to(footerText, 0.5, {opacity: 0, visibility: "hidden"});
            TweenLite.to(footerFadeElem, 0.5, {opacity: 1});

        } else if (APP.sliderIndex === 1) {
            prizeValue.text('45');
            APP.page.currentGif.gif0.tl.pause();
            APP.page.currentGif.gif1.tl.play();
            TweenLite.to(footerText, 0.5, {opacity: 1, visibility: "visible"});
            TweenLite.to(footerFadeElem, 0.5, {opacity: 0});
        } else if (APP.sliderIndex === 2) {
            prizeValue.text('90');
            APP.page.currentGif.gif0.tl.pause();
            APP.page.currentGif.gif1.tl.pause();
            TweenLite.to(footerText, 0.5, {opacity: 1, visibility: "visible"});
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
        APP.doc.removeClass("girls").addClass("boys");

        TweenLite.set(APP.girls, {zIndex: 1});
        TweenLite.set(APP.boys, {zIndex: 2});

        APP.page.currentGif.gif0.tl.kill();
        APP.page.currentGif.gif1.tl.kill();
        APP.page.currentGif.gif2.tl.kill();


        APP.page = {
            currentSex: "boys",
            currentCarousel: "#boys-carousel",
            currentGif: {
                gif0: new Gif('.boys .gif0'),
                gif1: new Gif('.boys .gif1'),
                gif2: new Gif('.boys .gif2')
            }
        }

        APP.page.currentGif.gif0.init(false, false);
        APP.page.currentGif.gif1.init(false, false);
        APP.page.currentGif.gif2.init(false, false);

        if (APP.sliderIndex === 0) {
            APP.page.currentGif.gif0.tl.play();
        }
        if (APP.sliderIndex === 1) {
            APP.page.currentGif.gif1.tl.play();
        }
        if (APP.sliderIndex === 2) {
            APP.page.currentGif.gif2.tl.play();
        }

        APP.slider();
    }, false);

    goToGirlsSection.addEventListener("click", function () {
        APP.doc.addClass("girls").removeClass("boys");

        TweenLite.set(APP.girls, {zIndex: 2});
        TweenLite.set(APP.boys, {zIndex: 1});

        APP.page.currentGif.gif0.tl.kill();
        APP.page.currentGif.gif1.tl.kill();
        APP.page.currentGif.gif2.tl.kill();

        APP.page = {
            currentSex: "girls",
            currentCarousel: "#girls-carousel",
            currentGif: {
                gif0: new Gif('.girls .gif0'),
                gif1: new Gif('.girls .gif1'),
                gif2: new Gif('.girls .gif2')
            }
        }

        APP.page.currentGif.gif0.init(false, false);
        APP.page.currentGif.gif1.init(false, false);
        APP.page.currentGif.gif2.init(false, false);

        if (APP.sliderIndex === 0) {
            APP.page.currentGif.gif0.tl.play();
        }
        if (APP.sliderIndex === 1) {
            APP.page.currentGif.gif1.tl.play();
        }
        if (APP.sliderIndex === 2) {
            APP.page.currentGif.gif2.tl.play();
        }

        APP.slider();
    }, false);
}

APP.productSize = function () {
    "use strict";
    var size = $(".sizer__trigger > span").text();

    APP.triggers.showSizes.click(function (e) {
        e.preventDefault();
        APP.modals.showModal("modal-sizes");
        //History.pushState(null, "size", "?rozmiar=" + size);
    });

    $('.sizer__size').click(function (e) {
        e.preventDefault();
        var thatSize = $(this),
            thatSizeText = thatSize.data("size");

        size = thatSizeText;

        thatSize.siblings('input:radio').prop("checked");

        $(".sizer__trigger span").text("");
        $(".sizer__trigger span").text(size);

        //History.replaceState(null, "size", "?rozmiar=" + size);

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
            TweenLite.to($('.show-details'), 0.3, {opacity: 1, scale: 1});
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

    products = $(".product");
    product = $("#product" + index);

    products.removeClass("active");

    product.addClass("active")

    function onStartFn() {
        APP.modals.showModal("modal-description");
    }

    function onCompleteFn() {
        APP.page.currentGif.gif0.pause();
        APP.page.currentGif.gif1.pause();
    }

    var modalFadeElem = document.querySelectorAll('.modal .fade');

    TweenLite.fromTo(APP.modalOverlay, 0.45, {opacity: 0}, {opacity: 1, ease: animEase, onStart: onStartFn, onComplete: onCompleteFn});
    TweenLite.fromTo(modalFadeElem, 0.45, {opacity: 0}, {opacity: 1, ease: animEase});
};

APP.productDetails.prototype.hideContent = function () {
    "use strict";

    var products = $(".product"),
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
        products.removeClass("active");
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
        APP.modals.showModal("modal-form");
        APP.page.currentGif.gif0.play();
        APP.page.currentGif.gif1.pause();
    });
};

APP.gallery = function () {
    var mySwiperParam = {
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
    },
    mySwiper = new Swiper ('.swiper-container', mySwiperParam);

    $(".swiper-slide").on("click", function () {
        var image = $(this).find("img").data("image");
        $("#galleryModal .modal-content img").attr("src", media_url + "img/product/" + image);
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

