Template.editProdusRestaurant.helpers({
	produsInfo:function(){
		return Products.findOne({_id:Session.get("curProdEditare")});
	},
	categoryList:function(){
		return Categories.find();
	},
	isMyCateogry:function(){
		var prod = Products.findOne({_id:Session.get("curProdEditare")});
		if(!prod) return "";
		if(this._id == prod.categoryId) return "selected";
	}
})

Template.editProdusRestaurant.events({
	'click .cancelEdit':function(e){
		alertify.confirm("Anulati modificarile?", function(resp){
			if(resp){
				Session.set("curProdEditare", "");
				Router.go("restaurantInterface", {id:Session.get("curRest")});
			}
		})
	},
	'click .saveProd':function(e){
		alertify.confirm("Sunteți sigur că vreți să modificați produsul?", function(resp){
			if(resp){
				if(makeChecks()){
					var obj = {};
					obj["editId"] = Session.get("curProdEditare");
					obj["name"] = $("#product_name").val();
					obj["categoryId"] = $("#newProdCat").val();
					obj["price"] = $("#product_price").val();
					obj["description"] = $("#descriere_produs").val();
					obj["quantity"] = $("#product_quantity").val();

					Meteor.call("editProd", obj, function(err){
						if(err){
							console.log(err);
						}else{
							Errors_Notifications.throwNotification("Produs modificat!");
							Router.go("restaurantInterface", {id:Session.get("curRest")});
						}
					})
				}
			}
		});
	}
})

Template.editProdusRestaurant.rendered = function(){
	Session.set("curProdEditare", Router.current().params.id);
	$('nav').hide();
	$("#mCont").css("padding", "0px");
}

function makeChecks(){
	
	if($("#product_name").val() == ""){
		Errors_Notifications.throwNotification("Numele produsului nu poate fi gol!");
		return false;
	}

	if($("#product_name").val().length > 100){
		Errors_Notifications.throwNotification("Numele produsului nu poate depași 100 de caractere!");
		return false;
	}

	if(isNaN($("#product_price").val())){
		Errors_Notifications.throwNotification('Prețul produsului e incorect! Folosiți doar cifre și punct pentru zecimale! ');
		return false;
	}

	return true;
}