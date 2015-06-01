/* Initialize Parse */
function initParse() {
    Parse.initialize(
            "C1vSKr7qozzQJbvpdwgirOAnFegdiBA4ATzsMIts", 
            "z9OYp348kGoWdYpHOu1thm2D8897Q7ub7aDB67Mx");

    Parse.FacebookUtils.init({ // this line replaces FB.init({
        appId      : '972944139424994', // Facebook App ID
        status     : true,  // check Facebook Login status
        cookie     : true,  // enable cookies to allow Parse to access the session
        xfbml      : true,  // initialize Facebook social plugins on the page
        version    : 'v2.2' // point to the latest Facebook Graph API version
    });
}

function logout() {
    Parse.User.logOut();
    window.location.href = "index.html";
}
