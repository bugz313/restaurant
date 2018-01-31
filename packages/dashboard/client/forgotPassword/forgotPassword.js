var curTok;

Template.forgotPassword.helpers({
	noToken:function(){
		if(Router.current().params.id == "reset"){
			return true;
		}else{
			curTok = Router.current().params.id;
			return false;
		}
	}
})

Template.forgotPassword.events({
	'click .sendResetEmail':function(e){
		var email = $("#email_reset").val();
		if(!validateEmail(email)){
			Errors_Notifications.throwError("Invalid e-mail!");
			return;
		}

		Meteor.call("sendResetMail", email, function(err, resp){
			if(err){	
				console.log(err);
			}else{
				if(resp == "NO_ACCOUNT"){
					Errors_Notifications.throwError("There is no user with this e-mail saved!");
				}else{
					Errors_Notifications.throwNotification("Reset password link was sent to this e-mail!");
				}
			}
		})
	},
	'click .resetPasswordNew':function(e){
		if($("#password_new").val() != $("#password_new_confirm").val()){
			Errors_Notifications.throwError("Passwords don't match!");
			return;
		}

		if($("#password_new").val().length < 6){
			Errors_Notifications.throwError("Password has to be at least 6 characters long!");
			return;
		}

		Meteor.call("setNewPassword", Router.current().params.id, $("#password_new").val(), function(err){
			if(err){
				console.log(err)
			}else{
				Errors_Notifications.throwNotification("Password was successfuly reset!");
				Router.go("/");
			}
		});
	}
})

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}