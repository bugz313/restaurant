Template.menuViewSimple.helpers({
	viewingCategories:function(){
		return Session.get("currentView") == "categories";
	},
	viewingProducts:function(){
		return Session.get("currentView") == "products";
	},
	categories:function(){
		return Categories.find({},{sort:{orderIndex:1}});
	},
	produse:function(){
		return Products.find({categoryId:Session.get("curCategorie")}, {sort:{orderIndex:1}});
	},
	currentCategoryName:function(){
		if(!Categories.findOne({_id:Session.get("curCategorie")})) return "";
		return Categories.findOne({_id:Session.get("curCategorie")}).name;
	}
});

Template.menuViewSimple.events({
	'click .categoryDiv':function(e){
		var cT = e.currentTarget;
		$(e.currentTarget).css("background-color", "#D13131");
		setTimeout(function(){
			$(cT).css("background-color", "#86B57B");
		}, 120)
		Session.set("curCategorie", e.currentTarget.id);
		localStorage.setItem('lastPage', "categories");
		Session.set("currentView", "products");
	},
	'click .backBtn':function(e){
		e.preventDefault();
		e.stopPropagation();
		Session.set("currentView", "categories");
		return false;
	}
})

Template.menuViewSimple.rendered = function(){
	Meteor.subscribe("restCatsSimple", Router.current().params.id);
	Meteor.subscribe("restProdsSimple", Router.current().params.id);
	Session.set("currentView", "categories");
	$('nav').hide();
	$("#mCont").css("padding", "0px");
}