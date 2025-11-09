$(document).ready(() => {
    const $sortby = $('select#sortby');
    const $filter = $('select#filter');
    const $filterby = $('select.filterby');

    $sortby.on('change', updateGames);
    $filter.on('change', () => { filterChange($filter.val()); updateGames(); });
    $filterby.on('change', updateGames);

    allGames = buildGameList();
    gameListBuilt = true;

    // Run filterChange and updateGames since the
    // values may not be default due to a back
    // navigation from previous visit
    filterChange($filter.eq(0).val());
    updateGames();
});

var gameListBuilt = false
var allGames = []

function updateGames() {
    if (!gameListBuilt) {
        return;
    }
    let filterVal = $('select#filter').eq(0).val();
    let filterRange = $('select.filterby').eq(0).val();
    let sortVal = $('select#sortby').eq(0).val();

    // filter from all games, then sort
    let filteredList = getFilteredGameList(filterVal, filterRange);
    let sortedList = getSortedGameList(sortVal, filteredList);

    let gameHTML = "";
    sortedList.forEach((g) => gameHTML += `<div class="gamecard flex card">${g.html}</div>`);
    if (gameHTML === "") {
        gameHTML = "<p>No games found. Please try a different filter.</p>";
    }
    $("div.gamecard-container").html(gameHTML);
}

function filterChange(val) {
    if (!gameListBuilt) {
        return;
    }
    let label = $("label.filterby");
    let sel = $("select.filterby");
    if (val === "none") {
        label.hide();
        sel.hide();
    } else {
        label.html(getFilterLabel(val));
        sel.html(getFilterHTML(val));
        label.show();
        sel.show();
    }
}

function getFilterLabel(val) {
    const filterLabels = {
        "platform": "Platform:",
        "rating": "Rating:",
        "year": "Year:",
        "hours": "Hours Played:",
        "playthroughs": "Playthroughs:",
        "hundo": "100% Completion:",
        "plat": "Platinum:"
    };

    return filterLabels[val] || "ERROR";
}

function getFilterHTML(val) {
    const filterOptions = {
        "platform": '<option selected="selected" value="ps5">PlayStation 5</option>' + 
            '<option value="ps4">PlayStation 4</option>' +
            '<option value="pc">PC</option>' +
            '<option value="ps12">PlayStation 1 and 2</option>' +
            '<option value="switch">Nintendo Switch 1 and 2</option>' +
            '<option value="nonswitch">Nintendo Wii U and earlier</option>' +
            '<option value="allelse">Other</option>',
        "rating": '<option selected="selected" value="5star">5 stars</option>' + 
            '<option value="45star">4.5 stars</option>' +
            '<option value="4star">4 stars</option>' +
            '<option value="35star">3.5 stars</option>' +
            '<option value="3star">3 stars</option>' +
            '<option value="25stars">2.5 stars or below</option>',
        'year': '<option selected="selected" value="20s">Recent (2020-Present)</option>' + 
            '<option value="teens2">2016-2019</option>' +
            '<option value="teens1">2013-2015</option>' +
            '<option value="tens">2010-2012</option>' +
            '<option value="00s">2000-2009</option>' +
            '<option value="bc">1999 or eariler</option>',
        'hours': '<option selected="selected" value="70">70 or more</option>' + 
            '<option value="5069">50 to 69</option>' +
            '<option value="3049">30 to 49</option>' +
            '<option value="1029">10 to 29</option>' +
            '<option value="9">9 or less</option>',
        'playthroughs': '<option selected="selected" value="4">4 or more</option>' + 
            '<option value="3">3</option>' +
            '<option value="2">2</option>' +
            '<option value="1">1</option>' +
            '<option value="0">0 (incomplete)</option>' +
            '<option value="inp">0 (in-progress)</option>' +
            '<option value="9">0 (abandoned)</option>',
        'hundo': '<option selected="selected" value="y">Yes</option>' + 
            '<option value="n">No</option>',
        'plat': '<option selected="selected" value="y">Yes</option>' + 
            '<option value="n">No</option>'
    };

    return filterOptions[val] || '';
}

