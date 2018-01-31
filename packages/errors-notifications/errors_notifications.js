/** 
 * Template helper for the errors
 */

Template.meteorErrors.helpers({
  errors: function() {
    return Errors_Notifications.collection_errors.find();
  }
});

/** 
 * Remove the error after 3 seconds from the collection
 * The rendered callback is triggered after the template is rendered 
 */
Template.meteorError.rendered = function() {
  var error = this.data;
    Meteor.setTimeout(function () {
      Errors_Notifications.collection_errors.remove(error._id);
  }, 3000);
};



/** 
 * Below here the helper for the notifications part
 */

Template.meteorNotifications.helpers({
  notifications: function() {
    return Errors_Notifications.collection_notifications.find();
  }
});

/** 
 * Remove the notification after 3 seconds from the local collection 
 */
Template.meteorNotification.rendered = function() {
  var notification = this.data;
    Meteor.setTimeout(function () {
      Errors_Notifications.collection_notifications.remove(notification._id);
  }, 3000);
};


hasPermission = function(perm){
  if(!Session.get("isWorking")) return false;
  var perms = Meteor.users.findOne({_id:Meteor.userId()}).permissions;
  var permList = [];
  for (var i = 0; i < perms.length; i++) {
      if(perms[i].employer == Session.get("workingFor")){
        permList = perms[i].permissionList;
      }
  }
  if(permList.indexOf(perm) == -1){
    return false;
  }else{
    return true;
  }
}