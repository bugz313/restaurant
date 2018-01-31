/** 
 * Check to see if the user is logged in
 */

Template.welcome.helpers({
   	loggedIn:function(){
   		return Meteor.user();
   	}
});

Template.welcome.events({
	
})

Template.layout.events({
	'click .restlist':function(e){
		Router.go("restaurantList");
	},
	'click .menulist':function(e){
		Router.go("menuList");
	}
});

Template.layout.helpers({
	loggedIn: function() {
      return Meteor.user();
   }
})

Template.layout.created = function(){
	
}

Template.layout.rendered = function(){
	$("#mCont").css("padding","0px");
}

Meteor.startup(function() {
  if(Meteor.isServer){
    
  }
  
 if(Meteor.isClient){
      return SEO.config({
        title: 'instaMenu',
        meta: {
          'description': 'instaMenu este o aplicație creată cu gândul la clienții restaurantelor și a cafenelelor, ținând cont totodată să ușureze și să scurteze timpul de predare și preluare a comenzilor.'
        }
      });
    }
});