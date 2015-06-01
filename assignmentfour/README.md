===============================================================================
                             CSE134B Team #14
                               Bulliown - HW4
===============================================================================

# # # # # # # # # # # # # # # 
#      Application Use      #
# # # # # # # # # # # # # # #

Navigation:
	Start with index.html as the login/signup page through Facebook authentication or username login. All other pages are named
	as such:

	index.html - Login/signup page with demo
	main.html - Home page with Total Coin Value and graphs for all coins
	main-metal.html - Information particular to a specific metal type, contains a store of all coins/bars of that specific type
	edit.html - the update and create in our CRUD model, depending on if an object id is specified.
	view.html - View page that allows you to view details about a coin not shown in the main-metal page.
	
	In main, you are given an overview all all the metals and a very generalized description of the user’s inventory. Clicking on the looping arrow will cause the page to refresh. Additionally, clicking on the settings cogs icon will cause a logout prompt to pop up, which is cancellable. 

	Clicking on the AU (gold), AG (silver), or PT (platinum) boxes on the side nav will
	simply navigate you to the AU (gold) page, AG (silver) page, PT (platinum) page.
	From there, you can see the the value, price per time chart graph, and a collection of the amount of coins you added. Each coin has a image, item type, qty, weight, percentage, and a value. In the table of coins, you can navigate one page at a time. Page numbers are stored in the hash of the location so one can navigate to a particular page with a specific url. Furthermore, the search functionality allows one to filter out items, by typing a string that filters by whether the item’s name starts with the query. The actual search is triggered by hitting [Enter] after typing the query.
	
	When you click the plus sign in these pages, it will take you to the create page. The create page will be passed a hash specifying the type of item to start out with. Furthermore, it also determined the page the user will go back to if the user cancels. With that, the metal field is automatically selected when you go to the create page. The next thing to note is that with the name, when one starts typing, one will see a list of known items filtered by the types specified above. When one finishes typing the field, and it matches a known type, the fineness and denominations (wpu) will automatically be populated. Because there are multiple denominations, we simply chose the first one, but one can easily change that by editing as one would regularly the denominations and then have it autocomplete just as the names did. We decided to do an autocomplete text field because we figured that because we probably will not be able to fulfill getting all the known coins, allowing the user to modify and assisting the user when we have extra information without restricting the user's input was a crucial part. 

We did a lot of work displaying what was going on in the background with pop-up’s, which visually block the user from doing anything, although we have code that prevents critical operations from slamming into each other. Furthermore, these pop-up’s give us a means of providing information when an error has occurred. We feel the fact you can see the page slowly build as data comes in to be a plus, and it sort of confirms to the user that work is being done. Furthermore, the updates create immediate visual feedback when the user does an action, rather than assuming that the AJAX call will return quickly enough to seem contiguous with the action.


Responsive Design:
	The high-fidelity mock switches to mobile view when the screen size < 1000px.

# # # # # # # # # # # # # # # 
#   Cross-Platform Issues  #
# # # # # # # # # # # # # # #

Chrome Firefox, Safari, Internet explorer: No compatibility issues for the most part. One key compatibility issue we had was that our type dropdown for edit.html when adding a coin was not showing up. 

# # # # # # # # # # # # # # # 
#     Validation Issues     #
# # # # # # # # # # # # # # #	

HTML:
	All the HTML validation checked out so there was no problem there.

CSS:
	The errors in CCS validation were broken down into only two problems that exist as bugs by the CSS validator. Theres two being the ones below:

	Property fill Doesn't Exist:
		CSS3 validator doesn't recognize fill as a valid attribute, but
		as we tested it with Chrome, Firefox, Safari, and IE, we're willing
		to forgo solving of this validation flag to implement the fill 
		attribute. 

	Calc() parse errors:
		Anywhere we used calc() in our CSS, the CSS validator threw a parse
		error.

		Source Bugs: https://www.w3.org/Bugs/Public/show_bug.cgi?id=18913 



# # # # # # # # # # # # # # # 
#    Implementation Tech    #
# # # # # # # # # # # # # # #
HTML: HTML5 was mostly used with the additional use of IcoMoon for icons. 


SASS/CSS:
	We wrote all of our CSS using SASS that compiled into CSS. Utilizing SAAS for their variables (easier refactoring), nesting attributes, and mixins (avoid all prefixes) provided to us. 

    The SASS file is located in sass/style.scss.
    The CSS file is located in style/style.css.


Javascript:
- Parse.js: initializes parse and sets logout to index.html window 
- Chart.js: to create the graphs
- Crud.js: file containing all of our create, read, update, and delete code, as well as some helper functions related to that.
Combine.js: a javascript file that is the concatenation of a bunch of “global” javascript files
- Data.js: contains code for retrieving data hosted on other servers. Simply created to hide service details, but does not hide data details.
- Edit.js: javascript particular to the edit page.
- Helpers.js: Some string helpers for nice presentation.
- Index.js: javascript particular to index.html
- Main.js: javascript particular to main.html. The import functions for top navigation, side navigation, and footer for all the pages can be found in main.js and include loadTopNav(), loadTopNavPersist(), loadSideNav(selected), loadFooter().
- Metal-main.js: javascript particular to metal-main.html
- Jquery: minified, used by a lot of our dependencies
- Popup.js: Creates a popup, that is used throughout the application as a means of blocking user (visually) while providing info about why application is blocked
- Velocity.js: minified, Javascript animation for display animations on our site 
- View.js : a photo viewer, Jquery file 


