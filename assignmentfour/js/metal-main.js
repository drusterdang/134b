/* Mutexes */
var ajaxMutex  = false;
var metalDone  = true,
    spotDone   = true;

/* Globals */
var goldOzData, goldTotalData;
var silverOzData, silverTotalData;
var platOzData, platTotalData;
var goldAsk, goldBid, goldChange, goldOChange;
var silverAsk, silverBid, silverChange, silverOChange;
var platAsk, platBid, platChange, platOChange;

var goldTotal, silverTotal, platTotal;
var metalType;

var coinChart;
var searchbar;
var currentPage = 0;

/* Search bar and metal type filter */
function currentFilter(query) {
    query.equalTo("mtype", metalType);
    if (searchbar.val()) {
        query.startsWith("name", searchbar.val());
    }
}

var currentTableItems = [];
var nextTableItems = [];
var prevTableItems = [];

/* Hooks */
function prevPage() {
    if (currentPage > 0) {
        currentPage -= 1;
        updateLoaded();
    }
}

function nextPage() {
    currentPage += 1;
    updateLoaded();
}

function viewItem(i) {
    var item = currentTableItems[i];
    if (item) {
        window.location.href = "view.html#metal=" + metalToString(metalType) + "&id=" + item.id;
    } else {
        alert("Invalid item to view");
    }
}

function editItem(i) {
    var item = currentTableItems[i];
    if (item) {
        window.location.href = "edit.html#metal=" + metalToString(metalType) + "&id=" + item.id;
    } else {
        window.location.href = "edit.html#metal=" + metalToString(metalType)
    }
}

