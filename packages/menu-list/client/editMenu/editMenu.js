Template.editMenu.events({
	'click .addCategory':function(e){
		alertify.prompt("Introdu numele categoriei:", function(ans, val){
			if(ans){
				Meteor.call("addCatMenu", Session.get("curEditId"), val, function(err){
					if(err){
						console.log(err);
					}else{
						Errors_Notifications.throwNotification("Categoria a fost adaugata!");
					}
				})
			}
		});
	},
	'click .delCat':function(e){
		var id = e.currentTarget.id.slice(3);

		alertify.confirm("Esti sigur ca vrei sa stergi categoria?", function(resp){
			if(resp){
				Meteor.call("delCategory",id, function(err){
					if(err){
						console.log(err);
					}else{
						Errors_Notifications.throwNotification("Categoria a fost stearsa!");
					}
				})
			}
		})
	},
	'click .backMenus':function(e){
		Router.go("menuList");
	},
	'click .editCat':function(e){
		var id = e.currentTarget.id.slice(4);
		$(e.currentTarget).hide();
		$("#save"+id).show();
		$("#canc"+id).show();
		$("#newCatName"+id).show();
		$("#static"+id).hide();
	},
	'click .saveCat':function(e){
		var id = e.currentTarget.id.slice(4);
		$(e.currentTarget).hide();
		$("#edit"+id).show();
		$("#canc"+id).hide();
		$("#newCatName"+id).hide();
		$("#static"+id).show();
		Meteor.call("modifyCat", id, $("#newCatName"+id).val(), function(err){
			if(err){
				console.log(err);
			}else{
				Errors_Notifications.throwNotification("Categorie modificata!");
			}
		})
	},
	'click .cancelEdit':function(e){
		var id = e.currentTarget.id.slice(4);
		$(e.currentTarget).hide();
		$("#edit"+id).show();
		$("#newCatName"+id).hide();
		$("#save"+id).hide();
		$("#newCatName"+id).hide();
		$("#static"+id).show();
	}
})

Template.editMenu.rendered = function(){
	Session.set("curEditId", Router.current().params.id);
}

Template.editMenu.helpers({
	curRestName:function(){
		if(!Session.get("curEditId") || Session.get("curEditId") == "") return;
		return Restaurants.findOne({menuId:Session.get("curEditId")}).name;
	},
	menuCategories:function(){
		if(!Session.get("curEditId") || Session.get("curEditId") == "") return;
		return Categories.find({menuId:Session.get("curEditId")}, {sort:{name:1}});
	}
})