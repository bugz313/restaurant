Meteor.publish("restCatsSimple", function(id){
	return Categories.find({restaurantId:id});
});

Meteor.publish("restProdsSimple", function(id){
	return Products.find({restaurantId:id});
})