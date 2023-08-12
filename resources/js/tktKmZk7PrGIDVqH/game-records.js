$(document).ready(function() {
    $('div.gamecard').click(function(){detailsClick(this)})
    $('select#sortby').on('change', function (e){selectChange(this.value)});
    buildGameList()
    // run selectChange to check if value is different from
    // default, usually from previous page visit
    selectChange($('select#sortby').eq(0).val())
})

var gameListBuilt = false
var allGames = []
var lastVal = "titleAZ"

function selectChange(val) {
    if (gameListBuilt) {
        if (lastVal !== val) {
            lastVal = val
            sortBy(val)
        }
    }
}

function detailsClick(e) {
    var idattr = $(e).find("img").eq(0).attr("id").substring(1)
    while (idattr.indexOf("0") == 0) {
        idattr = idattr.substring(1)
    }
    if (idattr.length == 0) {
        // special case for id of 0 (bloodborne)
        idattr = "0"
    }
    if (!/^\d+$/.test(idattr)) {
        alert("Malformed game ID")
    } else {
        navigate("/records/games/details/?id=" + idattr)
    }
}

function sortBy(val) {
    var gamecardContainer = $("div.gamecard-container")
    gamecardContainer.html("<p>Sorting... (make sure JavaScript is enabled)</p>")
    if (val == "titleAZ") {
        allGames.sort((a, b) => a.title.localeCompare(b.title))
    } else if (val == "titleZA") {
        allGames.sort((a, b) => b.title.localeCompare(a.title))
    } else if (val == "yearUp") {
        allGames.sort((a, b) => a.year - b.year)
    } else if (val == "yearDown") {
        allGames.sort((a, b) => b.year - a.year)
    } else if (val == "ratingUp") {
        allGames.sort((a, b) => a.rating - b.rating)
    } else if (val == "ratingDown") {
        allGames.sort((a, b) => b.rating - a.rating)
    } else if (val == "hoursUp") {
        allGames.sort((a, b) => a.hours - b.hours)
    } else if (val == "hoursDown") {
        allGames.sort((a, b) => b.hours - a.hours)
    }
    var sortedHTML = ""
    allGames.forEach((g) => sortedHTML += "<div class=\"gamecard flex card\">" + g.html + "</div>")
    gamecardContainer.html(sortedHTML)
    // re-register gamecard click since DOM has changed
    $('div.gamecard').click(function(){detailsClick(this)})
}

function buildGameList() {
    $("div.gamecard").each(function() {
        var gamecard = $(this)
        var playtext = gamecard.find("span.gamecard-playtext").html()
        var subtexts = gamecard.find("span.gamecard-subtext")
        var game = {
            title: gamecard.find("span.gamecard-title").html(),
            hours: Number(playtext.substring(0, playtext.indexOf(" hours"))),
            platform: subtexts.eq(1).html(),
            year: Number(subtexts.eq(0).html()),
            rating: getRating(gamecard.find("span.gamecard-rating").eq(0)),
            iconid: gamecard.find("img").eq(0).attr("id").substring(1),
            html: gamecard.html()
        }
        allGames.push(game)
    })
    gameListBuilt = true
}

function getRating(ratingElement) {
    var rating = 0
    ratingElement.find("img").each(function() {
        var img = $(this).attr("src")
        if (img.indexOf("sf.") !== -1) {
            rating += 1
        } else if (img.indexOf("sh.") !== - 1) {
            rating += 0.5
        }
    })
    return rating
}
