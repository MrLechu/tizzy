var TIZZY,wH,doc=$("body"),modal=$(".modal"),modalOverlay=modal.find(".modal-overlay"),product,prizeValue=$(".prize-value"),slideLeftElem=modal.find(".slide-left"),modalfadeElem=modal.find(".fade"),footerFadeElem=$(".main-footer").find(".fade"),footerText=$(".main-footer").find(".text"),animEase=Power0.easeNone;TIZZY=TIZZY||{};TIZZY.category="";TIZZY.sliderIndex=0;TIZZY.modalContent=$(".modal-content");TIZZY.t="";
TIZZY.startPage=function(){function a(){e.remove()}function b(){TweenLite.fromTo(e,0.7,{opacity:1},{opacity:0,ease:animEase,onComplete:a});TIZZY.productDetails();TIZZY.t.play()}var e=$(".layer"),d=$("#layer-girls"),c=$("#layer-boys"),f=$("#girls"),g=$("#boys"),j=d.find(".layer-text"),h=c.find(".layer-text"),k=g.find(".wrap"),l=f.find(".wrap");d.click(function(){doc.addClass("girls");f.css("zIndex",2);g.css("zIndex",1);TweenLite.to(d,1,{width:"100%",ease:animEase});TweenLite.to(c,1,{right:"-50%",ease:animEase});
TweenLite.to(j,0.7,{opacity:0,left:-50,ease:animEase});TweenLite.to(h,0.7,{opacity:0,ease:animEase});TweenLite.to(f,0.5,{left:0,ease:animEase});TweenLite.to(l,0.5,{right:0,ease:animEase,onComplete:b});TIZZY.category="girls"});c.click(function(){doc.addClass("boys");g.css("zIndex",2);f.css("zIndex",1);TweenLite.to(c,1,{width:"100%",ease:animEase});TweenLite.to(d,1,{left:"-50%",ease:animEase});TweenLite.to(h,0.7,{opacity:0,right:-50,ease:animEase});TweenLite.to(g,0.5,{right:0,ease:animEase});TweenLite.to(k,
0.5,{left:0,ease:animEase,onComplete:b});TIZZY.category="boys"})};TIZZY.productSize=function(){var a=$(".product__size__trigger"),b=$(".product__size__sizes");a.click(function(e){e.preventDefault();a.toggleClass("active");b.toggleClass("active")})};TIZZY.menu=function(){$(".mobilemenu-trigger").click(function(){$(".menu").toggleClass("is-active")})};
TIZZY.productDetails=function(){var a=$(".hide-details");$("body.girls").find(".show-details").click(function(){TIZZY.productDetails.prototype.showContent("#girls-carousel",TIZZY.sliderIndex)});$("body.boys").find(".show-details").click(function(){TIZZY.productDetails.prototype.showContent("#boys-carousel",TIZZY.sliderIndex)});a.on("click",function(){TIZZY.productDetails.prototype.hideContent();TIZZY.t.play()})};
TIZZY.productDetails.prototype.showContent=function(a,b){$(a).find(".owl-item").eq(b).find(".product").clone().appendTo(TIZZY.modalContent);slideLeftElem=modal.find(".slide-left");modalFadeElem=modal.find(".fade");TweenLite.to(slideLeftElem,0.3,{left:"0",ease:animEase});TweenLite.fromTo(modalOverlay,0.4,{opacity:0},{opacity:"1",ease:animEase,onStart:function(){doc.addClass("modal-active");TIZZY.t.pause()}});TweenLite.fromTo(modalFadeElem,0.5,{opacity:0},{opacity:1,ease:animEase})};
TIZZY.productDetails.prototype.hideContent=function(){event.preventDefault();TweenLite.to(modalFadeElem,0.5,{opacity:0,ease:animEase});TweenLite.to(slideLeftElem,0.3,{left:"-100%",ease:animEase});TweenLite.to(modalOverlay,0.4,{opacity:"0",ease:animEase,onComplete:function(){$(".modal-content").find(".product").remove();doc.removeClass("modal-active")}})};TIZZY.timer=function(){var a=new Date(2015,9,14);$("#defaultCountdown").countdown({until:a,compact:!1,padZeroes:!0,format:"HMS"})};
TIZZY.slider=function(){var a=$("#girls-carousel");a.owlCarousel({items:1,dots:!1,onInitialized:function(){var b=$(".main-footer"),a={a:0},d=$("#girls-carousel").find(".owl-item").eq(0).find(".gif");$(".model").each(function(){$(this).css({bottom:b.height()})});prizeValue.text(39);$(window).resize(function(){$(".model").each(function(){$(this).animate({height:b.height()},100)})});var c=$(".gif").css("width"),c=2*c.replace("px","");TIZZY.t=TweenLite.to(a,2,{a:-c,ease:SteppedEase.config(2),onUpdate:function(){d.css("backgroundPosition",
a.a+"px 0px")},onComplete:function(){TIZZY.t.restart()}});TIZZY.t.pause()}});a.on("translated.owl.carousel",function(a){a=a.item.index;TIZZY.sliderIndex=a;0===a?prizeValue.text("39"):1===a?prizeValue.text("45"):prizeValue.text("90");0!==a?(TweenLite.to(footerText,0.5,{opacity:1}),TweenLite.to(footerFadeElem,0.5,{opacity:0}),TIZZY.t.pause()):(TweenLite.to(footerText,0.5,{opacity:0}),TweenLite.to(footerFadeElem,0.5,{opacity:1}),TIZZY.t.play())});a=$("#boys-carousel");a.owlCarousel({items:1,dots:!1,
onInitialized:function(){var a=$(".main-footer");$(".model").each(function(){$(this).css({bottom:a.height()})});$(window).resize(function(){$(".model").each(function(){$(this).css({bottom:a.height()})})})}});a.on("translated.owl.carousel",function(a){TIZZY.sliderIndex=a.item.index})};TIZZY.gif=function(){var a=$(".gif").find("img:first");a.hide();a.next().show()};
$(function(){wH=$(window).height();$("#girls, #boys").css("height",wH);TIZZY.startPage();TIZZY.productSize();TIZZY.slider();TIZZY.menu();TIZZY.timer();MBP.preventScrolling();TIZZY.gif()});
