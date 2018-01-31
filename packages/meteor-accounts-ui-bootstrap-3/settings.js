/** 
 * Settings page
 */

Template.membershipList.created = function(){
  Session.set("selectedMembership", "");
}

Template.membershipList.events({
  'click .buy1month':function(e){
    Session.set("selectedMembership", 1);
    $(".membershipHolder").css("height", "450px");
  },
  'click .buy3month':function(e){
    Session.set("selectedMembership", 3);
    $(".membershipHolder").css("height", "450px");
  },
  'click .buy12month':function(e){
    Session.set("selectedMembership", 12);
    $(".membershipHolder").css("height", "450px");
  },
  'click .cancelAdd':function(e){
    Modal.hide();
  },
  'click .payMembership':function(e){
    alertify.confirm("Extend membership with "+Session.get("selectedMembership")+" month(s)?", function(resp){
      if(resp){
        $(".payMembership").hide();
        $(".cancelAdd").hide();
        $(".processingPaymentText").show();
        Meteor.call("buyMembership", $("#credit_name").val(), $("#cardnumber").val(), $("#type").val(), $("#cvv").val(), $("#expire_year").val(), $("#expire_month").val(), Session.get("selectedMembership"), function(err, response){
          if(err){
            console.log(err);
          }else{
            if(response == "GOOD"){
              Errors_Notifications.throwNotification("Membership has been successfuly extended!");
              Modal.hide();
            }else{
              Errors_Notifications.throwError("Something went wrong. Please check the information and try again!")
              $(".payMembership").show();
              $(".cancelAdd").show();
              $(".processingPaymentText").hide();
            }
          }
        })
      }
    })
  }

})

Template.membershipList.helpers({
  expireYears:function(){
    var d = new Date();
    var y = parseInt(d.getFullYear());
    var arr = [];
    for (var i = y; i < y+6; i++) {
      arr.push(i);
    }
    return arr;
  },
  hasSelectedMembership:function(){
    if(Session.get("selectedMembership") != ""){
      return true;
    }
    return false;
  },
  membTime:function(){
    if(Session.get("selectedMembership") == 1){
      return "1 month";
    }else if(Session.get("selectedMembership") == 3){
      return "3 months";
    }else if(Session.get("selectedMembership") == 12){
      return '12 months';
    }
    else
    {
      Modal.hide();
    }
  }
})


Template.settings.helpers({
   loggedIn: function() {
      return Meteor.user();
   },
  
   userData: function(){
     return Meteor.users.findOne(Meteor.userId());
   },

   notHasAPIKey:function(){
    if(Meteor.user()){
      if(Meteor.user().profile){
        if(Meteor.user().profile.apiKey){
          return false;
        }
      }
    }
    return true;
   },

   membershipInfo:function(){
    if(!this.profile.membership) return "Not available";
    var today = new Date();
    var memb = new Date(this.profile.membership);

    var time = memb.getTime() - today.getTime();
    time = Math.round(time/1000);

    if(time < 0) return "Expired"

    var days = Math.floor(time/86400);
    time = time - (days*86400);
    var hours = Math.floor(time/3600);
    time = time - (hours*3600);
    var mins = Math.floor(time/60);

    return days+" days "+ hours + " hours ";
   }
});

Template.settings.events({
  'click .buyMembership':function(e){
    Modal.show("membershipList");
  },
  'click .generateAPIKey':function(e){
    Meteor.call("makeAPIKey", function(err){
      if(err) console.log(err);
    })
  },
  'click .updateAccount': function(e){
    
    e.preventDefault();

    if($('#email').val() == ""){
      Errors_Notifications.throwError("Please fill in the e-mail field!");
      return;
    }

    Meteor.call("checkDuplicateEmails", $("#email").val(), function(err, resp){
      if(resp == "DUPLICATE"){
        Errors_Notifications.throwError("There is already an account created with this e-mail!");
        return;
      }else{
        var name = $('#name').val();
        var email = $('#email').val();
        var companyName = $('#companyName').val();
        var uspsuid = $('#uspsuid').val();
        var teapplixName = $('#teapplixName').val();
        var teapplixUser = $('#teapplixUser').val();
        var teapplixPass = $('#teapplixPass').val();
        
        if(email.length > 0) {
          Meteor.call("addLog", null, "changed", "Changed profile e-mail to: "+email, function(err){
            if(err) console.log(err);
          });
        }

        if(name.length > 0) {
          Meteor.call("addLog", null, "changed", "Changed profile name to: "+name, function(err){
            if(err) console.log(err);
          });
        }

        var user = {
          profile: {name: name, 
                   email: email,
                   companyName: companyName,
                   uspsuid: uspsuid,
                   teapplixName:teapplixName,
                   teapplixUser:teapplixUser,
                   teapplixPass:"[Saved]"
                 }
        };
        var usr = Meteor.users.findOne(Meteor.userId());
        if(usr.profile.teapplixName != teapplixName || usr.profile.teapplixUser != teapplixUser || usr.profile.teapplixPass != '[Saved]'){
          Meteor.call("saveTeapplixInfo", teapplixName, teapplixUser, teapplixPass, function(err){
            if(err){
              console.log(err);
            }
          })
        }
        
        Meteor.users.update(Meteor.userId(), {$set: {"profile.name":name, "profile.email":email, "profile.companyName":companyName, "profile.uspsuid":uspsuid, "profile.teapplixName":teapplixName, "profile.teapplixUser":teapplixUser, "profile.teapplixPass":"[Saved]"}});
        
        alert("The update has been done!");
      }
    })
  },
 
  'click .changePassword': function(e){
    e.preventDefault();
    
    var go = true;
    
    var oldPassword = $('#oldPassword').val();
    var newPassword = $('#newPassword').val();
    var newPasswordAgain = $('#newPasswordAgain').val();
    
    
    if(newPassword.length < 6){
      go = false;
      return Errors_Notifications.throwError("Minimum 6 characters are required for the new password");
    }
    
    if(newPassword !== newPasswordAgain){
      go = false;
      return Errors_Notifications.throwError("Please fill the same password two times.");
    }
    
    if(go === true){
    Accounts.changePassword(oldPassword, newPassword, function(error){
      if(error){
        return Errors_Notifications.throwError(error);
        alert(error);
      }else{
        Meteor.call("addLog", null, "changed", "Password was changed.", function(err){
          if(err) console.log(err);
        });
        Errors_Notifications.throwNotification("The password was changed!");
      }
    });
    }else{
      Errors_Notifications.throwError("The password was not changed!");
    }  

  },

  'click .disableAccount':function(e){
    var password=$('#deletePassword').val();
    var digest = Package.sha.SHA256(password);
    Meteor.call('checkPassword', digest, function(err, result) {
      if (result) {
        var user = {
          profile: {
            disabled: true,
            disableDate: new Date(),
            avatar: Meteor.users.findOne({_id:Meteor.userId()}).profile.avatar
          }
        }
        if(Meteor.user()){
          if(Meteor.user().profile){
            if(Meteor.user().profile.type == "person"){
              Meteor.call("createPayout", function(err, resp){
                if(err){
                  console.log(err);
                }
              })
            }
          }
        }

        Meteor.users.update(Meteor.userId(), {$set: user});
        Meteor.logout();

      }else{
        Errors_Notifications.throwError("Incorrect password!");
      }
    });
  }
});

function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
}