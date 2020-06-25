$(document).ready(function()
{
    $("section").fadeOut(100, function()
    {
        $("#home").fadeIn(500);
    });

    $(".indicator").click(function()
    {
        $(".indicator").removeClass("active-indicator");
        $(this).addClass("active-indicator");
        $("section").hide();
        let partent = $(this).attr("parent");

        $("#" + partent).fadeIn(500);
    });

    $("#search-btn").click(function()
    {
        $("section").hide();

        $(".indicator").removeClass("active-indicator");
        $("#search-ind").addClass("active-indicator");

        $("#search").fadeIn(500);
    });
});