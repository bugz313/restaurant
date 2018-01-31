var selectedTables = [];
var selectingTables = false;
var colors = ["191,62,255", "180,238,180", "255,246,143", "255,185,15", "238,64,0", "113,113,198", "173,216,230", "255,110,180", "139,10,80", "0,0,255","0,245,255"];


Template.restaurantInterface.helpers({
	loggedIn:function(){
		return Restaurants.find().count();
	},
	tables:function(){
		var query = Tables.find({}, {sort:{joined:-1, dateAdded:1}});
		query.observeChanges({
			changed:function(id, fields){
				if(!fields.list) return;
				if(fields.list.length == 0) return;
				var arr = Session.get("changedTables");
				if(arr.indexOf(id) == -1) arr.push(id);
				Session.set("changedTables", arr);
			}
		})
		return query;
	},
	hasTableNotif:function(){
		var arr = Session.get("changedTables");
		if(arr.indexOf(this._id) == -1) return false;
		return true;
	},
	categoryList:function(){
		return Categories.find({},{sort:{orderIndex:1}});
	},
	productsList:function(){
		return Products.find({categoryId:Session.get("cCatSel")}, {sort:{orderIndex:1}});
	},
	orderList:function(){
		return this.list;
	},
	productName:function(){
		return Products.findOne({_id:this.prod}).name;
	},
	quantityList:function(){
		return this.quantity;	
	},
	hasListProds:function(){
		if(!this.list) return 0;
		return this.list.length;
	},
	totalAmount:function(){
		var lista = this.list;
		if(!lista) return 0;
		var total = 0;
		for (var i = 0; i < lista.length; i++) {
			total +=  parseFloat(Products.findOne({_id:lista[i].prod}).price) * parseInt(lista[i].quantity);
		}
		return total;
	},
	imSelected:function(){
		Session.get("selectedTab");
		if(selectedTables.indexOf(this._id) != -1){
			return "background-color:#4cae4c";
		}
		return "";
	},
	isJoined:function(){
		if(this.joined){
			if(colors.indexOf(this.groupColor) != -1){
				colors.splice(colors.indexOf(this.groupColor), 1);	
			}
			
			return true;	
		} 
		return false;
	},
	joinedDesc:function(){
		var tabs = this.joined;
		var str = "";

		for (var i = 0; i < tabs.length; i++) {
			str += Tables.findOne({_id:tabs[i]}).name+", ";
		}

		str = str.slice(0,-2);
		return str;
	},
	groupColor:function(){
		if(this.groupColor){
			return "background-color:rgba("+this.groupColor+",0.3);";
		}
		return "";
	},
	isActiveTab:function(val){
		if(Session.get("curActiveTab") == val){
			return "active";
		}
		return "";
	},
	productCount:function(){
		return Products.find({categoryId:this._id}).count();
	}
})

