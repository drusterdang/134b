/* Globals */
var popupBody;
var popupBackdrop;
var popupHeader;
var popupMain;

function initPopup() {
    var popup =
        "<div id='popup-backdrop'>" +
        "<div id='popup-body'>" +
        "<h2 id='popup-header'></h2>" +
        "<div id='popup-main'></div>" +
        "</div>" +
        "</div>";
    $("body").append(popup);
    popupBody = $("#popup-body");
    popupBackdrop = $("#popup-backdrop");
    popupHeader = $("#popup-header");
    popupMain = $("#popup-main");
}

function showPopup() {
  popupBackdrop.css("visibility", "visible");
  popupBackdrop.animate({
    opacity: 1.0
  }, 300);
}

function hidePopup() {
  popupBackdrop.css("visibility", "visible");
  popupBackdrop.animate({
    opacity: 0.0
  }, 300, function() {
    popupBackdrop.css("visibility", "hidden");
  });
}

function setPopupSize(width) {
    popupBody.css("width", width + "px");
    var twidth = popupBody.width();
    var theight = popupBody.width();
    popupBody.css("margin-top", parseInt(-twidth / 2) + "px");
    popupBody.css("margin-left", parseInt(-theight / 2) + "px");
}

function setPopupHeader(text) {
    popupHeader.text(text);
}

function setPopupMain(main) {
    popupMain.html(main);
}
