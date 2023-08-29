$(document).ready(function() {
    $('div.gamecard').click(function(){detailsClick(this)})
    $('select#sortby').on('change', function(){updateGames()})
    $('select#filter').on('change', function(){filterChange(this.value), updateGames()})
    $('select.filterby').on('change', function(){updateGames()})
    allGames = buildGameList()
    gameListBuilt = true
    // run filterChange and updateGames since the
    // values may not be default due to a back
    // navigation from previous visit
    filterChange($('select#filter').eq(0).val())
    updateGames()
})

var gameListBuilt = false
var allGames = []

function registerDetailsClick() {
    $('div.gamecard').click(function(){detailsClick(this)})
}

function updateGames() {
    if (!gameListBuilt) {
        return
    }
    var filterVal = $('select#filter').eq(0).val()
    var filterRange = $('select.filterby').eq(0).val()
    var sortVal = $('select#sortby').eq(0).val()

    // filter from all games, then sort
    var filteredList = getFilteredGameList(filterVal, filterRange)
    var sortedList = getSortedGameList(sortVal, filteredList)

    var gameHTML = ""
    sortedList.forEach((g) => gameHTML += "<div class=\"gamecard flex card\">" + g.html + "</div>")
    if (gameHTML == "") {
        gameHTML = "<p>No games found. Please try a different filter.</p>"
    }
    $("div.gamecard-container").html(gameHTML)

    registerDetailsClick()
}

function filterChange(val) {
    if (!gameListBuilt) {
        return
    }
    if (val == "none") {
        $("label.filterby").hide()
        $("select.filterby").hide()
    } else {
        var label = $("label.filterby")
        var sel = $("select.filterby")
        label.html(getFilterLabel(val))
        sel.html(getFilterHTML(val))
        label.show()
        sel.show()
    }
}

function getFilterLabel(val) {
    if (val == "platform") {
        return "Platform:"
    } else if (val == "rating") {
        return "Rating:"
    } else if (val == "year") {
        return "Year:"
    } else if (val == "hours") {
        return "Hours Played:"
    } else if (val == "playthroughs") {
        return "Playthroughs:"
    } else if (val == "hundo") {
        return "100% Completion:"
    } else if (val == "plat") {
        return "Platinum:"
    }
    return "ERROR"
}

function getFilterHTML(val) {
    if (val == "platform") {
        return '<option selected="selected" value="ps5">PlayStation 5</option>' + 
            '<option value="ps4">PlayStation 4</option>' +
            '<option value="ps45">PlayStation 4 and 5</option>' +
            '<option value="ps12">PlayStation 1 and 2</option>' +
            '<option value="switch">Nintendo Switch</option>' +
            '<option value="nonswitch">Nintendo Wii, DS and 3DS</option>' +
            '<option value="allelse">PC and Other</option>'
    } else if (val == "rating") {
        return '<option selected="selected" value="5star">5 stars</option>' + 
            '<option value="45star">4.5 stars</option>' +
            '<option value="4star">4 stars</option>' +
            '<option value="35star">3.5 stars</option>' +
            '<option value="3star">3 stars</option>' +
            '<option value="25stars">2.5 stars or below</option>'
    } else if (val == "year") {
        return '<option selected="selected" value="20s">Recent (2020-2023)</option>' + 
            '<option value="teens2">2016-2019</option>' +
            '<option value="teens1">2013-2015</option>' +
            '<option value="tens">2010-2012</option>' +
            '<option value="00s">2000-2009</option>' +
            '<option value="bc">1999 or eariler</option>'
    } else if (val == "hours") {
        return '<option selected="selected" value="70">70 or more</option>' + 
            '<option value="5069">50 to 69</option>' +
            '<option value="3049">30 to 49</option>' +
            '<option value="1029">10 to 29</option>' +
            '<option value="9">9 or less</option>'
    } else if (val == "playthroughs") {
        return '<option selected="selected" value="4">4 or more</option>' + 
            '<option value="3">3</option>' +
            '<option value="2">2</option>' +
            '<option value="1">1</option>' +
            '<option value="0">0 (incomplete)</option>' +
            '<option value="inp">0 (in-progress)</option>' +
            '<option value="9">0 (abandoned)</option>'
    } else if (val == "hundo" || val == "plat") {
        return '<option selected="selected" value="y">Yes</option>' + 
            '<option value="n">No</option>'
    }
}

