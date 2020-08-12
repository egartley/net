function navigate(url) {
	window.location = url
}

function submitQuery() {
	// submit query by navigating to search page with the query as parameter
	navigate("/search/?q=" + $('.widget-search-textbox').val())
}

function getURLParameter(parameter) {
	// returns given url "parameter", or null if it is not there
	return decodeURIComponent((new RegExp('[?|&]' + parameter + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search) || [null, ''])[1].replace(/\+/g, '%20')) || null;
}

function press(e) {
	var key = e.keyCode || e.which;
	if (13 == key) {
		// enter/return was pressed
		submitQuery()
	}
}