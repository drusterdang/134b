/* Globals */
var currentViewItem = null;

var mediumType;
var metalType;
var typeName;
var purchaseDate;
var qty;
var unitPrice;
var fineness;
var wpu;

/* Hooks */
function cancel() {
    var metalType = metalInHash()
        if (metalType >= 0) {
            window.location.href = "metal-main.html#metal=" + metalToString(metalType);
        } else {
            window.location.href = "main.html";
        }
}

/* Updates */
function updateCalculatables() {
    var qtyVal = parseInt(qty.text());
    if (isNaN(qtyVal)) {
        qtyVal = 0;
    }
    var finenessVal = parseFloat(fineness.text());
    if (isNaN(finenessVal)) {
        finenessVal = 0;
    }
    var unitPriceVal = parseFloat(unitPrice.text());
    if (isNaN(unitPriceVal)) {
        unitPriceVal = 0;
    }
    var wpuVal = parseFloat(wpu.text());
    if (isNaN(wpuVal)) {
        wpuVal = 0;
    }
    var mcpo = 0;
    if (metalType.val() == MetalType.GOLD) {
        mcpo = getGoldPrice();
    }
    if (metalType.val() == MetalType.SILVER) {
        mcpo = getSilverPrice();
    }
    if (metalType.val() == MetalType.PLATINUM) {
        mcpo = getPlatinumPrice();
    }
    $("#mgpu").text(numberNicify(finenessVal * wpuVal));
    $("#mopu").text(numberNicify(finenessVal * wpuVal * g2ozt));
    $("#total-metal").text(numberNicify(qtyVal * finenessVal * wpuVal * g2ozt));
    $("#premium").text(numberPricify(qtyVal * (unitPriceVal - mcpo * finenessVal * wpuVal * g2ozt)));
    $("#total-cost").text(numberPricify(unitPriceVal * qtyVal));
}

/* Initializers */
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
    mediumType = $("#medium-type");
    metalType = $("#metal-type");
    typeName = $("#type-name");
    purchaseDate = $("#purchase-date");
    qty = $("#qty");
    unitPrice = $("#unit-price");
    fineness = $("#fineness");
    wpu = $("#wpu");
    var id = idInHash();
    if (id) {
        $("#delete").removeClass("hidden");
        $(".command-header").text("View Item");
        setPopupSize(400);
        setPopupHeader("Loading your data!");
        setPopupMain("");
        showPopup();
        readItem(id, 
                function (item) {
                    currentViewItem = item;
                    switch (currentViewItem.get("itype")) {
                        case ItemType.COIN: mediumType.text("Coin"); break;
                        case ItemType.BAR: mediumType.text("Bar"); break;
                    }
                    switch (currentViewItem.get("mtype")) {
                        case MetalType.GOLD: metalType.text("Gold"); break;
                        case MetalType.SILVER: metalType.text("Silver"); break;
                        case MetalType.PLATINUM: metalType.text("Platinum"); break;
                    }
                    typeName.text(currentViewItem.get("name"));
                    purchaseDate.text(dateNicify(currentViewItem.get("purchaseDate"))); 
                    qty.text(numberNicify(currentViewItem.get("qty"))); 
                    unitPrice.text(currentViewItem.get("unitPrice")); 
                    fineness.text(numberNicify(currentViewItem.get("fineness"))); 
                    wpu.text(numberNicify(currentViewItem.get("wpu"))); 
                    var mpicture = currentViewItem.get("picture");
                    if (mpicture) {
                        var newImg = "<img src='" + mpicture.url() +  "' alt='' />";
                        $(".img_box").html(newImg);
                    }
                    updateCalculatables();
                    hidePopup();
                },
                function (item, error) {
                    setPopupMain(
                            "<div class='popup-container'>" +
                            "<p>Failed to load data.</p>" + 
                            "<p>Got Error: " + error.message + "</p>" + 
                            "</div>" +
                            "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
                });
    } else {
        setPopupMain(
                "<div class='popup-container'>" +
                "<p>Failed to load data.</p>" + 
                "<p>Got Error: invalid object id</p>" + 
                "</div>" +
                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
    }
});
