var link = document.getElementById("mode");
var test = document.getElementById("switcher");


function switchTheme() {

    event.preventDefault();

    if (link.getAttribute("href") == "internal-resources/css/light_theme.css") {
        link.setAttribute("href", "internal-resources/css/dark_theme.css");

    } else {

        link.setAttribute("href", "internal-resources/css/light_theme.css");


    }



}