function removeItem(i) {
    var item = currentTableItems[i];
    if (item) {
        if (!ajaxMutex) {
            ajaxMutex = true;
            /* Display popup to begin removal */
            setPopupHeader("Removing item!");
            setPopupMain("");
            showPopup();
            deleteItem(item, 
                    function (item) {
                        currentTableItems.splice(i, 1);
                        updateTable();
                        updateLoaded();
                        ajaxMutex = false;
                        /* Finish removal */
                        hidePopup();
                    },
                    function (item, error) {
                        ajaxMutex = false;
                        /* Error removal */
                        setPopupMain(
                                "<div class='popup-container'>" +
                                "<p>Failed to remove item.</p>" + 
                                "<p>Got Error: " + error.message + "</p>" + 
                                "</div>" +
                                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
                    });
        }
    }
}

/* Updates */

function updateTable() {
    var tbody = $(".my_stack tbody");
    tbody.empty();
    var i;
    for (i = 0; i < currentTableItems.length; i++) {
        var item = currentTableItems[i];
        var imgTag = "<div class='coin_mini'></div>";
        var mpicture = item.get("picture");
        if (mpicture) {
            imgTag = "<img src='" + mpicture.url() +  "' alt='' />";
        }
        var itemObject = 
            "<tr class='item'>" +
            "<td class='stack_img_col'>" + imgTag + "</div></td>" +
            "<td>" + 
            "<a onclick='viewItem(" + i + ");' style='white-space: nowrap;'>" + item.get("name") + "</a>" + 
            "<span class='controls'>" + 
            "<a onclick='editItem(" + i + ");'>Edit</a>" + 
            "<a onclick='removeItem(" + i + ");'>Delete</a>" + 
            "</span>" + 
            "</td>" +
            "<td>" + numberNicify(item.get("qty")) + "</td>" +
            "<td>" + numberNicify(item.get("wpu")) + "</td>" +
            "<td>" + numberNicify(item.get("fineness")) + "</td>" +
            "<td>" + numberPricify(item.get("qty") * item.get("wpu")) + "</td>" +
            "</tr>";
        tbody.append(itemObject);
    }
}

function updateLoaded() {
    if (!ajaxMutex) {
        ajaxMutex = true;
        /* Display popup to start update */
        setPopupHeader("Updating table!");
        setPopupMain("");
        showPopup();
        readAllItems(currentPage, currentFilter, 
                function (items) {
                    if (items.length <= 0) {
                        ajaxMutex = false;
                        prevPage();
                    } else {
                        currentTableItems = items;
                        updateTable();
                        setPageInHash(currentPage);
                        ajaxMutex = false;
                        /* Finish update */
                        hidePopup();
                    }
                },
                function (items, error) {
                    ajaxMutex = false;
                    /* Error on update */
                    setPopupMain(
                            "<div class='popup-container'>" +
                            "<p>Failed to update table.</p>" + 
                            "<p>Got Error: " + error.message + "</p>" + 
                            "</div>" +
                            "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
                });
    }
}

/* Loaders */

/* See main for more info */
function loadData() {
    setPopupSize(400);
    setPopupHeader("Loading your data!");
    setPopupMain("");
    showPopup();
    function buildGraph() {
        var milliPerDay = 3600 * 1000 * 24;
        var now = (new Date()).getTime();
        if (metalDone && spotDone) {
            metalDone = false;
            spotDone = false;
            function finishCallback() {
                if (metalDone && spotDone) {
                    goldTotalData = [];
                    silverTotalData = [];
                    platTotalData = [];
                    var i;
                    for (i = 0; i < 30; i++) {
                        switch (metalType) {
                            case MetalType.GOLD: goldTotalData[i] = goldTotal * goldOzData[i]; break;
                            case MetalType.SILVER: silverTotalData[i] = silverTotal * silverOzData[i]; break;
                            case MetalType.PLATINUM: platTotalData[i] = platTotal * platOzData[i]; break;
                        }
                    }
                    var bid;
                    var ask;
                    var change;
                    var ochange;
                    switch (metalType) {
                        case MetalType.GOLD: bid = goldBid; ask = goldAsk; change = goldChange; ochange = goldOChange; break;
                        case MetalType.SILVER: bid = silverBid; ask = silverAsk; change = silverChange; ochange = silverOChange; break;
                        case MetalType.PLATINUM: bid = platBid; ask = platAsk; change = platChange; ochange = platOChange; break;
                    }
                    $(".metal-bid").text(numberPricify(bid));
                    $(".metal-ask").text(numberPricify(ask));
                    var mMetalChange = $(".metal-change");
                    mMetalChange.text(numberNicify(change));
                    if (change > 0) {
                        mMetalChange.removeClass("neg-change");
                        mMetalChange.addClass("pos-change");
                    } else {
                        mMetalChange.removeClass("pos-change");
                        mMetalChange.addClass("neg-change");
                    }
                    var totalValue;
                    var totalChange;
                    switch (metalType) {
                        case MetalType.GOLD:  
                            totalValue = goldTotal * goldBid; 
                            break;
                        case MetalType.SILVER:
                            totalValue = silverTotal * silverBid; 
                            break;
                        case MetalType.PLATINUM:
                            totalValue = platTotal * platBid; 
                            break;
                    }
                    $(".total-dollars").text(numberPricify(totalValue));
                    var mTotalChange = $(".change");
                    mTotalChange.text(numberNicify(change) + "%");
                    if (change > 0) {
                        mTotalChange.removeClass("neg-change");
                        mTotalChange.addClass("pos-change");
                    } else {
                        mTotalChange.removeClass("pos-change");
                        mTotalChange.addClass("neg-change");
                    }
                    var mTotalOChange = $(".ochange");
                    mTotalOChange.text(numberNicify(ochange) + "%");
                    if (ochange > 0) {
                        mTotalOChange.removeClass("neg-change");
                        mTotalOChange.addClass("pos-change");
                    } else {
                        mTotalOChange.removeClass("pos-change");
                        mTotalOChange.addClass("neg-change");
                    }
                    loadGraph();
                    hidePopup();
                }
            }
            function fillGaps(data, len) {
                var paint = null;
                var i;
                for (i = 0; i < len; i++) {
                    if (data[i]) {
                        if (!paint) {
                            paint = data[i];
                            var j;
                            for (j = i - 1; j >= 0; j--) {
                                data[j] = paint;
                            }
                        } else {
                            paint = data[i];
                        }
                    }
                    data[i] = paint;
                }
            }
            switch (metalType) {
                case MetalType.GOLD:
                    getGoldData(function (json) {
                        goldOzData = [];
                        var i;
                        for (i = json.data.length - 1; i >= 0; i--) {
                            var dataDate = Date.parse(json.data[i][0]);
                            var idays = parseInt((now - Date.parse(json.data[i][0])) / milliPerDay);
                            if (idays < 30) {
                                goldOzData[idays] = parseFloat(json.data[i][1]);
                            }
                        }
                        fillGaps(goldOzData, 30);
                        metalDone = true;
                        finishCallback();
                    }); break;
                case MetalType.SILVER:
                    getSilverData(function (json) {
                        silverOzData = [];
                        for (i = json.data.length - 1; i >= 0; i--) {
                            var dataDate = Date.parse(json.data[i][0]);
                            var idays = parseInt((now - Date.parse(json.data[i][0])) / milliPerDay);
                            if (idays < 30) {
                                silverOzData[idays] = parseFloat(json.data[i][1]);
                            }
                        }
                        fillGaps(silverOzData, 30);
                        metalDone = true;
                        finishCallback();
                    });
                    break;
                case MetalType.PLATINUM:
                    getPlatinumData(function (json) {
                        platOzData = [];
                        var i;
                        for (i = json.data.length - 1; i >= 0; i--) {
                            var dataDate = Date.parse(json.data[i][0]);
                            var idays = parseInt((now - Date.parse(json.data[i][0])) / milliPerDay);
                            if (idays < 30) {
                                platOzData[idays] = parseFloat(json.data[i][1]);
                            }
                        }
                        fillGaps(platOzData, 30);
                        metalDone = true;
                        finishCallback();
                    });
                    break;
            }
            getSpotData(function (json) {
                goldAsk = json[0].ask;
                goldBid = json[0].bid;
                goldChange = json[0].oneDayPercentChange;
                goldOChange = json[0].fiftyTwoWeekPercentChange;
                silverAsk = json[1].ask;
                silverBid = json[1].bid;
                silverChange = json[1].oneDayPercentChange;
                silverOChange = json[1].fiftyTwoWeekPercentChange;
                platAsk = json[2].ask;
                platBid = json[2].bid;
                platChange = json[2].oneDayPercentChange;
                platOChange = json[2].fiftyTwoWeekPercentChange;
                spotDone = true;
                finishCallback();
            });
        }
    }
    getTotalMetals(
            function(totals) {
                goldTotal = totals[MetalType.GOLD];
                silverTotal = totals[MetalType.SILVER];
                platTotal = totals[MetalType.PLATINUM];
                buildGraph();
            }, 
            function (item, error) {
                setPopupHeader("Error!");
                setPopupMain(
                        "<div class='popup-container'>" +
                        "<p>Failed to load data.</p>" + 
                        "<p>Got Error: " + error.message + "</p>" + 
                        "</div>" +
                        "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
                goldDone = true;
                silverDone = true;
                platDone = true;
                spotDone = true;
            });
}

function loadGraph() {
    var options = {
        scaleShowGridLines : true,
        scaleGridLineColor : "rgba(104, 206, 222, 0.1)",
        scaleGridLineWidth : 1,
        scaleShowHorizontalLines: true,
        scaleShowVerticalLines: true,
        bezierCurve : true,
        bezierCurveTension : 0.4,
        pointDot : true,
        pointDotRadius : 4,
        pointDotStrokeWidth : 1,
        pointHitDetectionRadius : 20,
        datasetStroke : true,
        datasetStrokeWidth : 2,
        datasetFill : true,
        responsive: true,
        maintainAspectRatio: false
    };
    var labels = ["now"];
    var i;
    for (i = 1; i < 30; i++) {
        if(i == 1){
            labels.push(i + " day ago");
        } else{
            labels.push(i + " days ago");
        }
    }
    labels.reverse();
    var pointStroke = "rgba(255,255,255,0.6)";
    var pointHighlightFill = "#fff";
    var pointHighlightStroke = "#fff";
    var data = {
        labels: labels,
        datasets: [
        {
            label: "Gold Total",
            fillColor: "rgba(104, 206, 222, 0.05)",
            strokeColor: "#FF6D67",
            pointColor: "#FF6D67",
            pointStrokeColor: pointStroke,
            pointHighlightFill: pointHighlightFill,
            pointHighlightStroke: pointHighlightStroke,
            data: goldTotalData
        },
        {
            label: "Platinum Total",
            fillColor: "rgba(104, 206, 222, 0.05)",
            strokeColor: "#FFA859",
            pointColor: "#FFA859",
            pointStrokeColor: pointStroke,
            pointHighlightFill: pointHighlightFill,
            pointHighlightStroke: pointHighlightStroke,
            data: platTotalData
        },
        {
            label: "Silver Total",
            fillColor: "rgba(104, 206, 222, 0.05)",
            strokeColor: "#F3FF88",
            pointColor: "#F3FF88",
            pointStrokeColor: pointStroke,
            pointHighlightFill: pointHighlightFill,
            pointHighlightStroke: pointHighlightStroke,
            data: silverTotalData
        },
        {
            label: "1oz Gold",
            fillColor: "rgba(104, 206, 222, 0.05)",
            strokeColor: "#9FFF98",
            pointColor: "#9FFF98",
            pointStrokeColor: pointStroke,
            pointHighlightFill: pointHighlightFill,
            pointHighlightStroke: pointHighlightStroke,
            data: goldOzData
        },
        {
            label: "1oz Platinum",
            fillColor: "rgba(104, 206, 222, 0.05)",
            strokeColor: "#BBF5FF",
            pointColor: "#BBF5FF",
            pointStrokeColor: pointStroke,
            pointHighlightFill: pointHighlightFill,
            pointHighlightStroke: pointHighlightStroke,
            data: platOzData
        },
        {
            label: "1oz Silver",
            fillColor: "rgba(104, 206, 222, 0.05)",
            strokeColor: "#C29FFF",
            pointColor: "#C29FFF",
            pointStrokeColor: pointStroke,
            pointHighlightFill: pointHighlightFill,
            pointHighlightStroke: pointHighlightStroke,
            data: silverOzData
        }
        ]
    };
    var ctx = document.getElementById("total-chart").getContext("2d");
    coinChart = new Chart(ctx).Line(data, options);
}


/* Initializers */
function initTable() {
    updateLoaded();
    searchbar.keypress(function (e) {
        var kcode = e.keyCode ? e.keyCode : e.which;
        if (kcode == 13) {

            updateLoaded();
        }
    });
}

$(document).ready(function() {
    initPopup();
    if (!Parse.User.current()) {
        setPopupHeader("Error!");
        setPopupMain(
                "<div class='popup-container'>" +
                "<p>Must be logged into access page.</p>" + 
                "</div>" +
                "<input type='button' class='popup-main-button' onclick='logout();' value='Continue'/>");
        setPopupSize(300);
        showPopup();
        return;
    }
    currentPage = pageInHash();
    searchbar = $("#searchbar");
    metalType = metalInHash();
    if (metalType >= 0) {
        switch (metalType) {
            case MetalType.GOLD: 
                $(".metal-name").text("Gold"); 
                $("#legend-total").addClass("legend-1");
                $("#legend-oz").addClass("legend-4");
                break;
            case MetalType.SILVER: 
                $(".metal-name").text("Silver"); 
                $("#legend-total").addClass("legend-3");
                $("#legend-oz").addClass("legend-6");
                $("#legend-total").addClass("legend-2");
                $("#legend-oz").addClass("legend-5");
                break;
            case MetalType.PLATINUM: 
                $(".metal-name").text("Platinum"); 
                $("#legend-total").addClass("legend-2");
                $("#legend-oz").addClass("legend-5");
                break;
        }
        initTable();
    } else {
        alert("Invalid Metal Type!");
        return;
    }

    var path = window.location.pathname;
    var page = path.split("/").pop();

    $('.icon-spinner2').click(function(){
        location.reload();	
    });
    $('.icon-cog').click(function(){
        setPopupHeader("Settings");
        setPopupMain(
                "<input type='button' class='popup-main-button' onclick='logout();' value='Logout'/>" +
                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Cancel'/>" 
                );
        setPopupSize(400);
        showPopup();
    });
    $('tr').click(function(){
        $(this).find('a')[0].click();
    });

    $('.mtb-1').click(function(){
        $('.graph-panel').removeClass('graph-panel-show');
        $('.market-status').fadeIn(0);
        $('.market-list').fadeIn(0);
        if( page == "metal-main.html") {
            $('.my_stack').fadeIn(0);
        }
        $('.mtb-2').removeClass('mobile-toggle-selected');
        $('.mtb-1').addClass('mobile-toggle-selected');

    });

    $('.mtb-2').click(function(){
        $('.market-status').fadeOut(0);
        $('.market-list').fadeOut(0);
        if( page == "metal-main.html") {
            $('.my_stack').fadeOut(0);
        }
        $('.mtb-1').removeClass('mobile-toggle-selected');
        $('.mtb-2').addClass('mobile-toggle-selected');
        $('.graph-panel').addClass('graph-panel-show');
    });

    var resizer = function(){
        winWidth = $(window).width();
        winHeight = $(window).height();

        if (winWidth > 999) {
            $('.graph-panel').removeClass('graph-panel-show');
            $('.market-status').fadeIn(0);
            $('.market-list').fadeIn(0);
            if( page == "metal-main.html") {
                $('.my_stack').fadeIn(0);
            }
            $('.mtb-2').removeClass('mobile-toggle-selected');
            $('.mtb-1').addClass('mobile-toggle-selected');
        }
    };

    $(window).resize(resizer);
    loadData();
});

/* Force reload on tab change */
window.onhashchange = function() {
    if (metalType != metalInHash()) {
        window.location.reload();
    }
};
