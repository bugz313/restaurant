Template.menuList.events({
	'click .createMenu':function(e){
		Router.go("createMenu")
	},
	'click .editMenu':function(e){
		var id = e.currentTarget.id.slice(3);
		Router.go("editMenu", {id:id});
	},
	'click .addProd':function(e){
		var id = e.currentTarget.id.slice(4);
		Router.go("addProdus", {id:id});
	}
})

Template.menuList.helpers({
	menus:function(){
		return Menus.find({}, {sort:{dateAdded:-1}});
	},
	restaurantName:function(){
		if(!Restaurants.findOne({_id:this.restaurantId})) return "";
		return Restaurants.findOne({_id:this.restaurantId}).name;
	},
	productCount:function(){
		return Products.find({menuId:this._id}).count();
	},
	categoryCount:function(){
		return Categories.find({restaurantId:this.restaurantId}).count();
	}
})

Template.menuList.rendered = function(){
	Meteor.subscribe("allMenus");
	Meteor.subscribe("allRestaurants");
	Meteor.subscribe("allProducts");
	Meteor.subscribe("allCategories");
}