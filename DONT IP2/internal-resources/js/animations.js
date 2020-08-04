$(document).ready(function () {
    let navOpen = false;

    //Nav bar background
    $(window).scroll(function () {
        if ($(document).scrollTop() > 50) {
            $('nav').addClass("scroll");
        } else {
            $('nav').removeClass("scroll");
        }
    });

    //Animate Menu Icon and opening and closing of menu
    $('.burger-bars').click(function() {
        $(this).toggleClass("change");

        openNav();
        $('nav').removeClass("scroll");

        if ($(this).data('clicked')) {
            closeNav();
            $(this).data('clicked', false);

            if ($(document).scrollTop() > 10) {
                $('nav').addClass("scroll");
            }
            return;
        }
        $(this).data('clicked', true);

    });

    function openNav() {
        navOpen = true;
        overlayToggle(x);
        $('.overlay').fadeIn(1000);
    }

    function closeNav() {
        navOpen = false;
        $('.nav-menu').removeAttr("style");
        $('.overlay').fadeOut(100);
    }

    let x = window.matchMedia("(max-width: 760px)");
    function overlayToggle(x)
    {
        if(x.matches && navOpen)
        {
            $('.nav-menu').css("width", "70%");
        }
        else if(!x.matches && navOpen)
        {
            $('.nav-menu').css("width", "40%");
        }
        else
        {
            closeNav();
        }
    }

    x.addListener(overlayToggle);
});