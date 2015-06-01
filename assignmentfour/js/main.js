/* Mutexes */
var goldDone   = true, 
    silverDone = true, 
    platDone   = true, 
    spotDone   = true;

/* Globals */
var goldOzData, goldTotalData;
var silverOzData, silverTotalData;
var platOzData, platTotalData;
var goldAsk, goldBid, goldChange;
var silverAsk, silverBid, silverChange;
var platAsk, platBid, platChange;

var goldTotal, silverTotal, platTotal;

var coinChart;

/* Loaders */
function loadData() {
    /* Create loading popup */
    setPopupSize(400);
    setPopupHeader("Loading your data!");
    setPopupMain("");
    showPopup();

    /* Graph Builder */
    function buildGraph() {
        var milliPerDay = 3600 * 1000 * 24;
        var now = (new Date()).getTime();
        if (goldDone && silverDone && platDone && spotDone) {
            /* Setup Mutexes */
            goldDone = false;
            silverDone = false;
            platDone = false;
            spotDone = false;
            /* Process Finish Callback */
            function finishCallback() {
                if (goldDone && silverDone && platDone && spotDone) {
                    /* Reset data */
                    goldTotalData = [];
                    silverTotalData = [];
                    platTotalData = [];
                    /* Set Data w/ user totals */
                    var i;
                    for (i = 0; i < 30; i++) {
                        goldTotalData[i] = goldTotal * goldOzData[i];
                        silverTotalData[i] = silverTotal * silverOzData[i];
                        platTotalData[i] = platTotal * platOzData[i];
                    }
                    /* Set gold prices in view */
                    $(".gold-bid").text(numberPricify(goldBid)); // update gold bid via html manipulation
                    $(".gold-ask").text(numberPricify(goldAsk)); // update gold ask via html manipulation
                    var mGoldChange = $(".gold-change");
                    // check if styling should be changed based on the change's sign
                    mGoldChange.text(numberNicify(goldChange));
                    if (goldChange > 0) {
                        mGoldChange.removeClass("neg-change");
                        mGoldChange.addClass("pos-change");
                    } else {
                        mGoldChange.removeClass("pos-change");
                        mGoldChange.addClass("neg-change");
                    }
                    /* Set silver prices in view */
                    $(".silver-bid").text(numberPricify(silverBid)); // update silver bid via html manipulation
                    $(".silver-ask").text(numberPricify(silverAsk)); // update silver ask via html manipulation
                    // check if styling should be changed based on the change's sign
                    var mSilverChange = $(".silver-change");
                    mSilverChange.text(numberNicify(silverChange));
                    if (silverChange > 0) {
                        mSilverChange.removeClass("neg-change");
                        mSilverChange.addClass("pos-change");
                    } else {
                        mSilverChange.removeClass("pos-change");
                        mSilverChange.addClass("neg-change");
                    }
                    /* Set plat prices in view */
                    $(".plat-bid").text(numberPricify(platBid)); // update plat bid via html manipulation
                    $(".plat-ask").text(numberPricify(platAsk)); // update plat ask via html manipulation
                    // check if styling should be changed based on the change's sign
                    var mPlatChange = $(".plat-change");
                    mPlatChange.text(numberNicify(platChange));
                    if (platChange > 0) {
                        mPlatChange.removeClass("neg-change");
                        mPlatChange.addClass("pos-change");
                    } else {
                        mPlatChange.removeClass("pos-change");
                        mPlatChange.addClass("neg-change");
                    }
                    /* Set total value and change w/ user data */
                    var totalValue = goldTotal * goldBid + silverTotal * silverBid + platTotal * platBid;
                    var totalChange = (goldTotal * goldBid * goldChange + silverTotal * silverBid * silverChange + platTotal * platBid * platChange) / 100;
                    var totalPercentChange = totalChange / totalValue * 100;
                    $(".total-dollars").text(numberPricify(totalValue));
                    mTotalChange = $(".total-change");
                    mTotalChange.text(numberNicify(totalPercentChange) + "%");
                    if (totalPercentChange > 0) {
                        mTotalChange.removeClass("neg-change");
                        mTotalChange.addClass("pos-change");
                    } else {
                        mTotalChange.removeClass("neg-change");
                        mTotalChange.addClass("pos-change");
                    }
                    /* Trigger graph load */
                    loadGraph();
                    /* Finish loading */
                    hidePopup();
                }
            }
            /* Fill Gaps of Dates */
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
            /* Gold Data */
            getGoldData(function (json) {
                goldOzData = [];
                var i;
                //iterate through dates backwards
                for (i = json.data.length - 1; i >= 0; i--) {
                    //grab date
                    var dataDate = Date.parse(json.data[i][0]);
                    //determine how many days ago
                    var idays = parseInt((now - Date.parse(json.data[i][0])) / milliPerDay);
                    //save the data for the date if within 30 days
                    if (idays < 30) {
                        goldOzData[idays] = parseFloat(json.data[i][1]);
                    }
                }
                fillGaps(goldOzData, 30);
                goldDone = true;
                finishCallback();
            });
            /* Silver Data */
            getSilverData(function (json) {
                silverOzData = [];
                //iterate through dates backwards
                var i;
                for (i = json.data.length - 1; i >= 0; i--) {
                    //grab date
                    var dataDate = Date.parse(json.data[i][0]);
                    //determine how many days ago
                    var idays = parseInt((now - Date.parse(json.data[i][0])) / milliPerDay);
                    if (idays < 30) {
                        silverOzData[idays] = parseFloat(json.data[i][1]);
                    }
                }
                fillGaps(silverOzData, 30);
                silverDone = true;
                finishCallback();
            });
            /* Plat Data */
            getPlatinumData(function (json) {
                platOzData = [];
                // iterate through dates backwards
                var i;
                for (i = json.data.length - 1; i >= 0; i--) {
                    var dataDate = Date.parse(json.data[i][0]);
                    //determine how many days ago
                    var idays = parseInt((now - Date.parse(json.data[i][0])) / milliPerDay);
                    if (idays < 30) {
                        platOzData[idays] = parseFloat(json.data[i][1]);
                    }
                }
                fillGaps(platOzData, 30);
                platDone = true;
                finishCallback();
            });
            /* Spot Data */
            getSpotData(function (json) {
                goldAsk = json[0].ask;
                goldBid = json[0].bid;
                goldChange = json[0].oneDayPercentChange;
                silverAsk = json[1].ask;
                silverBid = json[1].bid;
                silverChange = json[1].oneDayPercentChange;
                platAsk = json[2].ask;
                platBid = json[2].bid;
                platChange = json[2].oneDayPercentChange;
                spotDone = true;
                finishCallback();
            });
        }
    }
    /* Main Trigger */
    getTotalMetals(
            function(totals) {
                goldTotal = totals[MetalType.GOLD];
                silverTotal = totals[MetalType.SILVER];
                platTotal = totals[MetalType.PLATINUM];
                buildGraph();
            }, 
            function (item, error) {
                /* Handle error with popup */
                setPopupHeader("Error!");
                setPopupMain(
                        "<div class='popup-container'>" +
                        "<p>Failed to load data.</p>" + 
                        "<p>Got Error: " + error.message + "</p>" + 
                        "</div>" +
                        "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
            });
}

/* Load Global Data into Graph */
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

/* Main */
$(document).ready(function() {
    initPopup();
    var path = window.location.pathname;
    var page = path.split("/").pop();
    
    /* Not logged in */
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

    /* Button setup */
    $('.icon-spinner2').click(function(){
        window.location.reload();	
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

        if (winWidth > 999){
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

    /* Trigger data load */
    loadData();
});
