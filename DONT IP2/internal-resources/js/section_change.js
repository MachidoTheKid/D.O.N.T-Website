//Overlays the loading animation over the content until all the elements are loaded
window.addEventListener('load', function(){
    $(".loader").fadeOut(500);
});


$(document).ready(function()
{
    let x = window.matchMedia("(max-width: 760px)");
    let searched = false;

    //Navigates sections with reference to the button clicked
    $(".hp-btn").on("click", function()
    {
        let sn = $(this).attr('dest');

        if(!x.matches)
        {
            hideSections(sn);
        }
    });

    //Checks the media device width and calls different functions depending on the width and
    //whether or not the user has searched
    checkWidth(x);
    function checkWidth(x)
    {
        if(x.matches && !searched)
        {
            $(".page-indicator").fadeOut(10);
            showSections();
        }
        else if(x.matches && searched)
        {
            $(".page-indicator").fadeOut(10);
        }
        else if(!x.matches && searched)
        {
            $(".page-indicator").fadeOut(10);
            hideSections("#search-results");
        }
        else
        {
            $(".page-indicator").fadeIn(10);
            hideSections("#top");
        }
    }

    //Hides all  sections then displays the section passed in as a parameter
    function hideSections(sectName)
    {
        $("section").fadeOut(10);
        $(sectName).fadeIn(500);
    }

    //Displays all sections except for the #search-results section
    function showSections()
    {
        $("section").fadeIn(500, function()
        {
            if(!searched)
            {
                $("#search-results").fadeOut(10);
            }            
        });
    }

    //Overlays the loader on the screen as the search results load
    //hides all sections apart from the the #search-results section
    //Fades out the side navigation
    $("#search-btn").click(function()
    {
        searched = true;
        $(".loader").fadeIn(10);
        hideSections("#search-results");
        $(".page-indicator").fadeOut(10);        
    });

    //Returns the user to the search page from the results page
    $("#back-btn").click(function()
    {
        searched = false;
        if(!x.matches)
        {
            hideSections("#section-2");
            $(".page-indicator").fadeIn(10);
        }
        else
        {
            showSections()
        }
    });
    
    //Adds event listener to window that fires when the width changes
    x.addListener(checkWidth);
});