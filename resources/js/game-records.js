var notesJSON = [];

function getNotesJSON() {
    $.getJSON("/resources/json/game-records.json", function(data) {
        notesJSON = data.notes
    })
}

function getNote(gameid) {
    for (let i = 0; i < notesJSON.length; i++) {
        n = notesJSON[i]
        if (n.id == Number(gameid)) {
            return n.text
        }
    }
    return "Note not found!"
}

$(document).ready(function() {
    getNotesJSON();
    var modal = $("div.modal");
    // temp disable
    /*$("div.gamecard").click(function() {
        modal.css("display", "flex");
        $("p#modal-text").html(getNote($(this).find("span#gameid").attr("gameid")))
    });*/
    modal.click(function() {
        modal.css("display", "none")
    })
})
