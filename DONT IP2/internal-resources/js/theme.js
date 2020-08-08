var link = document.getElementById("mode");

function switchTheme() {

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
}