Template.restaurantInterface.events({
	'click .addTable':function(e){
		alertify.prompt("Introduceți numele mesei:", function(resp, value){
			if(resp){
				Meteor.call("addTable", Router.current().params.id, value, function(err){
					if(err){
						console.log(err);
					}else{
						Errors_Notifications.throwNotification("Masa a fost adăugată.")
					}
				})
			}
		})
	},
	'click .editTable':function(e){
		var id = e.currentTarget.id;
		var tableName = Tables.findOne({_id:id}).name;
		alertify.prompt("Introduceți un nume nou pentru masă:", function(resp, value){
			if(resp){
				Meteor.call("changeTableName", id, value, function(err){
					if(err){
						console.log(err);
					}else{
						Errors_Notifications.throwNotification("Numele mesei a fost schimbat");
					}
				})
			}
		}, tableName);
	},
	'click .delTable':function(e){
		var id= e.currentTarget.id.slice(3);
		var tableName = Tables.findOne({_id:id}).name;

		alertify.confirm("Sunteți sigur(ă) că vreți să ștergeți masa "+tableName, function(resp){
			if(resp){
				Meteor.call("deleteTable", id, function(err){
					if(err){
						console.log(err);
					}else{
						Errors_Notifications.throwNotification("Masa a fost ștearsă");
					}
				})
			}
		})
	},
	'click .downProd':function(e){
		var id=e.currentTarget.id.slice(4);

		Meteor.call("increaseOrderProd", id, function(err){
			if(err) console.log(err);
		})
	},
	'click .upProd':function(e){
		var id=e.currentTarget.id.slice(2);

		Meteor.call("decreaseOrderProd", id, function(err){
			if(err) console.log(err);
		})
	},
	'click .downCat':function(e){
		var id=e.currentTarget.id.slice(4);

		Meteor.call("increaseOrderCat", id, function(err){
			if(err) console.log(err);
		})
	},
	'click .upCat':function(e){
		var id=e.currentTarget.id.slice(2);

		Meteor.call("decreaseOrderCat", id, function(err){
			if(err) console.log(err);
		})
	},
	'click .delCat':function(e){
		var catName = Categories.findOne({_id:e.currentTarget.id.slice(3)}).name;
		var id = e.currentTarget.id.slice(3);

		alertify.confirm("Sunteți sigur că doriți să ștergeți categoria \""+catName+"\" și toate produsele din ea?", function(res){
			if(res){
				Meteor.call("delCategory", id, function(err){
					if(err){
						console.log(err);
					}else{
						Errors_Notifications.throwNotification("Categoria a fost ștearsă!");
						$("#categories")[0].selectedIndex = 0;
						$("#categories").change();
					}
				})
			}
		});
	},
	'click .editCat':function(e){
		var catName = Categories.findOne({_id:e.currentTarget.id}).name;
		var id = e.currentTarget.id;

		alertify.prompt("Introduceți o denumire nouă pentru categorie:", function(res, value){
			if(res){
				if(value.length < 3){
					Errors_Notifications.throwError("Vă rugăm să Introduceți o denumire mai lungă!");
					return;
				}
				Meteor.call("modifyCat", id, value, function(err){
					if(err){
						console.log(err);
					}else{
						Errors_Notifications.throwNotification("Categoria a fost modificată!");
					}
				})
			}
		}, catName)
	},
	'click .produseTab':function(e){
		Session.set("curActiveTab", e.currentTarget.id.slice(3));
	},
	'click .detachTable':function(e){
		Meteor.call("detachMe", e.currentTarget.id.slice(3), function(err, resp){
			if(err){
				console.log(err);
			}else{
				if(resp != "no"){
					colors.push(resp);
				}
			}
		})
	},
	'click .joinTables':function(e){
		$(".joinTables").hide();
		$(".finishJoin").show();
		$(".cancelJoin").show();
		selectingTables=true;
	},
	'click .finishJoin':function(e){
		$(".joinTables").show();
		$(".finishJoin").hide();
		$(".cancelJoin").hide();
		selectingTables=false;
		if(colors.length == 0){
			col = "255,255,255";
		}else{
			var col = colors.pop();	
		}
		
		Meteor.call("joinTables", selectedTables, col, function(err){
			if(err){
				console.log(err);
			}else{
				selectedTables = [];
				Session.set("selectedTab", Math.random());
				Errors_Notifications.throwNotification("Mesele au fost unite.");
			}
		})
	},
	'click .meseRow':function(e){
		var id = e.currentTarget.id.slice(5);
		var arr = Session.get("changedTables");
		arr.splice(arr.indexOf(id), 1);
		Session.set("changedTables", arr);

		if(!selectingTables) return;
		Session.set("selectedTab", Math.random());
		if(selectedTables.indexOf(id) == -1){
			selectedTables.push(id);
		}else{
			selectedTables.splice(selectedTables.indexOf(id), 1);
		}
	},
	'click .cancelJoin':function(e){
		selectedTables = [];
		selectingTables = false;
		$(".joinTables").show();
		$(".finishJoin").hide();
		$(".cancelJoin").hide();
		Session.set("selectedTab", Math.random());
	},
	'click .clearList':function(e){
		var tableid = e.currentTarget.id.slice(3);
		alertify.confirm("Lista mesei/meselor va fi golită! Sunteți sigur(ă)?", function(resp){
			if(resp){
				Meteor.call("clearListAchitat", tableid, function(err, resp){
					if(err){
						console.log(err);
					}else{
						if(resp != "no"){
							colors.push(resp);
						}
						var arr = Session.get("changedTables");
						arr.splice(arr.indexOf(tableid), 1);
						Session.set("changedTables", arr);
						Errors_Notifications.throwNotification("Lista mesei a fost golită.");
					}
				});
			}
		})
	},
	'click .addCat':function(e){
		alertify.prompt("Introduceți numele categoriei:", function(ans, value){
			if(ans){
				if(value.length > 0 && value.length < 40){
					Meteor.call("addCategory", value, Router.current().params.id, function(err, resp){
						if(err){
							console.log(err);
						}else{
							Errors_Notifications.throwNotification("Categorie adăugată!");
							Session.set("cCatSel", resp);
							$("#categories").val(resp);
						}
					})
				}else{
					Errors_Notifications.throwError("Numele categoriei trebuie să fie intre 1 și 40 de litere!");
				}
			}
		});
	},
	'click .addProd':function(e){
		Router.go("addProdusRestaurant");
	},
	'click .showList':function(e){
		$("#p"+e.currentTarget.id.slice(1)).show();
		$("#h"+e.currentTarget.id.slice(1)).show();
		$("#s"+e.currentTarget.id.slice(1)).hide();
	},
	'click .hideList':function(e){
		$("#p"+e.currentTarget.id.slice(1)).hide();
		$("#h"+e.currentTarget.id.slice(1)).hide();
		$("#s"+e.currentTarget.id.slice(1)).show();
	},
	'click .logInBtn':function(e){
		Meteor.subscribe("myInfo", Session.get("curRest"), $("#rest_pass").val());
		Meteor.subscribe("myMenu", Session.get("curRest"), $("#rest_pass").val());
		Meteor.subscribe("myProds", Session.get("curRest"), $("#rest_pass").val());
		Meteor.subscribe("myCats", Session.get("curRest"), $("#rest_pass").val());
		Meteor.subscribe("myTables", Session.get("curRest"), $("#rest_pass").val());
		var pasVal = $("#rest_pass").val();

		setTimeout(function(){
			if(Restaurants.find().count() == 0) {
				Errors_Notifications.throwError("Parola incorectă!");
			}else{
				Session.set("cCatSel", $("#categories").val());
				localStorage.setItem('dummyObj', pasVal);
			}
		}, 1000)
	},
	'keyup #rest_pass':function(e){
		if(e.keyCode == 13){
			Meteor.subscribe("myInfo", Session.get("curRest"), $("#rest_pass").val());
			Meteor.subscribe("myMenu", Session.get("curRest"), $("#rest_pass").val());
			Meteor.subscribe("myProds", Session.get("curRest"), $("#rest_pass").val());
			Meteor.subscribe("myCats", Session.get("curRest"), $("#rest_pass").val());
			Meteor.subscribe("myTables", Session.get("curRest"), $("#rest_pass").val());
			var pasVal = $("#rest_pass").val();

			setTimeout(function(){
				if(Restaurants.find().count() == 0) {
					Errors_Notifications.throwError("Parola incorectă!");
				}else{
					Session.set("cCatSel", $("#categories").val());
					localStorage.setItem('dummyObj', pasVal);
				}
			}, 1000)
		}
	},
	'change #categories':function(e){
		Session.set("cCatSel", e.currentTarget.value);
	},
	'click .editProd':function(e){
		var id=e.currentTarget.id;

		Router.go("editProdusRestaurant", {id:id});
	},
	'click .delProd':function(e){
		var id=e.currentTarget.id.slice(3);
		var prod = Products.findOne({_id:id}).name;

		alertify.confirm("Ștergeți produsul: "+prod, function(resp){
			if(resp){
				Meteor.call("deleteProduct", id, function(err){
					if(err){
						console.log(err);
					}else{
						Errors_Notifications.throwNotification("Produsul "+ prod + " a fost șters.");
					}
				})
			}
		});
	}
})

Template.restaurantInterface.rendered = function(){
	$('nav').hide();
	$("#mCont").css("padding", "0px");

	alertify.set({labels:{
		ok:"DA",
		cancel:"NU"
	},
	buttonReverse:true});
	alertify.set({ delay: 1000 });
}

Template.restaurantInterface.created = function(){
	Session.set("changedTables", []);
	Session.setDefault("curActiveTab", 'mese');
	Session.set("curRest", Router.current().params.id);
	if(localStorage.getItem('dummyObj')){
		var ls = localStorage.getItem('dummyObj');
		Meteor.subscribe("myInfo", Session.get("curRest"), ls);
		Meteor.subscribe("myMenu", Session.get("curRest"), ls);
		Meteor.subscribe("myProds", Session.get("curRest"), ls);
		Meteor.subscribe("myCats", Session.get("curRest"), ls);
		Meteor.subscribe("myTables", Session.get("curRest"), ls);
		setTimeout(function(){
			if(Session.get("cCatSel")){
				$("#categories").val(Session.get("cCatSel"));
			}else{
				Session.set("cCatSel", $("#categories").val());	
			}
			
		}, 1000)
	}
}