function getFilteredGameList(filter, val) {
    var filteredGames = []
    if (filter == "none") {
        return allGames
    } else if (filter == "platform") {
        const platformFilters = {
            "ps4": ["PlayStation 4"],
            "ps5": ["PlayStation 5"],
            "ps12": ["PlayStation 1", "PlayStation 2"],
            "switch": ["Nintendo Switch", "Nintendo Switch 2"],
            "pc": ["PC"]
        };
        
        let platforms = platformFilters[val];
        if (platforms) {
            filteredGames = allGames.filter(g => platforms.includes(g.platform));
        } else if (val === "nonswitch") {
            filteredGames = allGames.filter(g => g.platform.includes("Nintendo") && !g.platform.includes("Switch"));
        } else if (val === "allelse") {
            filteredGames = allGames.filter(g => !g.platform.includes("Nintendo") && !g.platform.includes("PlayStation") && !g.platform.includes("PC"));
        }
    } else if (filter == "rating") {
        let rmin = 0, rmax = 5;
        const ratingRanges = {
            "5star": { rmin: 5, rmax: 5 },
            "45star": { rmin: 4.5, rmax: 4.5 },
            "4star": { rmin: 4, rmax: 4 },
            "35star": { rmin: 3.5, rmax: 3.5 },
            "3star": { rmin: 3, rmax: 3 },
            "default": { rmin: 0, rmax: 2.5 }
        };
        
        let range = ratingRanges[val] || ratingRanges["default"];
        rmin = range.rmin;
        rmax = range.rmax;
        
        filteredGames = allGames.filter(g => g.rating <= rmax && g.rating >= rmin);
    } else if (filter == "year") {
        let ymin = 1900, ymax = 2100;
        const yearRanges = {
            "20s": { ymin: 2020, ymax: 2029 },
            "teens2": { ymin: 2016, ymax: 2019 },
            "teens1": { ymin: 2013, ymax: 2015 },
            "tens": { ymin: 2010, ymax: 2012 },
            "00s": { ymin: 2000, ymax: 2009 },
            "default": { ymin: 1900, ymax: 1999 }
        };
        
        let range = yearRanges[val] || yearRanges["default"];
        ymin = range.ymin;
        ymax = range.ymax;
        
        filteredGames = allGames.filter(g => g.year <= ymax && g.year >= ymin);
    } else if (filter == "hours") {
        let hmin = 0, hmax = 9999;
        const hourRanges = {
            "70": { hmin: 70, hmax: 9999 },
            "5069": { hmin: 50, hmax: 69 },
            "3049": { hmin: 30, hmax: 49 },
            "1029": { hmin: 10, hmax: 29 },
            "default": { hmin: 0, hmax: 9 }
        };

        let range = hourRanges[val] || hourRanges["default"];
        hmin = range.hmin;
        hmax = range.hmax;

        filteredGames = allGames.filter(g => g.hours <= hmax && g.hours >= hmin);
    } else if (filter == "playthroughs") {
        let pmin = -9, pmax = 999;
        const playthroughRanges = {
            "9": { pmin: -9, pmax: -9 },
            "inp": { pmin: -1, pmax: -1 },
            "0": { pmin: 0, pmax: 0 },
            "1": { pmin: 1, pmax: 1 },
            "2": { pmin: 2, pmax: 2 },
            "3": { pmin: 3, pmax: 3 },
            "default": { pmin: 4, pmax: 999 }
        };
        
        let range = playthroughRanges[val] || playthroughRanges["default"];
        pmin = range.pmin;
        pmax = range.pmax;
        
        filteredGames = allGames.filter(g => g.playthroughs <= pmax && g.playthroughs >= pmin);
    } else {
        filteredGames = allGames.filter(g => 
            (filter === "hundo" && g.hundo === (val === "y")) || 
            (filter === "plat" && g.plat === (val === "y"))
        );
    }
    return filteredGames
}

function getSortedGameList(val, list) {
    switch (val) {
        case "titleAZ":
            list.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case "titleZA":
            list.sort((a, b) => b.title.localeCompare(a.title));
            break;
        case "yearUp":
            list.sort((a, b) => a.year - b.year);
            break;
        case "yearDown":
            list.sort((a, b) => b.year - a.year);
            break;
        case "ratingUp":
            list.sort((a, b) => a.rating - b.rating);
            break;
        case "ratingDown":
            list.sort((a, b) => b.rating - a.rating);
            break;
        case "hoursUp":
            list.sort((a, b) => a.hours - b.hours);
            break;
        case "hoursDown":
            list.sort((a, b) => b.hours - a.hours);
            break;
    }
    return list;
}

function buildGameList() {
    let gameList = [];
    $("div.gamecard").each((_, element) => {
        const gamecard = $(element);
        const playtext = gamecard.find("span.gamecard-playtext").html();
        const subtexts = gamecard.find("span.gamecard-subtext");
        const game = {
            title: gamecard.find("span.gamecard-title").html(),
            hours: Number(playtext.substring(0, playtext.indexOf(" hours"))),
            platform: subtexts.eq(1).html(),
            year: Number(subtexts.eq(0).html()),
            rating: getRating(gamecard.find("span.gamecard-rating").eq(0)),
            iconid: gamecard.find("img").eq(0).attr("id").substring(1),
            hundo: gamecard.html().includes("class=\"hundo\""),
            plat: gamecard.html().includes("img alt=\"plat\""),
            playthroughs: getPlaythroughs(playtext),
            html: gamecard.html()
        };
        gameList.push(game);
    });
    return gameList;
}

function getRating(ratingElement) {
    let rating = 0;
    ratingElement.find("img").each((_, element) => {
        const img = $(element).attr("src");
        if (img.includes("sf.")) {
            rating += 1;
        } else if (img.includes("sh.")) {
            rating += 0.5;
        }
    });
    return rating;
}

function getPlaythroughs(playtext) {
    switch (true) {
        case playtext.endsWith("hours"):
            return 1;
        case playtext.includes("incomplete"):
            return 0;
        case playtext.includes("in-progress"):
            return -1;
        case playtext.includes("abandoned"):
            return -9;
        default:
            return Number(playtext.substring(playtext.indexOf("played ") + 7, playtext.indexOf(" times")));
    }
}
