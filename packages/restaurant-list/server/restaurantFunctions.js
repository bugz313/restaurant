Meteor.publish("allRestaurants", function(){
	return Restaurants.find();
})

Meteor.publish("allTables", function(){
	return Tables.find();
})

Meteor.methods({
	saveRestaurant:function(obj){
		obj["dateAdded"] = new Date();
		var restId = Restaurants.insert(obj)
		var tableCount = parseInt(obj["tables"]);

		for (var i = 0; i < tableCount; i++) {
			var table = {};
			var numeMasa = i+1;
			table["name"] = "Masa "+numeMasa;
			table["restaurantId"] = restId;
			table["dateAdded"] = new Date();
			table["list"] = [];
			Tables.insert(table);
		};
	}
})