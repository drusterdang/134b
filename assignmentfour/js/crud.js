/* Pseudo-Enums */
var ItemType  = Object.freeze({
    COIN        : 0,
    BAR         : 1
});

var MetalType = Object.freeze({
    GOLD        : 0,
    SILVER      : 1,
    PLATINUM    : 2
});

/* Initialize Parse */
function initParse() {
    Parse.initialize(
            "C1vSKr7qozzQJbvpdwgirOAnFegdiBA4ATzsMIts", 
            "z9OYp348kGoWdYpHOu1thm2D8897Q7ub7aDB67Mx");
}

/* Temporary Functions (Until next project) */
var knownItems = [
    /* Gold Coins */
    {
        item: ItemType.COIN,     
        metal: MetalType.GOLD,     
        name: "AUS Gold Nugget",
        fineness: 0.9999,
        denominations: [ 
            1/20,
            1/10,
            1/4,
            1/2,
            1,
            2,
            10
        ]
    },
    {
        item: ItemType.COIN,
        metal: MetalType.GOLD,
        name: "CHN Gold Panda",
        fineness: 0.999, 
        denominations: [
            1/20,
            1/10,
            1/4,
            1/2,
            1,
        ]
    },
    {
        item: ItemType.COIN,
        metal: MetalType.GOLD,
        name: "US Gold Eagle",
        fineness: 0.916,
        denominations: [ 
            1/10,
            1/4,
            1/2,
            1,
        ]
    },
    /* Silver Coins */
    {
        item: ItemType.COIN,
        metal: MetalType.SILVER,
        name: "AUS Silver Koala",
        fineness: 0.999,
        denominations: [
            1/2,
            1,
            10
        ]
    },
    {
        item: ItemType.COIN,
        metal: MetalType.SILVER,
        name: "CHN Lunar",
        fineness: 0.999,
        denominations: [ 1 ]
    },
    {
        item: ItemType.COIN,
        metal: MetalType.SILVER,
        name: "US Silver Eagle",
        fineness: 0.999,
        denominations: [ 1 ]
    },
    /* Platinum Coins */
    {
        item: ItemType.COIN,
        metal: MetalType.PLATINUM,
        name: "AUS Platinum Koala",
        fineness: 0.9995,
        denominations: [
            1/20,
            1/10,
            1/4,
            1/2,
            1,
        ]
    },
    {
        item: ItemType.COIN,
        metal: MetalType.PLATINUM,
        name: "US Platinum Eagle",
        fineness: 0.9995,
        denominations: [
            1/10,
            1/4,
            1/2,
            1,
        ]
    }
];

/* Filters list of known items */
function getKnownItems(iType, mType) {
    var result = [];
    for (var i = 0; i < knownItems.length; i++) {
        var validIType = !iType || iType == knownItems[i].item;
        var validMType = !mType || mType == knownItems[i].metal;
        if (validIType && validMType) {
            result.push(knownItems[i]);
        }
    }
    return result;
}

function getGoldPrice() {
    return 100;
}

function getSilverPrice() {
    return 80;
}

function getPlatinumPrice() {
    return 120;
}

/* CRUD Implementation */

/* Create */
function createItem(
        iType, 
        mType, 
        name,
        purchaseDate, 
        qty, 
        unitPrice,
        fineness,
        wpu,
        onsuccess,
        onerror) 
{
    /* We assume validity, allowing server to handle garbage */
    var parseItem = new (Parse.Object.extend("Item"))();
    parseItem.set("itype",  iType);
    parseItem.set("mtype",  mType);
    parseItem.set("name",   name);
    parseItem.set("purchaseDate", purchaseDate);
    parseItem.set("qty", qty);
    parseItem.set("unitPrice", unitPrice);
    parseItem.set("fineness", fineness);
    parseItem.set("wpu", wpu);
    parseItem.set("createdBy", Parse.User.current());
    item.setACL(new Parse.ACL(Parse.User.current()));
    parseItem.save(null, {
        success: onsuccess,
        error: onerror
    });
}

/* Read */
function readItem(
        objectId,
        onsuccess,
        onerror
        )
{
    var query = new Parse.Query(Parse.Object.extend("Item"));
    query.get(objectId, {
        success: onsuccess,
        error: onerror
    });
}

function readAllItems(
        page,
        filters,
        onsuccess,
        onerror)
{
    var query = new ParseQuery(Parse.Object.extend("Item"));
    if (filters) {
        filters(query);
    }
    query.limit(10);
    query.skip(page * 10);
    query.equalTo("createdBy", Parse.User.current());
    query.find({
        success: onsuccess,
        error: onerror
    })

}

/* Update */
function updateItem(
        item,
        iType, 
        mType, 
        name,
        purchaseDate, 
        qty, 
        unitPrice,
        fineness,
        wpu,
        onsuccess,
        onerror) 
{
    item.set("itype",  iType);
    item.set("mtype",  mType);
    item.set("name",   name);
    item.set("purchaseDate", purchaseDate);
    item.set("qty", qty);
    item.set("unitPrice", unitPrice);
    item.set("fineness", fineness);
    item.set("wpu", wpu);
    item.save(null, {
        success: onsuccess,
        error: onerror
    });
}

/* Delete */
function deleteItem(
        item,
        onsuccess,
        onerror)
{
    item.destroy({
        success: onsuccess,
        error: onerror
    });
}

/* Global Helpers */
function numberNicify(num) {
    var small = parseInt(num * 1000) % 1000;
    if (small < 0)
        small *= -1;
    small = small.toString();
    while (small.length < 3) {
        small = "0" + small;
    }
    var  big = parseInt(num);
    return big + "." + small;
}

function numberPricify(num) {
    var small = parseInt(num * 100) % 100;
    if (small < 0)
        small *= -1;
    small = small.toString();
    while (small.length < 2) {
        small = "0" + small;
    }
    var  big = parseInt(num);
    return "$" + big + "." + small;
}

function dateNicify(date) {
    return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear();
}
