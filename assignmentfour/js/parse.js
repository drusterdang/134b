/* Initialize Parse */
function initParse() {
  Parse.initialize(
      "C1vSKr7qozzQJbvpdwgirOAnFegdiBA4ATzsMIts", 
      "z9OYp348kGoWdYpHOu1thm2D8897Q7ub7aDB67Mx");
}

function logout() {
    Parse.User.logOut();
    window.location.href = "index.html";
}