function getFilteredGameList(filter, val) {
    var filteredGames = []
    if (filter == "none") {
        return allGames
    } else if (filter == "platform") {
        if (["ps4", "ps5", "ps45", "ps12"].includes(val)) {
            var l = []
            if (val == "ps12") {
                l = ["PlayStation 1", "PlayStation 2"]
            } else {
                l = ["PlayStation 4/5"]
                if (val.indexOf("4") >= 0) {
                    l.push("PlayStation 4")
                } else if (val.indexOf("5") >= 0) {
                    l.push("PlayStation 5")
                }
            }
            for (const g of allGames) {
                if (l.includes(g.platform)) {
                    filteredGames.push(g)
                }
            }
        } else if (val == "switch") {
            for (const g of allGames) {
                if (g.platform == "Nintendo Switch") {
                    filteredGames.push(g)
                }
            }
        } else if (val == "nonswitch") {
            for (const g of allGames) {
                if (g.platform.indexOf("Nintendo") !== -1 && g.platform.indexOf("Switch") == -1) {
                    filteredGames.push(g)
                }
            }
        } else if (val == "allelse") {
            for (const g of allGames) {
                if (g.platform.indexOf("Nintendo") == -1 && g.platform.indexOf("PlayStation") == -1) {
                    filteredGames.push(g)
                }
            }
        }
    } else if (filter == "rating") {
        var rmin = 0, rmax = 5
        switch (val) {
            case "5star":
                rmin = 5, rmax = 5
                break
            case "45star":
                rmin = 4.5, rmax = 4.5
                break
            case "4star":
                rmin = 4, rmax = 4
                break
            case "35star":
                rmin = 3.5, rmax = 3.5
                break
            case "3star":
                rmin = 3, rmax = 3
                break
            default:
                rmin = 0, rmax = 2.5
        }
        for (const g of allGames) {
            if (g.rating <= rmax && g.rating >= rmin) {
                filteredGames.push(g)
            }
        }
    } else if (filter == "year") {
        var ymin = 1900, ymax = 2100
        switch (val) {
            case "20s":
                ymin = 2020, ymax = 2029
                break
            case "teens2":
                ymin = 2016, ymax = 2019
                break
            case "teens1":
                ymin = 2013, ymax = 2015
                break
            case "tens":
                ymin = 2010, ymax = 2012
                break
            case "00s":
                ymin = 2000, ymax = 2009
                break
            default:
                ymin = 1900, ymax = 1999
        }
        for (const g of allGames) {
            if (g.year <= ymax && g.year >= ymin) {
                filteredGames.push(g)
            }
        }
    } else if (filter == "hours") {
        var hmin = 0, hmax = 9999
        switch (val) {
            case "70":
                hmin = 70
                break
            case "5069":
                hmin = 50
                hmax = 69
                break
            case "3049":
                hmin = 30
                hmax = 49
                break
            case "1029":
                hmin = 10
                hmax = 29
                break
            default:
                hmax = 9
        }
        for (const g of allGames) {
            if (g.hours <= hmax && g.hours >= hmin) {
                filteredGames.push(g)
            }
        }
    } else if (filter == "playthroughs") {
        var pmin = -9, pmax = 999
        switch (val) {
            case "9":
                pmax = -9
                break
            case "inp":
                pmin = -1
                pmax = -1
                break
            case "0":
                pmin = 0
                pmax = 0
            case "1":
            case "2":
            case "3":
                pmin = Number(val)
                pmax = Number(val)
                break
            default:
                pmin = 4
        }
        for (const g of allGames) {
            if (g.playthroughs <= pmax && g.playthroughs >= pmin) {
                filteredGames.push(g)
            }
        }
    } else {
        for (const g of allGames) {
            if ((filter == "hundo" && g.hundo == (val == "y"))
                || (filter == "plat" && g.plat == (val == "y"))) {
                filteredGames.push(g)
            }
        }
    }
    return filteredGames
}

function getSortedGameList(val, list) {
    if (val == "titleAZ") {
        list.sort((a, b) => a.title.localeCompare(b.title))
    } else if (val == "titleZA") {
        list.sort((a, b) => b.title.localeCompare(a.title))
    } else if (val == "yearUp") {
        list.sort((a, b) => a.year - b.year)
    } else if (val == "yearDown") {
        list.sort((a, b) => b.year - a.year)
    } else if (val == "ratingUp") {
        list.sort((a, b) => a.rating - b.rating)
    } else if (val == "ratingDown") {
        list.sort((a, b) => b.rating - a.rating)
    } else if (val == "hoursUp") {
        list.sort((a, b) => a.hours - b.hours)
    } else if (val == "hoursDown") {
        list.sort((a, b) => b.hours - a.hours)
    }
    return list
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

function buildGameList() {
    var l = []
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
            hundo: gamecard.html().indexOf("class=\"hundo\"") !== -1,
            plat: gamecard.html().indexOf("img alt=\"plat\"") !== -1,
            playthroughs: getPlaythroughs(playtext),
            html: gamecard.html()
        }
        l.push(game)
    })
    return l
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

function getPlaythroughs(playtext) {
    if (playtext.endsWith("hours")) {
        return 1
    } else if (playtext.indexOf("incomplete") !== -1) {
        return 0
    } else if (playtext.indexOf("in-progress") !== -1) {
        return -1
    } else if (playtext.indexOf("abandoned") !== -1) {
        return -9
    } else {
        return Number(playtext.substring(playtext.indexOf("played ") + 7, playtext.indexOf(" times")))
    }
}
