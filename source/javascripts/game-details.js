// https://stackoverflow.com/a/901144
const params = new Proxy(new URLSearchParams(window.location.search), {
    get: (sp, p) => sp.get(p),
});

function csvdone(data) {
    const rows = data.split(/\r?\n|\r/);
    const allgames = rows.slice(1).map(row => {
        const [title, company, year, platform, rating, hundo, plat, iconid, hours, playthroughs, dlc] = row.split(',');
        return {
            title,
            company,
            year: Number(year),
            platform,
            rating: Number(rating),
            hundo: Number(hundo),
            plat: Number(plat),
            iconid,
            hours: Number(hours),
            playthroughs: Number(playthroughs),
            dlc: Number(dlc)
        };
    });
    loaddetails(allgames);
}

function loaddetails(allgames) {
    const loading = $("p#loading");
    const details = $("div#details-container");
    const id = params.id;

    const game = allgames.find(g => g.iconid == id);

    if (!game) {
        loading.html("Unknown game ID");
        return;
    }

    const iconid = id.padStart(6, '0');
    $("div#details-container img.details-icon").prop("src", `/images/xshQS5ZxxjzMEsQ5/${iconid}.png`);

    let title = game.title;
    if (game.dlc == 1) title += '<span class="dlc">DLC</span>';
    if (game.hundo == 1) title += '<span class="hundo">100%</span>';
    if (game.plat == 1) title += '<img alt="platinum" src="/images/wT9F00t1BuDE9wRx/plat.png">';

    const plays = game.playthroughs === -1 ? "In-Progress" : game.playthroughs === -9 ? "None (abandoned)" : game.playthroughs === 0 ? "None (incomplete)" : game.playthroughs;

    $("span#title").html(title);
    $("span#year").html(game.year);
    $("span#company").html(game.company);
    $("span#platform").html(game.platform);
    $("span#hours").html(game.hours);
    $("span#playthroughs").html(plays);
    $("span#rating").html(game.rating);

    loading.hide();
    details.show();

    $.ajax({
        url: 'https://raw.githubusercontent.com/egartley/records/master/games/notes.json',
        dataType: 'text',
    }).done(checknotes);
}

function checknotes(data) {
    const notesContainer = $("div#notes-container");
    let notesData;

    try {
        notesData = JSON.parse(data);
    } catch (e) {
        notesContainer.html(`There was an issue while parsing the JSON from <a href="https://raw.githubusercontent.com/egartley/records/master/games/notes.json">https://raw.githubusercontent.com/egartley/records/master/games/notes.json</a>`).show();
        return;
    }

    if (notesData[params.id] !== undefined) {
        const sanitized = notesData[params.id].replace(/[^a-zA-Z0-9.,?!'"\/\- ]/g, '');
        notesContainer.html(`<h2>Notes</h2><p>${sanitized}</p>`).show();
    }
}

$(document).ready(function() {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id < 0) {
        $("p#loading").html("Malformed ID");
        return;
    }

    $.ajax({
        url: 'https://raw.githubusercontent.com/egartley/records/master/games/games.csv',
        dataType: 'text',
    }).done(csvdone);
});
