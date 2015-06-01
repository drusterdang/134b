function signupUser() {
    var user = new Parse.User();
    var username = $("#username").val();
    var password = $("#passwd").val();
    user.set("username", username);
    user.set("password", password);
    setPopupHeader("Signing You Up!");
    setPopupMain("");
    setPopupSize(400);
    showPopup();
    user.signUp(null, {
        success: function(user) {
            setPopupHeader("Awesome!");
            setPopupMain(
                    "<div class='popup-container'>" +
                    "<p>Successfully signed up new user.</p>" + 
                    "<p>Please login now.</p>" + 
                    "</div>" +
                    "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        },
        error: function(user, error) {
            setPopupHeader("Error!");
            setPopupMain(
                    "<div class='popup-container'>" +
                    "<p>Failed to signup.</p>" + 
                    "<p>Got Error: " + error.message + "</p>" + 
                    "</div>" +
                    "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        }
    });
}

function loginUser() {
    var username = $("#username").val();
    var password = $("#passwd").val();
    setPopupHeader("Logging You In!");
    setPopupMain("");
    setPopupSize(400);
    showPopup();
    Parse.User.logIn(username, password, {
        success: function (user) {
            window.location.href = "main.html";
        },
        error: function (user, error) {
            setPopupHeader("Error!");
            setPopupMain(
                    "<div class='popup-container'>" +
                    "<p>Failed to login.</p>" + 
                    "<p>Got Error: " + error.message + "</p>" + 
                    "</div>" +
                    "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        }
    });
}

function loginUserFacebook() {
    setPopupHeader("Logging You In!");
    setPopupMain("");
    setPopupSize(400);
    showPopup();
    Parse.FacebookUtils.logIn(null, {
        success: function (user) {
            window.location.href = "main.html";
        },
        error: function (user, error) {
            setPopupHeader("Error!");
            setPopupMain(
                    "<div class='popup-container'>" +
                    "<p>Failed to login.</p>" + 
                    "<p>Got Error: " + error.message + "</p>" + 
                    "</div>" +
                    "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
        }
    });
}

$(document).ready(function() {
    initPopup();
});
