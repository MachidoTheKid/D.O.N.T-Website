$(document).ready(function(){
    let link = document.getElementById("mode");

    $("#thmIcon").on('click',function() {

        event.preventDefault();

        if (link.getAttribute("href") == "./internal-resources/css/light_theme.css") {
            link.setAttribute("href", "./internal-resources/css/dark_theme.css");
            $("#themeIcon").removeClass("fa-moon-o");
            $("#themeIcon").addClass("fa-sun-o");
        }
        else {
            link.setAttribute("href", "./internal-resources/css/light_theme.css");
            $("#themeIcon").removeClass("fa-sun-o");
            $("#themeIcon").addClass("fa-moon-o");
        }
    });

    $("#hmThmIcon").on('click',function() {

        event.preventDefault();

        if (link.getAttribute("href") == "./DONT IP2/internal-resources/css/light_theme.css") {
            link.setAttribute("href", "./DONT IP2/internal-resources/css/dark_theme.css");
            $("#themeIcon").removeClass("fa-moon-o");
            $("#themeIcon").addClass("fa-sun-o");
        }
        else {
            link.setAttribute("href", "./DONT IP2/internal-resources/css/light_theme.css");
            $("#themeIcon").removeClass("fa-sun-o");
            $("#themeIcon").addClass("fa-moon-o");
        }
    });
});