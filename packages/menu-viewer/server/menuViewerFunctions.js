Meteor.publish("restCats", function(id){
	var usr = Tables.findOne({_id:id});
	if(!usr) return [];

	return Categories.find({restaurantId:usr.restaurantId});
});

Meteor.publish("restProds", function(id){
	var usr = Tables.findOne({_id:id});
	if(!usr) return [];

	return Products.find({restaurantId:usr.restaurantId});
})

Meteor.publish("myTable", function(id){
	return Tables.find({_id:id});	
})

Meteor.methods({
	clearListTable:function(id){
		Tables.update({_id:id}, {$set:{list:[]}})
	},
	addProdusToList:function(tableId, prodId)
	{
		var table = Tables.findOne({_id:tableId});
		var rest = Restaurants.findOne({_id:table.restaurantId});
		console.log(rest.IP + " -- " + this.connection.clientAddress);

		if(rest.IP == this.connection.clientAddress){
			if(table.joined){
				var tables = table.joined;

				for (var j = 0; j < tables.length; j++) {
					var curTable = Tables.findOne({_id:tables[j]});
					if(!curTable.list){
						var newList = [];
						newList.push({prod:prodId, quantity:1});
						Tables.update({_id:curTable._id}, {$set:{list:newList}});
					}else{
						var list = curTable.list;
						var flag=false;

						for (var i = 0; i < list.length; i++) {
							if(list[i].prod == prodId){
								list[i].quantity = parseInt(list[i].quantity)+1;
								flag=true;
							}
						}
						if(!flag){
							list.push({prod:prodId, quantity:1});
						}
						Tables.update({_id:curTable._id}, {$set:{list:list}});
					}
				}
				return "good";
			}else{
				if(!table.list){
					var newList = [];
					newList.push({prod:prodId, quantity:1});
					Tables.update({_id:table._id}, {$set:{list:newList}});
				}else{
					var list = table.list;
					var flag=false;

					for (var i = 0; i < list.length; i++) {
						if(list[i].prod == prodId){
							list[i].quantity = parseInt(list[i].quantity)+1;
							flag=true;
						}
					}
					if(!flag){
						list.push({prod:prodId, quantity:1});
					}
					Tables.update({_id:table._id}, {$set:{list:list}});
				}
				return "good";
			}
		}
		else{
			return "badip";
		}
	},
	removeItemsFromList:function(tableId, id, quant){
		var table = Tables.findOne({_id:tableId});
		var rest = Restaurants.findOne({_id:table.restaurantId});
		console.log(rest.IP + " -- " + this.connection.clientAddress);
		if(rest.IP == this.connection.clientAddress){

			if(table.joined){
				var tables = table.joined;

				for (var j = 0; j < tables.length; j++) {
					var curTable = Tables.findOne({_id:tables[j]});
					var list = curTable.list;

					for (var i = 0; i < list.length; i++) {
						if(list[i].prod == id)
						{
							list[i].quantity = parseInt(list[i].quantity)-quant;
							if(list[i].quantity <= 0){
								list.splice(i,1);
							}
						}
					}
					Tables.update({_id:curTable._id}, {$set:{list:list}});
				}
			}else{
				var list = table.list;

				for (var i = 0; i < list.length; i++) {
					if(list[i].prod == id)
					{
						list[i].quantity = parseInt(list[i].quantity)-quant;
						if(list[i].quantity <= 0){
							list.splice(i,1);
						}
					}
				}
				Tables.update({_id:table._id}, {$set:{list:list}});
			}

			return "good";
		}
		else{
			return "badip";
		}
	}
})