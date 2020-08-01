window.addEventListener('load', function(){
    $(".loader").fadeOut(500);
});

$(document).ready(function()
{
    let x = window.matchMedia("(max-width: 760px)");
    let searched = false;

    //Changes to the active indicator and navigates sections with reference to the indicators
    $(".indicator").on("click", function()
    {
        $(".indicator").removeClass('active-indicator');
        $(this).addClass('active-indicator');

        let sn = $(this).attr('parent');

        if(!x.matches)
        {
            hideSections(sn);
        }
    });

    //Changes to the active indicator and navigates sections with reference to the buttons
    $(".more-info").on('click', function()
    {
        let dest = $(this).attr("dest");

        if(!x.matches)
        {
            hideSections(dest);
        }

        $(".indicator").removeClass("active-indicator");
        $(dest + "-ind").addClass("active-indicator");
    });

    //Checks the media device width and calls different functions depending on the width
    checkWidth(x);
    function checkWidth(x)
    {
        if(x.matches && !searched)
        {
            $(".indicator").fadeOut(10);
            showSections();
        }
        else if(x.matches && searched)
        {
            $(".indicator").fadeOut(10);
        }
        else if(!x.matches && searched)
        {
            $(".indicator").fadeOut(10);
            hideSections("#search-results");
        }
        else
        {
            $(".indicator").fadeIn(10);
            hideSections("#top");
        }
    }

    function hideSections(sectName)
    {
        $("section").fadeOut(10);
        $(sectName).fadeIn(500);
    }

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

    $("#search-btn").click(function()
    {
        searched = true;
        $(".loader").fadeIn(10);
        hideSections("#search-results");
        $(".indicator").fadeOut(10);        
    });
    $("#back-btn").click(function()
    {
        searched = false;
        if(!x.matches)
        {
            hideSections("#section-2");
            $(".indicator").fadeIn(10);
        }
        else
        {
            showSections()
        }
    });
    
    x.addListener(checkWidth);
});