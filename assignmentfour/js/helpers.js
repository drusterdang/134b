/* Global Helpers */
function numberNicify(num) {
    var small = parseInt(num * 1000) % 1000;
    if (small < 0) {
        small *= -1;
    }
    small = small.toString();
    while (small.length < 3) {
        small = "0" + small;
    }
    var  big = parseInt(num);
    if (num < 0 && num > -1) {
        return "-" + big + "." + small;
    }
    return big + "." + small;
}

function numberPricify(num) {
    var small = parseInt(num * 100) % 100;
    if (small < 0) {
        small *= -1;
    }
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

function metalToString(mtype) {
    switch (mtype) {
        case MetalType.GOLD: return "gold";
        case MetalType.SILVER: return "silver";
        case MetalType.PLATINUM: return "platinum";
    }
    return null;
}

function metalInHash() {
    var hash = window.location.hash.substring(1); 
    var props = hash.split("&");
    var i;
    for (i = 0; i < props.length; i++) {
        var prop = props[i];
        var split = prop.indexOf("=");
        if (split > -1) {
            var propName = prop.substring(0, split);
            if (propName == "metal") {
                switch (prop.substring(split + 1)) {
                    case "gold": return MetalType.GOLD;
                    case "silver": return MetalType.SILVER;
                    case "platinum": return MetalType.PLATINUM;
                }
            }
        }
    }
    return -1;
}

function idInHash() {
    var hash = window.location.hash.substring(1); 
    var props = hash.split("&");
    var i;
    for (i = 0; i < props.length; i++) {
        var prop = props[i];
        var split = prop.indexOf("=");
        if (split > -1) {
            var propName = prop.substring(0, split);
            if (propName == "id") {
                return prop.substring(split + 1);
            }
        }
    }
}

function pageInHash() {
    var hash = window.location.hash.substring(1); 
    var props = hash.split("&");
    var i;
    for (i = 0; i < props.length; i++) {
        var prop = props[i];
        var split = prop.indexOf("=");
        if (split > -1) {
            var propName = prop.substring(0, split);
            if (propName == "page") {
                return parseInt(prop.substring(split + 1));
            }
        }
    }
    return 0;
}

function setPageInHash(page) {
    var hash = window.location.hash.substring(1); 
    var newHash = "#";
    var props = hash.split("&");
    var set = false;
    var i;
    for (i = 0; i < props.length; i++) {
        if (i) { newHash += "&"; }
        var prop = props[i];
        var split = prop.indexOf("=");
        if (split > -1) {
            var propName = prop.substring(0, split);
            if (propName == "page") {
                newHash += "page=" + page;
                set = true;
                continue;
            }
        }
        newHash += prop;
    }
    if (!set) {
        newHash += "&page=" + page;
    }
    window.location.hash = newHash;
}
