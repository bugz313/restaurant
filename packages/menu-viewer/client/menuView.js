myList = new Mongo.Collection(null);
var myListObserver = new PersistentMinimongo(myList);

Template.menuView.helpers({
	viewingCategories:function(){
		return Session.get("currentView") == "categories";
	},
	viewingProducts:function(){
		return Session.get("currentView") == "products";
	},
	viewingMyList:function(){
		return Session.get("currentView") == "myList";
	},
	viewingTableList:function(){
		return Session.get("currentView") == "tableList";
	},
	categories:function(){
		return Categories.find({},{sort:{orderIndex:1}});
	},
	produse:function(){
		return Products.find({categoryId:Session.get("curCategorie")}, {sort:{orderIndex:1}});
	},
	myListItems:function(){
		return myList.find();
	},
	prodName:function(){
		return Products.findOne({_id:this.prod}).name;
	},
	prodPrice:function(){
		return Products.findOne({_id:this.prod}).price;
	},
	prodName:function(){
		return Products.findOne({_id:this.prod}).name;
	},
	totalPrice:function(){
		return Products.findOne({_id:this.prod}).price * this.quantity;
	},
	tableItemsList:function(){
		return Tables.findOne({_id:Router.current().params.id}).list;
	},
	totalMyList:function(){
		var allMyItems = myList.find().fetch();
		var total = 0;

		for (var i = 0; i < allMyItems.length; i++) {
			total += parseFloat(Products.findOne({_id:allMyItems[i].prod}).price)*allMyItems[i].quantity;
		}

		return total;
	},
	totalTable:function(){
		var allMyItems = Tables.findOne({_id:Router.current().params.id}).list;
		var total = 0;

		for (var i = 0; i < allMyItems.length; i++) {
			total += parseFloat(Products.findOne({_id:allMyItems[i].prod}).price)*allMyItems[i].quantity;
		}

		return total;	
	},
	isSelected:function(page){
		if((Session.get("currentView") == "products" || Session.get("currentView") == "categories") && page == 'categories'){
			return "background-color:#D13131;";
		}
		if(page == Session.get("currentView")) {
			return "background-color:#D13131;";
		}else{
			return "background-color:#4CAF50;";
		}
	},
	hasProds:function(){
		return myList.find().count();
	},
	hasProdsTable:function(){
		if(!Tables.findOne({_id:Router.current().params.id})) return 0;
		return Tables.findOne({_id:Router.current().params.id}).list.length;
	},
	currentCategoryName:function(){
		if(!Categories.findOne({_id:Session.get("curCategorie")})) return "";
		return Categories.findOne({_id:Session.get("curCategorie")}).name;
	}
});

Template.menuView.events({
	'click .clearTable':function(e){
		alertify.confirm("Ștergeți toate produsele din lista mesei?", function(res){
			if(res){
				Meteor.call("clearListTable", Router.current().params.id, function(err){
					if(err){
						console.log(err);
					}else{

					}
				})
			}
		})

		$(".alertify-confirm").css("width", "100%");
		$(".alertify-confirm").css("left", "0");
		$(".alertify-confirm").css("font-size", "46px");
		$(".alertify-confirm").css("margin-left", "0px");
	},
	'click .addProdMyList':function(e){
		var id = e.currentTarget.id.slice(3);
		var quant = myList.findOne({prod:id}).quantity;

		Meteor.call("removeItemsFromList", Router.current().params.id, id, -1, function(err){
			if(err){
				console.log(err);
			}else{
				if("good"){
					myList.update({prod:id}, {$inc:{quantity:1}});
				}else{
					Errors_Notifications.throwNotification("Trebuie să fi logat la rețeaua wi-fi a localului!");
				}
				
			}
		})
	},
	'click .removeProdMyList':function(e){
		var id = e.currentTarget.id.slice(3);
		var quant = myList.findOne({prod:id}).quantity;

		Meteor.call("removeItemsFromList", Router.current().params.id, id, 1, function(err){
			if(err){
				console.log(err);
			}else{
				if("good"){
					myList.update({prod:id}, {$inc:{quantity:-1}});
					myList.remove({quantity:0});
				}else{
					Errors_Notifications.throwNotification("Trebuie să fi logat la rețeaua wi-fi a localului!");
				}
				
			}
		})
	},
	'click .clearMyListProduct':function(e){
		var id = e.currentTarget.id.slice(3);
		var quant = myList.findOne({prod:id}).quantity;

		Meteor.call("removeItemsFromList", Router.current().params.id, id, quant, function(err){
			if(err){
				console.log(err);
			}else{
				if("good"){
					myList.remove({prod:id});
				}else{
					Errors_Notifications.throwNotification("Trebuie să fi logat la rețeaua wi-fi a localului!");
				}
				
			}
		})
	},
	'click .myList':function(e){
		localStorage.setItem('lastPage', "myList");
		Session.set("currentView", "myList");
	},
	'click .tableList':function(e){
		localStorage.setItem('lastPage', "tableList");
		Session.set("currentView", "tableList");
	},
	'click .menu':function(e){
		localStorage.setItem('lastPage', "categories");
		Session.set("currentView", "categories");
	},
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
	},
	'click .produsDiv':function(e){
		var id = e.currentTarget.id.slice(4);
		var dup = myList.findOne({prod:id});
		
		Meteor.call("addProdusToList", Router.current().params.id, id, function(err, resp){
			if(err){
				console.log(err);
			}else{
				if(resp == "badip"){
					Errors_Notifications.throwNotification("Trebuie să fi logat la rețeaua wi-fi a localului!");
				}else{
					if(dup){
						myList.update({_id:dup._id}, {$inc:{quantity:1}});
					}else{
						myList.insert({prod:id, quantity:1});	
					}
					alertify.set({ delay: 800 });
					var prod = Products.findOne({_id:id});
					if(prod){
						Errors_Notifications.throwNotification("+1 "+ prod.name);
					}
					alertify.set({ delay: 2000 });
				}
			}
		});
	}
})

Template.menuView.rendered = function(){
	alertify.set({labels:{
		ok:"DA",
		cancel:"NU"
	},
	buttonReverse:true});
	Session.set("viewRestTable", Router.current().params.id);
	Meteor.subscribe("restCats", Router.current().params.id);
	Meteor.subscribe("restProds", Router.current().params.id);
	Meteor.subscribe("myTable", Router.current().params.id);
	var retrievedObject = localStorage.getItem('lastPage');
	if(!retrievedObject){
		Session.set("currentView", "categories");
	}else{
		Session.set("currentView", retrievedObject);
	}
	
	$('nav').hide();
	$("#mCont").css("padding", "0px");
	alertify.set({ delay: 2000 });
	Errors_Notifications.throwNotification("Dă click pe produse pentru a le adăuga în listă!");
	$(".alertify-logs").css("font-size", "40px");
	$(".alertify-logs").css("width", "70%");
	$(".alertify-log").css("border-radius", "15px");
	myListObserver.refresh();

	setInterval(updateMyList, 3000);
}


function updateMyList(){
	var listaMea = myList.find().fetch();
	var listaMesei = Tables.findOne({_id:Router.current().params.id}).list;
	var toRemove = [];

	for (var i = 0; i < listaMea.length; i++) {
		var result = listaMesei.filter(function(obj){
			return obj.prod == listaMea[i].prod;
		});
		if(result.length == 0){
			myList.remove({_id:listaMea[i]._id})
		}
	}
}