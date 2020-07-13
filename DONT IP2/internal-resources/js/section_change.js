$(document).ready(function()
{
    //All sections fade out except for the top section
    function hideSection(x)
    {
        if(!x.matches)
        {
            $("section").fadeOut(50, function()
            {
                $("#top").fadeIn(500);
            });

            $(".indicator").fadeIn(500);
            
            //Side Nav Indicator and subsequent Section change Animation
            $(".indicator").click(function()
            {
                $(".indicator").removeClass("active-indicator");
                $(this).addClass("active-indicator");
                $("section").hide();
                let partent = $(this).attr("parent");

                $("#" + partent).fadeIn(500);
            });

            //Next section Buttons
            $("#section-2-btn").click(function()
            {
                $("section").hide();

                $(".indicator").removeClass("active-indicator");
                $("#section-2-ind").addClass("active-indicator");

                $("#section-2").fadeIn(500);
            });

            $("#section-3-btn").click(function()
            {
                $("section").hide();

                $(".indicator").removeClass("active-indicator");
                $("#section-3-ind").addClass("active-indicator");

                $("#section-3").fadeIn(500);
            });

            $("#section-4-btn").click(function()
            {
                $("section").hide();

                $(".indicator").removeClass("active-indicator");
                $("#section-4-ind").addClass("active-indicator");

                $("#section-4").fadeIn(500);
            });
        }
        else
        {
            $("section").fadeIn(500);
            $(".indicator").fadeOut(500);
        }
    }

    let x = window.matchMedia("(max-width: 760px)");

    hideSection(x);

    x.addListener(hideSection);

    
});