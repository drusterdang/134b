/* Constants */
var quandlAuthToken = "C3HZx3Q9-W8qQUhDX-vJ" // provides unlimited data access to quandl
var backTime = 30;

/* Function that access quandl's gold data */
function getGoldData(onsuccess) {
    var date = new Date();
    date.setDate(date.getDate() - backTime); // sets date back 30 days
    var startDate =  "trim_start=" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(); //date filter
    var authCode = "auth_token=" + quandlAuthToken;
    var route = "http://www.quandl.com/api/v1/datasets/WSJ/AU_EIB.json?" + authCode + "&" + startDate;
    $.getJSON(route, onsuccess);
}

/* Function that access quandl's silver data */
function getSilverData(onsuccess) {
    var date = new Date();
    date.setDate(date.getDate() - backTime); // sets date back 30 days
    var startDate =  "trim_start=" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(); //date filter
    var authCode = "auth_token=" + quandlAuthToken;
    var route = "http://www.quandl.com/api/v1/datasets/WSJ/AG_EIB.json?" + authCode + "&" + startDate;
    $.getJSON(route, onsuccess);
}

/* Function that access quandl's platinum data */
function getPlatinumData(onsuccess) {
    var date = new Date();
    date.setDate(date.getDate() - backTime); // sets date back 30 days
    var startDate =  "trim_start=" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(); //date filter
    var authCode = "auth_token=" + quandlAuthToken;
    var route = "http://www.quandl.com/api/v1/datasets/WSJ/PL_MKT.json?" + authCode + "&" + startDate;
    $.getJSON(route, onsuccess);
}

/* Function that access third-party spot data */
function getSpotData(onsuccess, onerror) {
    $.getJSON("https://cse134b.herokuapp.com/jm", onsuccess, onerror);
}

