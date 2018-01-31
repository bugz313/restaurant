(function() {

	// for convenience
	var loginButtonsSession = Accounts._loginButtonsSession;

	Template._loginButtonsAdditionalLoggedInDropdownActions.events({
		'click #login-buttons-open-change-password': function(event) {
			event.stopPropagation();
			loginButtonsSession.resetMessages();
			loginButtonsSession.set('inChangePasswordFlow', true);
			Meteor.flush();
		},
		'click .sbetalink':function(e){
			Meteor.call("makeSBetaKey", function(err, resp){
				if(err){
					console.log(err);
				}else{
					window.open("http://xliberator.com:3007/?userId="+Meteor.userId()+"&key="+resp);
				}
			})
		}
	});

	Template._loginButtonsAdditionalLoggedInDropdownActions.helpers({
		myUserId:function(){
			if(Meteor.user()){
				return Meteor.userId();
			}
		},
		displayName: function() {
			return Accounts._loginButtons.displayName();
		},

		inChangePasswordFlow: function() {
			return loginButtonsSession.get('inChangePasswordFlow');
		},

		inMessageOnlyFlow: function() {
			return loginButtonsSession.get('inMessageOnlyFlow');
		},

		dropdownVisible: function() {
			return loginButtonsSession.get('dropdownVisible');
		},
		imCompany:function(){
			if(Meteor.users.findOne({_id:Meteor.userId()}).profile.type == "company") return true;
			return false;
		},
		notWorking:function(){
			if(!Session.get("isWorking")) return true;
			  var perm = Meteor.users.findOne({_id:Meteor.userId()}).permissions;
			  var permList = [];
			  for (var i = 0; i < perm.length; i++) {
			    if(perm[i].employer == Session.get("workingFor")){
			      permList = perm[i].permissionList;
			    }
			  }
			  if(permList.indexOf("9") == -1){
			    return true;
			  }
			  return false;
		},
		canFire:function(){
			if(!Session.get("isWorking")) return false;
			  var perm = Meteor.users.findOne({_id:Meteor.userId()}).permissions;
			  var permList = [];
			  for (var i = 0; i < perm.length; i++) {
			    if(perm[i].employer == Session.get("workingFor")){
			      permList = perm[i].permissionList;
			    }
			  }
			  if(permList.indexOf("10") == -1 && permList.indexOf("13") == -1 && permList.indexOf("14")){
			    return false;
			  }
			  return true;
		}
	});
})();
