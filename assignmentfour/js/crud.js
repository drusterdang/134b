/* Globals */
var g2ozt = 0.032151;

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
        1
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
        1
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
        1
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
        1
    ]
}
];

/* Filters list of known items */
function getKnownItems(iType, mType) {
    var result = [];
    var i;
    for (i = 0; i < knownItems.length; i++) {
        var validIType = !iType || iType == knownItems[i].item;
        var validMType = !mType || mType == knownItems[i].metal;
        if (validIType && validMType) {
            result.push(knownItems[i]);
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
        wpu,
        picture,
        onsuccess,
        onerror) 
{
    /* We assume validity, allowing server to handle garbage */
    var item = new (Parse.Object.extend("Item"))();
    item.set("itype",  iType);
    item.set("mtype",  mType);
    item.set("name",   name);
    item.set("purchaseDate", purchaseDate);
    item.set("qty", qty);
    item.set("unitPrice", unitPrice);
    item.set("fineness", fineness);
    item.set("wpu", wpu);
    if (picture) { item.set("picture", picture); }
    item.set("createdBy", Parse.User.current());
    item.setACL(new Parse.ACL(Parse.User.current()));
    item.save(null, {
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
        filter,
        onsuccess,
        onerror)
{
    var query = new Parse.Query(Parse.Object.extend("Item"));
    query.equalTo("createdBy", Parse.User.current());
    if (filter) {
        filter(query);
    }
    query.limit(10);
    query.skip(page * 10);
    query.find({
        success: onsuccess,
        error: onerror
    })

}

/* TODO: Definite room for optimization */
function getTotalMetals(onsuccess, onerror) {
    var query = new Parse.Query(Parse.Object.extend("Item"));
    query.equalTo("createdBy", Parse.User.current());
    query.find({
        success: function(items) {
            var totals = [0, 0, 0];
            var i;
            for (i = 0; i < items.length; i++) {
                totals[items[i].get("mtype")] += items[i].get("wpu") * items[i].get("qty") * items[i].get("fineness") * g2ozt;
            }
            onsuccess(totals);
        },
        error: onerror
    });

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
        picture,
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
    item.set("picture", picture);
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
