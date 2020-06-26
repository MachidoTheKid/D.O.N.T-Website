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

    $("#search-btn").click(function()
    {
        $("section").hide();

        $(".indicator").removeClass("active-indicator");
        $("#search-ind").addClass("active-indicator");

        $("#search").fadeIn(500);
    });

    $("#info-btn").click(function()
    {
        $("section").hide();

        $(".indicator").removeClass("active-indicator");
        $("#about-ind").addClass("active-indicator");

        $("#about").fadeIn(500);
    });

    $("#author-btn").click(function()
    {
        $("section").hide();

        $(".indicator").removeClass("active-indicator");
        $("#author-ind").addClass("active-indicator");

        $("#author").fadeIn(500);
    });
});