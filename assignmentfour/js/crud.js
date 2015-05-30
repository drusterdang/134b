/* Pseudo-Enums */
var ItemType  = Object.freeze({
    COIN        : "coin",
    BAR         : "bar"
});

var MetalType = Object.freeze({
    GOLD        : "gold",
    SILVER      : "silver",
    PLATINUM    : "platinum"
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
    for (var i in knownItems) {
        var validIType = !iType || iType == i.item;
        var validMType = !mType || mType == i.metal;
        if (validIType && validMType) {
            result.push(i);
        }
    }
    return result;
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
        denomination,
        onsuccess,
        onerror) 
{
    /* We assume validity, allowing server to handle garbage */
    var parseItem = new Parse.Object.extend("Item");
    parseItem.set("itype",  iType);
    parseItem.set("mtype",  mType);
    parseItem.set("name",   name);
    parseItem.set("purchaseDate", purchaseDate);
    parseItem.set("qty", qty);
    parseItem.set("unitPrice", unitPrice);
    parseItem.set("fineness", fineness);
    parseItem.set("denomination", denomination);
    coin.save(null, {
        success: onsuccess,
        error: onerror
    });
}

/* Read */

/* Update */

/* Delete */
