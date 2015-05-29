# CSE 134b Spring 2015 - Team 14 - Alex Rodriguez, Hassan Shaikley, Scott Upton, Eugene Che, Andrew Dang

Our implementation issues
 - Firefox has this policy that doesn't allow (cross origin) glyphicons unless its a server that serves from the same host. Therefore, we used Bootstrap CDN to grab the glyphicons in order for our local css and html webpages to appear. In an actual application, we wouldn't need this because we can serve our bootstrap font files with a header that says that prevents this cross origin issue.
 - Adaptive sidebar (it made it more sense to have it on the top for responsive design for mobile and web). We solve this issue with duplicate navigation, but a better way would be javascript for restructure for later assignment. 
 - We had problems dealing with css column problems, but we restructure it accordingly by col-6 and col-sm-6 to have it be correct. 
 - One issue include the "date" input tag which is only supported in Google Chrome. We still kept it because the fallback, i.e. a regular input box is reasonable for the purposes of this application, and we feel the benefit of the date tag outweighs the potential incompatibility with other browsers.
 -We utilized a lot of divs (div-itus :-( ) but this is because of how bootstrap convention to use classes for everything. Furthermore, we utilized some of the "wrapper" classes for css attributes i.e. "text-center" but this is again because this is bootstrap convention. We are sure that when developing on our own framework, we will not succumb to div/class-itus.
 - We had an issue with the resolution of iphone's, but we fixed this with a "viewport" meta tag.

