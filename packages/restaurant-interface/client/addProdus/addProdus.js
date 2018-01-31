Template.addProdusRestaurant.events({
	'click .cancelEdit':function(e){
		alertify.confirm("Anulați adăugarea produsului?", function(resp){
			if(resp){
				Router.go("restaurantInterface", {id:Session.get("curRest")});
			}
		})
	},
	'click .saveProd':function(e){
		if(makeChecks()){
			var obj = {};
			obj["categoryId"] = $("#newProdCat").val();
			obj["restaurantId"] = Session.get("curRest");
			obj["name"] = $("#product_name").val();
			obj["price"] = $("#product_price").val();
			obj["description"] = $("#descriere_produs").val();
			obj["quantity"] = $("#product_quantity").val();
			Session.set("cCatSel", $("#newProdCat").val());

			Meteor.call("addProdRest", obj, function(err){
				if(err){
					console.log(err);
				}else{
					Errors_Notifications.throwNotification("Produs adăugat!");
					Router.go("restaurantInterface", {id:Session.get("curRest")});
				}
			})
		}
	}
})

Template.addProdusRestaurant.helpers({
	categoryList:function(){
		return Categories.find();
	}
})

Template.addProdusRestaurant.rendered = function(){
	$('nav').hide();
	$("#mCont").css("padding", "0px");
	$("#newProdCat").val(Session.get("cCatSel"))
}

function makeChecks(){
	
	var flag=true;

	if($("#product_name").val() == ""){
		Errors_Notifications.throwNotification("Numele produsului nu poate fi gol!");
		$("#product_name").css("border-color", "red");
		flag = false;
	}else{
		$("#product_name").css("border-color", "#ccc");
	}

	if($("#product_name").val().length > 100){
		Errors_Notifications.throwNotification("Numele produsului nu poate depăși 100 de caractere!");
		$("#product_name").css("border-color", "red");
		flag = false;
	}else{
		if(flag){
			$("#product_name").css("border-color", "#ccc");
		}
	}

	if($("#product_price").val() == ""){
		Errors_Notifications.throwNotification('Vă rugăm introduceți un preț!');
		$("#product_price").css("border-color", "red");
		flag = false;
	}else{
		$("#product_price").css("border-color", "#ccc");	
	}

	if(isNaN($("#product_price").val())){
		Errors_Notifications.throwNotification('Prețul produsului e incorect! Folosiți doar cifre și punct pentru zecimale!');
		$("#product_price").css("border-color", "red");
		flag = false;
	}else{
		if(flag)
		{
			$("#product_price").css("border-color", "#ccc");	
		}
	}

	return flag;
}