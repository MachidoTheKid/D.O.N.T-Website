$(document).ready(function () {
    //Nav bar background
    $(window).scroll(function () {
        if ($(document).scrollTop() > 50) {
            $('nav').addClass("scroll");
        } else {
            $('nav').removeClass("scroll");
        }
    });

    //Animate Menu Icon and opening and closing of menu
    $('.burger-bars').click(function () {
        this.classList.toggle("change");

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
        overlayToggle(x);
        $('.overlay').fadeIn(500);
    }

    function closeNav() {
        $('.nav-menu').removeAttr("style");
        $('.overlay').fadeOut(100);
    }

    function overlayToggle(x)
    {
        if(x.matches)
        {
            $('.nav-menu').css("width", "70%");
        }
        else
        {
            $('.nav-menu').css("width", "30%");
        }
    }

    let x = window.matchMedia("(max-width: 760px)");
});