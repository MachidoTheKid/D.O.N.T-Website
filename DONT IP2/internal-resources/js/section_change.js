$(document).ready(function()
{
    //All sections fade out except for the top section
    $("section").fadeOut(50, function()
    {
        $("#top").fadeIn(500);
    });

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
});