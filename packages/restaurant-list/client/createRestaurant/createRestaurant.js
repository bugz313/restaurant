Template.createRestaurant.events({
	'click .saveRestaurant':function(e){
		var obj = {};
		obj["name"] = $("#rest_name").val();
		obj["tables"] = $("#rest_table_count").val();
		obj["client_count"] = $("#client_count").val();
		obj["rest_tel"] = $("#rest_tel").val();
		obj["rest_mail"] = $("#rest_mail").val();
		obj["rest_address"] = $("#rest_address").val();
		obj["pass"] = $("#rest_pass").val();
		
		Meteor.call("saveRestaurant", obj, function(err){
			if(err){
				console.log(err);
			}else{
				Errors_Notifications.throwNotification("Restaurantul a fost creat!");
				Router.go("restaurantList");
			}
		});
	}
})