$(document).ready(function() {
    //-------------Navbar close when button click-----------//
    $('.navbar-nav>li>a').on('click', function() {
        $('.navbar-collapse').collapse('hide');
    });

    //------------Smooth scroll menu clicked-------------//
    //Smooth Scrolling Using Navigation Menu
    //   $('a.scoll--link[href*="#"]').on('click', function(e){
    //     $('html,body').animate({
    //         scrollTop: $($(this).attr('href')).offset().top - 50
    //     },1500);
    //     e.preventDefault();
    // });

    //card hover tilt
    $(".citycards .city-cardBox").tilt({
        maxTilt: 15,
        perspective: 1800,
        easing: "cubic-bezier(.03,.98,.52,.99)",
        speed: 1200,
        glare: true,
        maxGlare: 0.2,
        scale: 1.04,
        glare: true,
        maxGlare: .2
    });

    //-------------Body toogle class-----------------//
    $('.navbar-toggler').click(function() {
        $('body').toggleClass('navbg-white');
    });


    //--------Window scroll add class to navbar----------//
    $(window).scroll(function() {
        $('.navbar-outer').toggleClass('scrolledsmooth', $(this).scrollTop() > 10);
    });


    //-------Banner slider starts----------//



    //--------Slider init----------//


    //Slide INIT for BLOG
    /*
    
    
  
    $('.prev').click(function(){
        $('.slider-carousel').slick('slickPrev');
      })
      
      $('.next').click(function(){
        $('.slider-carousel').slick('slickNext');
      })
    */


    //---------tagify js init--------
    // The DOM element you wish to replace with Tagify
    /*
    if ($('input[name=basic]').length > 0) {
        var input = document.querySelector('input[name=basic]');
        let data = [
            { "id": "1", "value": "English" },
            { "id": "2", "value": "Korean" },
            { "id": "3", "value": "Spanish" }
        ];
        // init Tagify script on the above inputs
        var tagify = new Tagify(input);
        // add data
        tagify.addTags(data);
        // var newData = {
        //     id: "32",
        //     label: "",
        //     description: "",
        //     locked: "0",
        //     type: "device"
        // }	
        // var tags = tagify.getTagElms();
        // if(tags.length > 0){
        // 	tagify.replaceTag(tags[3], newData);
        // }
        // console.log(tagify.value)
    }

    //remove tag
    if ($('.span-input-tags span').length > 0) {
        $('.span-input-tags span').on('click', '.delt-icon', function(e) {
            $(this).closest('.span-input-tags span').remove();
        });
    };


    //remove tag dashboard
    if ($('.search-delt-dashboard span').length > 0) {
        $('.search-delt-dashboard span').on('click', '.deltsearch-tags', function(e) {
            $(this).closest('.search-delt-dashboard span').remove();
        });
    };


    //remove tag notification
    if ($('.notification--mesgouter li').length > 0) {
        $('.notification--mesgouter li').on('click', '.notification--deletebtn', function(e) {
            $(this).closest('.notification--mesgouter li').remove();
        });
    };
    */



    //flatpickr
    /* if ($('#myInput').length > 0) {
        const myInput = document.querySelector("#myInput");
        const fp = flatpickr(myInput, {
            inline: true
        }); // flatpickr 
    };

    */



    //card input 
    if ($('.cardNumber').length > 0) {
        new Cleave('.cardNumber', {
            blocks: [4, 4, 4, 4],
            delimiters: ['-', '-', '-', '-']
        });
    };
    if ($('.expiry').length > 0) {
        new Cleave('.expiry', {
            date: true,
            datePattern: ['m', 'y']
        });
    };
    var $grid;
    if ($('.grid').length > 0) {
        // init Masonry
        //$grid = $('.grid').masonry();
    };
    //Filter-btn
    if ($('.filter--btn').length > 0) {
        $('.filter--btn').on('click', function() {
            $('body').toggleClass('filter-offcanvas');
        });
    };
    if ($('.sumbit-filter--btn').length > 0) {
        $('.sumbit-filter--btn').on('click', function() {
            $('body').removeClass('filter-offcanvas');
        });
    };




    //---------Youtube-----------------


    //--------Increament plus minus--------//
    var incrementPlus;
    var incrementMinus;

    var buttonPlus = $(".cart-qty-plus");
    var buttonMinus = $(".cart-qty-minus");

    var incrementPlus = buttonPlus.on('click', function() {
        var $n = $(this)
            .parent(".button-container")
            .parent(".quantity-increament")
            .find(".qty");
        $n.val(Number($n.val()) + 1);
    });

    var incrementMinus = buttonMinus.on('click', function() {
        var $n = $(this)
            .parent(".button-container")
            .parent(".quantity-increament")
            .find(".qty");
        var amount = Number($n.val());
        if (amount > 0) {
            $n.val(amount - 1);
        }
    });

    ///---------Aos init---------//
    // AOS.init();



    //----remove overflow from body---//
    setTimeout(function() { $("body").css('overflow', 'visible'); }, 1300);

    /*Navbar logo effect*/
    var tl = gsap.timeline();
    if ($('.logo-home-anim').length > 0) {
        tl.from(".logo-home-anim", { duration: 1, y: 20, opacity: 0, delay: 2.7, ease: "expo.inOut" }, "-=0.5");
    }
    /*Navbar menu effect*/
    if ($('.home-nav .navbar-nav li').length > 0) {
        TweenMax.staggerFrom(".home-nav .navbar-nav li", 1, {
            delay: 2.7,
            opacity: 0,
            x: -25,
            ease: Power4.easeInOut
        }, 0.09);
    };


    /*Herro Banner effect*/
    var main = gsap.timeline({ defaults: { duration: 1 } });
    if ($('.header-contentbox-fade').length > 0) {
        main.from(".header-contentbox-fade", { y: -50, stagger: .4, opacity: 0, delay: 2.9 });
    }
    var cpacket = gsap.timeline({ defaults: { duration: 1 } });
    if ($('.ic-svg').length > 0) {
        cpacket.from(".ic-svg", { y: 70, stagger: .1, opacity: 0, delay: 4.3 });
    }
});

/*overlay top effect*/
if ($('.overlay p').length > 0) {
    TweenMax.to(".overlay p", 2, {
        opacity: 0,
        y: -40,
        ease: Expo.easeInOut
    });
}
if ($('.overlay').length > 0) {
    TweenMax.to(".overlay", 2, {
        delay: 1,
        top: "-200%",
        ease: Expo.easeInOut
    });
}


//-------Refresh page goes always top---------//
$(window).on('beforeunload', function() {
    $(window).scrollTop(0);
});