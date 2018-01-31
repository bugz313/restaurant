/** 
 * Created local collections in which errors and notifications will be stored
 * Defined the functions throwError and throwNotification which will be called to insert values in the collections
 */

Errors_Notifications = {
  collection_errors: new Mongo.Collection(null),
  throwError: function(message) {
  	alertify.error(message);
    //Errors_Notifications.collection_errors.insert({message: message});
  },

  collection_notifications: new Mongo.Collection(null),   
  throwNotification: function(message) {
  	alertify.log(message);
    //Errors_Notifications.collection_notifications.insert({message: message});
  }
}