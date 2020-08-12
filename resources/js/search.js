var searchJSON = null;
var dataCached = false;

var rootPages = [];
var redirectPages = [];

$(document).ready(function() {
	var query = getURLParameter("q");
	if (null != query && "" != query) {
		$("input#query").val(query);
		go(query);
	}
});

function getResultHTML(result) {
	if (result.category == 0) {
		// root page
		var base = "https://egartley.net";
		if (!result.url.startsWith("/")) {
			base = "";
		}
		return "<div id='result-container'><a id='title' style='text-decoration:none' href='" + result.url + "'>" + result.title + "</a><br><a href='" + result.url + "'>" + result.url + "</a><br>" + result.desc + "</div>";
	} else if (result.category == 1) {
		// redirection
		return "<div id='result-container'><a id='title' style='text-decoration:none' href='" + result.url + "'>" + result.title + "</a><br>" + result.desc + "</div>";
	}
}

function out(html) {
	$("p#results").html(html).fadeIn()
}

function pushResults(results, query) {
	var html = "";
	if (0 == results.length) {
		out('No results were found for "' + query + '"'); // no results found!
		return;
	}
	if (1 == results.length) {
		out(getResultHTML(results[0])); // only one result, no need to execute for loop
		return;
	}
	for (i = 0; i < results.length; i++) {
		html += getResultHTML(results[i]);
		html += "<br><br>";
	}
	out(html);
}

function searchQuery(query) {
	var matches = [];

	if (!dataCached) {
		// root-pages
		for (var i = 0; i < searchJSON["root-pages"].length; i++) {
			var page = searchJSON["root-pages"][i];
			rootPages.push({
				terms: page.keywords,
				title: page["display-title"],
				url: page.url,
				desc: page.desc,
				matched: false,
				category: 0
			})
		}
		// redirections
		for (var i = 0; i < searchJSON["redirections"].length; i++) {
			var page = searchJSON["redirections"][i];
			redirectPages.push({
				terms: page.keywords,
				title: "Redirection \"" + page.url + "\"",
				url: "https://go.egartley.net/" + page.url,
				desc: page.destination,
				matched: false,
				category: 1
			})
		}
		dataCached = true
	}

	// search through root pages
	for (i = 0; i < rootPages.length; i++) {
		for (var page = rootPages[i], terms = page.terms, j = 0; j < terms.length; j++) {
			if (terms[j].toLowerCase().startsWith(query.toLowerCase())) {
				if (!page.matched) {
					// prevent duplicate results
					page.matched = true;
					matches.push(page);
					continue;
				}
			}
		}
		page.matched = false;
	}

	// search through redirections
	for (var i = 0; i < redirectPages.length; i++) {
		for (var page = redirectPages[i], terms = page.terms, j = 0; j < terms.length; j++) {
			if (terms[j].toLowerCase().startsWith(query.toLowerCase())) {
				if (!page.matched) {
					// prevent duplicate results
					page.matched = true;
					matches.push(page);
					continue;
				}

			}
		}
		page.matched = false;
	}

	$(".spin").hide();
	pushResults(matches, query);
}

function fetchSearchJSON(query) {
	var request = new XMLHttpRequest,
		jsonURL = "https://egartley.net/temp-cdn/json/search.json";
	request.onload = function() {
		if (200 == request.status) {
			searchJSON = JSON.parse(request.responseText);
			searchQuery(query);
		} else {
			console.log("There was an error while fetching the search index! (" + request.statusText + ")");
		}
	}
	request.open("GET", jsonURL, true);
	request.send();
}

function go(query) {
	$(".spin").show();
	$("p#results").hide();

	if (null == searchJSON)
		fetchSearchJSON(query)
	else
		searchQuery(query)
}

function press(e) {
	var key = e.keyCode || e.which;
	if (13 == key) {
		var query = $("input#query").val();
		if ("" != query)
			go(query)
	}
}