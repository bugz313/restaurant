Template.addProdus.rendered = function(){
	Session.set("curAddProdusId", Router.current().params.id);
	Session.set("curCatSelected", $("#catId").val());
}

Template.addProdus.events({
	'change #catId':function(e){
		Session.set("curCatSelected", e.currentTarget.value);
	},
	'click .saveProd':function(e){
		var obj = {};
		obj["menuId"] = Session.get("curAddProdusId");
		obj["categoryId"] = $("#catId").val();
		obj["name"] = $("#product_name").val();
		obj["price"] = $("#product_price").val();
		obj["description"] = $("#descriere_produs").val();
		obj["quantity"] = $("#product_quantity").val();

		if(Session.get("editingProd") && Session.get("editingProd") != ""){
			alertify.confirm("Modifica date produs?", function(resp){
				if(resp){
					obj["editId"] = Session.get("editingProd");
					Meteor.call("editProd", obj, function(err){
						if(err){
							console.log(err);
						}else
						{
							Session.set("editingProd", "");
							Errors_Notifications.throwNotification("Produs modificat!");
							$("#product_name").val("");
							$("#product_price").val("");
							$("#product_quantity").val("");
							$("#descriere_produs").val("");
							
						}
					})
				}
			});	

			return;
		}

		Meteor.call("saveProdus", obj, function(err){
			if(err){
				console.log(err);
			}else{
				Errors_Notifications.throwNotification("Produs salvat!");
				$("#product_name").val("");
				$("#product_price").val("");
				$("#product_quantity").val("");
				$("#descriere_produs").val("");
			}
		} )
	},
	'click .delProd':function(e){
		var id = e.currentTarget.id.slice(3);
		alertify.confirm("Esti sigur ca vrei sa stergi produsul?", function(resp){
			if(resp){
				Meteor.call("deleteProd", id, function(err){
					if(err){
						console.log(err);
					}else{
						Errors_Notifications.throwNotification("Produs sters!");
					}
				})
			}
		})
	},
	'click .editProd':function(e){
		Session.set("editingProd", e.currentTarget.id.slice(4));
		var prodInfo = Products.findOne({_id:e.currentTarget.id.slice(4)});
		$("#product_name").val(prodInfo.name);
		$("#product_price").val(prodInfo.price);
		$("#descriere_produs").val(prodInfo.description);
		$("#product_quantity").val(prodInfo.quantity);
		$("#catId").val(prodInfo.categoryId);
	},
	'click .cancelEdit':function(e){
		alertify.confirm("Anulati modificarile?", function(resp){
			if(resp){
				$("#product_name").val("");
				$("#product_price").val("");
				$("#product_quantity").val("");
				$("#descriere_produs").val("");
				Session.set("editingProd", "");
			}
		})
	}
})

Template.addProdus.helpers({
	categoriesList:function(){
		return Categories.find({menuId:Session.get("curAddProdusId")});
	},
	produseCat:function(){
		return Products.find({$and:[{menuId:Session.get("curAddProdusId")}, {categoryId:Session.get("curCatSelected")}]});
	},
	isEditing:function(){
		if(Session.get("editingProd") && Session.get("editingProd") != ""){
			return true;
		}
		return false;
	}
})