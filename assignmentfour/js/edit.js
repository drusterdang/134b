/* Globals */
var ajaxMutex = false;
var g2ozt = 0.032151;

var currentEditItem = null;
var currentItemList = [];

var mediumType;
var metalType;
var typeName;
var purchaseDate;
var qty;
var unitPrice;
var fineness;
var wpu;
var picture;

var goldAsk, goldBid;
var silverAsk, silverBid;
var platAsk, platBid;

var knownTypes;
var denominations;

/* Hooks */
function cancel() {
    var metalType = metalInHash();
    if (metalType >= 0) {
        window.location.href = "metal-main.html#metal=" + metalToString(metalType);
    } else {
        window.location.href = "main.html";
    }
}

function submitItem() {
    var currentUser = Parse.User.current();
    if (!currentUser) {
        alert("Must be logged in!");
        return;
    }
    var fitype = parseInt(mediumType.val());
    var fmtype = parseInt(metalType.val());
    var fname = typeName.val();
    var fpurchaseDate = new Date(purchaseDate.val());
    var fqty = parseFloat(qty.val());
    var funitPrice = parseFloat(unitPrice.val());
    var ffineness = parseFloat(fineness.val());
    var fwpu = parseFloat(wpu.val());
    var fpicture;
    if (picture[0].files.length) {
        var file = picture[0].files[0];
        fpicture = new Parse.File(file.name, file);
    }
    if (isNaN(fitype)) {
        setPopupHeader("Error!");
        setPopupMain(
                "<div class='popup-container'>" +
                "<p>Failed to modify item.</p>" + 
                "<p> Invalid Medium Type</p>" + 
                "</div>" +
                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        showPopup();
        return;
    }
    if (isNaN(fmtype)) {
        setPopupHeader("Error!");
        setPopupMain(
                "<div class='popup-container'>" +
                "<p>Failed to modify item.</p>" + 
                "<p> Invalid Metal Type</p>" + 
                "</div>" +
                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        showPopup();
        return;
    }
    if (!fname) {
        setPopupHeader("Error!");
        setPopupMain(
                "<div class='popup-container'>" +
                "<p>Failed to modify item.</p>" + 
                "<p> Invalid Name</p>" + 
                "</div>" +
                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        showPopup();
        return;
    }
    if (isNaN(fpurchaseDate)) {
        setPopupHeader("Error!");
        setPopupMain(
                "<div class='popup-container'>" +
                "<p>Failed to modify item.</p>" + 
                "<p> Invalid Purchase Date</p>" + 
                "</div>" +
                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        showPopup();
        return;
    }
    if (isNaN(fqty)) {
        setPopupHeader("Error!");
        setPopupMain(
                "<div class='popup-container'>" +
                "<p>Failed to modify item.</p>" + 
                "<p> Invalid Quantity</p>" + 
                "</div>" +
                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        showPopup();
        return;
    }
    if (isNaN(funitPrice)) {
        setPopupHeader("Error!");
        setPopupMain(
                "<div class='popup-container'>" +
                "<p>Failed to modify item.</p>" + 
                "<p> Invalid Unit Price</p>" + 
                "</div>" +
                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        showPopup();
        return;
    }
    if (isNaN(ffineness)) {
        setPopupHeader("Error!");
        setPopupMain(
                "<div class='popup-container'>" +
                "<p>Failed to modify item.</p>" + 
                "<p> Invalid Fineness</p>" + 
                "</div>" +
                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        showPopup();
        return;
    }
    if (isNaN(fwpu)) {
        setPopupHeader("Error!");
        setPopupMain(
                "<div class='popup-container'>" +
                "<p>Failed to modify item.</p>" + 
                "<p> Invalid Weight per Unit</p>" + 
                "</div>" +
                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        showPopup();
        return;
    }
    if (currentEditItem) {
        if (!ajaxMutex) {
            ajaxMutex = true;
            setPopupSize(400);
            setPopupHeader("Updating item!");
            setPopupMain("");
            showPopup();
            updateItem(
                    currentEditItem,
                    fitype,
                    fmtype,
                    fname,
                    fpurchaseDate,
                    fqty,
                    funitPrice,
                    ffineness,
                    fwpu,
                    fpicture,
                    function(item) {
                        ajaxMutex = false;
                        hidePopup();
                    },
                    function(item, error) {
                        ajaxMutex = false;
                        setPopupMain(
                                "<div class='popup-container'>" +
                                "<p>Failed to update item.</p>" + 
                                "<p>Got Error: " + error.message + "</p>" + 
                                "</div>" +
                                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
                    });
        }
    } else {
        if (!ajaxMutex) {
            ajaxMutex = true;
            setPopupSize(400);
            setPopupHeader("Creating item!");
            setPopupMain("");
            showPopup();
            createItem(
                    fitype,
                    fmtype,
                    fname,
                    fpurchaseDate,
                    fqty,
                    funitPrice,
                    ffineness,
                    fwpu,
                    fpicture,
                    function(item) {
                        ajaxMutex = false;
                        setPopupHeader("Awesome!");
                        setPopupMain(
                                "<div class='popup-container'>" +
                                "<p>Successfully created item.</p>" + 
                                "</div>" +
                                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
                        cancel();
                    },
                    function(item, error) {
                        alert(error.message);
                        ajaxMutex = false;
                    });
        }
    }
}

function removeItem() {
    if (currentEditItem) {
        knownTypes = $("#known-types");
        if (!ajaxMutex) {
            ajaxMutex = true;
            setPopupSize(400);
            setPopupHeader("Removing item!");
            setPopupMain("");
            showPopup();
            deleteItem(currentEditItem, 
                    function (item) {
                        ajaxMutex = false;
                        hidePopup();
                        cancel();
                    },
                    function (item, error) {
                        setPopupMain(
                                "<div class='popup-container'>" +
                                "<p>Failed to remove item.</p>" + 
                                "<p>Got Error: " + error.message + "</p>" + 
                                "</div>" +
                                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
                        ajaxMutex = false;
                    });
        }
    }
}


/* Updates */
function updateTypeFilter() {
    currentItemList = getKnownItems(mediumType.val(), metalType.val());
    var typeOptions = "";
    var i;
    for (i = 0; i < currentItemList.length; i++) {
        typeOptions += "<option>" + currentItemList[i].name + "</option>";
    }
    knownTypes.html(typeOptions);
}

function updateAutocomplete() {
    var i;
    for (i = 0; i < currentItemList.length; i++) {
        var item = currentItemList[i];
        if (item.name == typeName.val()) {
            if (item.wpu) {
                wpu.val(item.wpu);
            }
            if (item.fineness) {
                fineness.val(item.fineness);
            }
            if (item.denominations) {
                var denomOptions = "";
                var j;
                for (j = 0; j < item.denominations.length; j++) {
                    denomOptions += "<option>" + numberNicify(item.denominations[j] / g2ozt) + "</option>";
                }
                denominations.html(denomOptions);
                if (!wpu.val() && item.denominations.length > 0) {
                    wpu.val(numberNicify(item.denominations[0] / g2ozt));
                }
            }
        }
    }
}

function updateCalculatables() {
    var qtyVal = parseInt(qty.val());
    if (isNaN(qtyVal)) {
        qtyVal = 0;
    }
    var finenessVal = parseFloat(fineness.val());
    if (isNaN(finenessVal)) {
        finenessVal = 0;
    }
    var unitPriceVal = parseFloat(unitPrice.val());
    if (isNaN(unitPriceVal)) {
        unitPriceVal = 0;
    }
    var wpuVal = parseFloat(wpu.val());
    if (isNaN(wpuVal)) {
        wpuVal = 0;
    }
    var mcpo = 0;
    if (metalType.val() == MetalType.GOLD) {
        mcpo = goldBid;
    }
    if (metalType.val() == MetalType.SILVER) {
        mcpo = silverBid;
    }
    if (metalType.val() == MetalType.PLATINUM) {
        mcpo = platBid;
    }
    $("#mgpu").text(numberNicify(finenessVal * wpuVal));
    $("#mopu").text(numberNicify(finenessVal * wpuVal * g2ozt));
    $("#total-metal").text(numberNicify(qtyVal * finenessVal * wpuVal * g2ozt));
    $("#premium").text(numberPricify(qtyVal * (unitPriceVal - mcpo * finenessVal * wpuVal * g2ozt)));
    $("#total-cost").text(numberPricify(unitPriceVal * qtyVal));
}

/* Loaders */
function loadHandlers() {
    mediumType.change(updateTypeFilter);
    metalType.change(updateTypeFilter);
    qty.focusout(function() {
        updateCalculatables();
    });
    unitPrice.focusout(function() {
        updateCalculatables();
    });
    fineness.focusout(function() {
        updateCalculatables();
    });
    wpu.focusout(function() {
        updateCalculatables();
    });
    typeName.focusout(function() {
        updateAutocomplete();
        updateCalculatables();
    });
    picture.change(function(e) {
        var files = picture[0].files;
        if (FileReader && files && files.length) {
            var fr = new FileReader();
            fr.onload = function () {
                var newImg = "<img src='" + fr.result +  "' alt='' />";
                $(".img_box").html(newImg);
            };
            fr.readAsDataURL(files[0]);
        }
    });
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
    picture = $("#picture");
    knownTypes = $("#known-types");
    denominations = $("#denominations");
    var mediumOptions = 
        "<option value='" + ItemType.COIN + "'>Coin</option>" + 
        "<option value='" + ItemType.BAR  + "'>Bar</option>";
    mediumType.html(mediumOptions);
    var metalOptions = 
        "<option value='" + MetalType.GOLD      + "'>Gold</option>" + 
        "<option value='" + MetalType.SILVER    + "'>Silver</option>" +
        "<option value='" + MetalType.PLATINUM  + "'>Platinum</option>";
    metalType.html(metalOptions);
    var id = idInHash();
    function buildView() {
        if (id) {
            $("#delete").removeClass("hidden");
            $(".command-header").text("Edit Item");
            ajaxMutex = true;

            setPopupSize(400);
            setPopupHeader("Loading your data!");
            setPopupMain("");
            showPopup();
            readItem(id, 
                    function (item) {
                        currentEditItem = item;
                        ajaxMutex = false;
                        mediumType.children()[currentEditItem.get("itype")].selected = true;
                        metalType.children()[currentEditItem.get("mtype")].selected = true;
                        updateTypeFilter();
                        typeName.val(currentEditItem.get("name"));
                        purchaseDate.val(dateNicify(currentEditItem.get("purchaseDate"))); 
                        qty.val(currentEditItem.get("qty")); 
                        unitPrice.val(currentEditItem.get("unitPrice")); 
                        fineness.val(currentEditItem.get("fineness")); 
                        wpu.val(currentEditItem.get("wpu")); 
                        var mpicture = currentEditItem.get("picture");
                        if (mpicture) {
                            var newImg = "<img src='" + mpicture.url() +  "' alt='' />";
                            $(".img_box").html(newImg);
                        }
                        loadHandlers();
                        updateCalculatables();
                        hidePopup();
                    },
                    function (item, error) {
                        alert(error.message);
                        ajaxMutex = false;
                        setPopupHeader("Error!");
                        setPopupMain(
                                "<div class='popup-container'>" +
                                "<p>Failed to load data.</p>" + 
                                "<p>Got Error: " + error.message + "</p>" + 
                                "</div>" +
                                "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
                    });
        } else {
            var theDate = new Date();
            var metal = metalInHash();
            if (metal >= 0) {
                metalType.children()[metal].selected = true;
            }
            purchaseDate.val(dateNicify(theDate));
            loadHandlers();
            updateTypeFilter();
            updateCalculatables();
            hidePopup();
        }
    }
    setPopupSize(400);
    setPopupHeader("Loading your data!");
    setPopupMain("");
    showPopup();
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
        buildView();
    });
});
