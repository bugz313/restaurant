Template.restaurantList.events({
	'click .createRest':function(e){
		Router.go("createRestaurant")
	},
	'click .createMenu':function(e){
		var id=e.currentTarget.id.slice(2);
		var obj = {};
		obj["restaurantId"] = id;
		
		Meteor.call("saveMenu", obj, function(err){
			if(err){
				console.log(err);
			}else{
				Errors_Notifications.throwNotification("Meniul a fost creat!");
				Router.go("menuList");
			}
		});
	}
})

Template.restaurantList.helpers({
	restaurants:function(){
		if(!Restaurants) return;
		return Restaurants.find({}, {sort:{dateAdded:-1}});
	},
	hasMenu:function(){
		return this.menuId;
	},
	productCount:function(){
		if(!Products) return;
		return Products.find({restaurantId:this._id}).count();
	}
})

Template.restaurantList.rendered = function(){
	Meteor.subscribe("allRestaurants");
	Meteor.subscribe("allProducts");
}