function signupUser() {

    var user = new Parse.User();
    var username = $("#username").val();
    var password = $("#passwd").val();
    var confirmPasswd = $('#confirmPasswd').val();

    var email = $('#email').val();
    var confirmEmail = $('#confirmEmail').val();

    if(validateForm(username, password, confirmPasswd, email, confirmEmail)){
        user.set("username", username);
        user.set("password", password);
        user.set("email", email)
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
                        "<input type='button' class='popup-main-button' onclick='hidePopup(); window.location = \"index.html\"' value='Dismiss'/>");
            },
            error: function(user, error) {
                showError(error.message);
            }
        });
    }
}

/* Form Validation: Checks if form to see if input is valid. If yes, user sign up proceeds. If not, user is prompted with
 * an error message to fix their email.
 */
function validateForm(username, password, confirmPasswd, email, confirmEmail) {
    var regExpression = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    
    if(username == ""){
        showError("Invalid Username")
        return false;
    } else if(password != confirmPasswd){
        showError("Password fields do not match");
        return false;
    } else if(password == ""){
        showError("Password field is empty");
        return false;
    } else if(email == "" || !regExpression.test(email)){
        showError("Invalid Email");
        return false;
    } else if(email != confirmEmail){
        showError("Email fields do not match");
        return false;
    }

    return true;
}

function showError(err){
      setPopupHeader("Error!");
                setPopupMain(
                        "<div class='popup-container'>" +
                        "<p>Failed to signup.</p>" + 
                        "<p>Got Error: " + err + "</p>" + 
                        "</div>" +
                        "<input type='button' class='popup-main-button' onclick='hidePopup();' value='Dismiss'/>");
      showPopup();      
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
