/* Constants */
var quandlAuthToken = "C3HZx3Q9-W8qQUhDX-vJ"
var backTime = 30;

function getGoldData(onsuccess) {
    var date = new Date();
    date.setDate(date.getDate() - backTime);
    var startDate =  "trim_start=" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(); //date filter
    var authCode = "auth_token=" + quandlAuthToken;
    var route = "http://www.quandl.com/api/v1/datasets/WSJ/AU_EIB.json?" + authCode + "&" + startDate;
    $.getJSON(route, onsuccess);
}

function getSilverData(onsuccess) {
    var date = new Date();
    date.setDate(date.getDate() - backTime);
    var startDate =  "trim_start=" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(); //date filter
    var authCode = "auth_token=" + quandlAuthToken;
    var route = "http://www.quandl.com/api/v1/datasets/WSJ/AG_EIB.json?" + authCode + "&" + startDate;
    $.getJSON(route, onsuccess);
}

function getPlatinumData(onsuccess) {
    var date = new Date();
    date.setDate(date.getDate() - backTime);
    var startDate =  "trim_start=" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(); //date filter
    var authCode = "auth_token=" + quandlAuthToken;
    var route = "http://www.quandl.com/api/v1/datasets/WSJ/PL_MKT.json?" + authCode + "&" + startDate;
    $.getJSON(route, onsuccess);
}

function getSpotData(onsuccess, onerror) {
    $.getJSON("https://cse134b.herokuapp.com/jm", onsuccess, onerror);
}

