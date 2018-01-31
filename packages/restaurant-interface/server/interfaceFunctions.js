Meteor.publish("myUserStatus", function(restId){
	return UserStatus.find({restId:restId});
});

Meteor.publish("myInfo", function(id, pass){
	var usr = Restaurants.findOne({$and:[{pass:pass}, {_id:id}]});
	if(!usr) return [];
	Restaurants.update({$and:[{pass:pass}, {_id:id}]}, {$set:{IP:this.connection.clientAddress}})
	return Restaurants.find({$and:[{pass:pass}, {_id:id}]});
});

Meteor.publish("myMenu", function(id, pass){
	var usr = Restaurants.findOne({$and:[{pass:pass}, {_id:id}]});
	if(!usr) return [];

	return Menus.find({restaurantId:usr._id});
});

Meteor.publish("myCats", function(id, pass){
	var usr = Restaurants.findOne({$and:[{pass:pass}, {_id:id}]});
	if(!usr) return [];

	return Categories.find({restaurantId:usr._id});
});

Meteor.publish("myProds", function(id, pass){
	var usr = Restaurants.findOne({$and:[{pass:pass}, {_id:id}]});
	if(!usr) return [];

	return Products.find({restaurantId:usr._id});
})

Meteor.publish("myTables", function(id, pass){
	var usr = Restaurants.findOne({$and:[{pass:pass}, {_id:id}]});
	if(!usr) return [];

	return Tables.find({restaurantId:usr._id});
})

Meteor.methods({
	changeTableName:function(id, newName){
		Tables.update({_id:id}, {$set:{name:newName}});
	},
	addTable:function(restaurantId, name){
		var doc = {};
		doc["dateAdded"] = new Date();
		doc["name"] = name;
		doc["restaurantId"] = restaurantId;
		Tables.insert(doc);
	},
	deleteTable:function(tableId){
		Tables.remove({_id:tableId});
	},
	addCategory:function(catName, rest){
		var menuId = Menus.findOne({restaurantId:rest})._id;
		var orderIndex = Categories.find({restaurantId:rest}).count();
		var doc = {};
		doc["menuId"] = menuId;
		doc["restaurantId"] = rest;
		doc["name"] = catName;
		doc["orderIndex"] = orderIndex;
		var id = Categories.insert(doc);
		return id;
	},
	addProdRest:function(obj){
		var menuId = Menus.findOne({restaurantId:obj["restaurantId"]})._id;

		obj["menuId"] = menuId;
		obj["dateAdded"] = new Date();

		var orderIndex = Products.find({categoryId:obj["categoryId"]}).count();
		obj["orderIndex"] = orderIndex;

		Products.insert(obj);
	},
	clearListAchitat:function(tableId){
		var tab = Tables.findOne({_id:tableId});
		if(tab.joined){
			for (var i = 0; i < tab.joined.length; i++) {
				Tables.update({_id:tab.joined[i]}, {$set:{list:[]}});	
				Tables.update({_id:tab.joined[i]}, {$unset:{joined:"", groupColor:""}});	
			}
			return tab.groupColor;
		}else{
			Tables.update({_id:tableId}, {$set:{list:[]}});	
			return "no";
		}
	},
	joinTables:function(selectedTables, color){
		var joinedList = [];

		for (var k = 0; k < selectedTables.length; k++) {
			Tables.update({_id:selectedTables[k]}, {$set:{joined:selectedTables, groupColor:color}});
			if(k == 0){
				joinedList = Tables.findOne({_id:selectedTables[k]}).list;
				if(!joinedList) joinedList = [];
			}else{
				var tempList = Tables.findOne({_id:selectedTables[k]}).list;
				if(tempList){
					for (var i = 0; i < tempList.length; i++) {
						var result = joinedList.filter(function(obj){
							return obj.prod === tempList[i].prod;
						})
						if(result.length > 0){
							for (var j = 0; j < joinedList.length; j++) {
								if(joinedList[j].prod == tempList[i].prod){
									joinedList[j].quantity += parseInt(tempList[i].quantity); 
								}
							}
						}else{
							joinedList.push(tempList[i]);
						}
					}
				}
			}
		}

		Tables.update({_id:{$in:selectedTables}}, {$set:{list:joinedList}}, {multi:true});
	},
	detachMe:function(id){
		var joins = Tables.findOne({_id:id}).joined;
		var col = Tables.findOne({_id:id}).groupColor;
		if(joins.length == 2){
			for (var i = 0; i < joins.length; i++) {
				Tables.update({_id:joins[i]}, {$unset:{joined:"", groupColor:""}});
			}
			Tables.update({_id:id}, {$set:{list:[]}});
			return col;
			
		}else{
			joins.splice(joins.indexOf(id), 1);
			Tables.update({_id:{$in:joins}}, {$set:{joined:joins}}, {multi:true});
			Tables.update({_id:id}, {$unset:{joined:"", groupColor:""}});
		}
		Tables.update({_id:id}, {$set:{list:[]}});
		return "no";
	},
	deleteProduct:function(id){
		var prod = Products.findOne({_id:id});
		var prodTotal = Products.find({categoryId:prod.categoryId});
		for (var i = prod.orderIndex; i < prodTotal; i++) {
			Products.update({$and:[{orderIndex:i}, {categoryId:prod.categoryId}]}, {$inc:{orderIndex:-1}});
		};
		Products.remove({_id:id});
	},
	increaseOrderProd:function(id){
		var curProd = Products.findOne({_id:id});
		var targetOrder = curProd.orderIndex+1;
		var switcherProd = Products.findOne({$and:[{orderIndex:targetOrder}, {categoryId:curProd.categoryId}]});
		if(!switcherProd) return;
		Products.update({_id:id}, {$set:{orderIndex:targetOrder}});
		targetOrder--;
		Products.update({_id:switcherProd._id}, {$set:{orderIndex:targetOrder}});
	},
	decreaseOrderProd:function(id){
		var curProd = Products.findOne({_id:id});
		var targetOrder = curProd.orderIndex-1;
		var switcherProd = Products.findOne({$and:[{orderIndex:targetOrder}, {categoryId:curProd.categoryId}]});
		if(!switcherProd) return;
		Products.update({_id:id}, {$set:{orderIndex:targetOrder}});
		targetOrder++;
		Products.update({_id:switcherProd._id}, {$set:{orderIndex:targetOrder}});
	},
	increaseOrderCat:function(id){
		var curCat = Categories.findOne({_id:id});
		var targetOrder = curCat.orderIndex+1;
		var switcherCat = Categories.findOne({$and:[{orderIndex:targetOrder}, {restaurantId:curCat.restaurantId}]});
		if(!switcherCat) return;
		Categories.update({_id:id}, {$set:{orderIndex:targetOrder}});
		targetOrder--;
		Categories.update({_id:switcherCat._id}, {$set:{orderIndex:targetOrder}});
	},
	decreaseOrderCat:function(id){
		var curCat = Categories.findOne({_id:id});
		var targetOrder = curCat.orderIndex-1;
		var switcherCat = Categories.findOne({$and:[{orderIndex:targetOrder}, {restaurantId:curCat.restaurantId}]});
		if(!switcherCat) return;
		Categories.update({_id:id}, {$set:{orderIndex:targetOrder}});
		targetOrder++;
		Categories.update({_id:switcherCat._id}, {$set:{orderIndex:targetOrder}});
	}
})