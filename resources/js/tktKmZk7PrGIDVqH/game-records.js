$(document).ready(function() {
    $('div.gamecard').click(function() {
        var idattr = $(this).find("img").eq(0).attr("id").substring(1)
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
    })
})