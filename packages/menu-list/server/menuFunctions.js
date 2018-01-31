Meteor.publish("allMenus", function(){
	return Menus.find();
});

Meteor.publish("allProducts", function(){
	return Products.find();
});

Meteor.publish("allCategories", function(){
	return Categories.find();
});

Meteor.methods({
	saveMenu:function(obj){
		obj["dateAdded"] = new Date();
		var myId = Menus.insert(obj)
		Restaurants.update({_id:obj["restaurantId"]}, {$set:{menuId:myId}});
	},
	addCatMenu:function(menuId, categoryName){
		var restId = Restaurants.findOne({menuId:menuId})._id;
		var orderIndex = Categories.find({restaurantId:restId}).count();
		Categories.insert({menuId:menuId, name:categoryName, restaurantId:restId, orderIndex:orderIndex});
	},
	delCategory:function(id){
		var cat = Categories.findOne({_id:id});
		var catTotal = Categories.find({restaurantId:cat.restaurantId}).count();
		for (var i = cat.orderIndex+1; i < catTotal+1; i++) {
			Categories.update({$and:[{orderIndex:i}, {restaurantId:cat.restaurantId}]}, {$set:{orderIndex:(i-1)}});
		};
		Categories.remove({_id:id});
	},
	saveProdus:function(obj){
		var restId = Restaurants.findOne({menuId:obj["menuId"]})._id;
		obj["restaurantId"] = restId;
		obj["dateAdded"] = new Date();
		var orderIndex = Products.find({categoryId:obj["categoryId"]}).count();
		obj["orderIndex"] = orderIndex;
		Products.insert(obj);
	},
	editProd:function(obj){
		var prod = Products.findOne({_id:obj["editId"]});
		var orderIndex = Products.find({categoryId:obj["categoryId"]}).count();

		Products.update({_id:obj["editId"]}, {$set:{name:obj["name"], price:obj["price"], description:obj["description"], quantity:obj["quantity"], categoryId:obj["categoryId"]}});
		if(prod.categoryId != obj["categoryId"]){
			Products.update({_id:obj["editId"]}, {$set:{orderIndex:orderIndex}});
		}
	},
	deleteProd:function(id){
		var prod = Products.findOne({_id:id});
		var prodTotal = Products.find({categoryId:prod.categoryId}).count();
		for (var i = prod.orderIndex+1; i < prodTotal+1; i++) {
			Products.update({$and:[{orderIndex:i}, {categoryId:prod.categoryId}]}, {$set:{orderIndex:(i-1)}});
		};
		Products.remove({_id:id});
	},
	modifyCat:function(id, name){
		Categories.update({_id:id}, {$set:{name:name}});
	}
})