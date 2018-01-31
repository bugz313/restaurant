/** 
 * Iron Router configuration 
 */

Router.configure({
   layoutTemplate: 'layout',
   loadingTemplate: 'loading', 
   notFoundTemplate: 'notFound',
   progressSpinner: false,
   progressDelay : false

});

Router.onBeforeAction(function() {
	var flag=false;
	if (! Meteor.userId()) {
    	this.render('welcome');
    	return;
  	} else {
  		if(!Meteor.userId()){
  			this.render('welcome');
    		return;
  		}
  	}
    this.next();
}, {except:['/', 'restaurantInterface', 'editProdusRestaurant', 'menuView', 'addProdusRestaurant', 'menuViewSimple']});


/**  define new route when url is "/"  */

/**  define route for "Not found page" page */
Router.route('/not_found', {name: 'notFound'});
Router.route('/forgot-password/:id', {name: 'forgotPassword'});
Router.route('/', {name: 'welcome'});