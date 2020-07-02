$(document).ready(function()
{
    $("section").fadeOut(50, function()
    {
        $("#top").fadeIn(500);
    });



    $(".indicator").click(function()
    {
        $(".indicator").removeClass("active-indicator");
        $(this).addClass("active-indicator");
        $("section").hide();
        let partent = $(this).attr("parent");

        $("#" + partent).fadeIn(500);
    });

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