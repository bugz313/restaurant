/** 
 * In this file are some tests againts the errors-notifications package codebase
 * The test worked fine after I raised the disk space to 5000MB - I got errors with 1750MB
 */

Tinytest.add("Errors - collection", function(test) {
  test.equal(Errors_Notifications.collection_errors.find({}).count(), 0);
  Errors_Notifications.throwError('A new error!');
  test.equal(Errors_Notifications.collection_errors.find({}).count(), 1);
  Errors_Notifications.collection_errors.remove({});
});

Tinytest.add("Notifications - collection", function(test) {
  test.equal(Errors_Notifications.collection_notifications.find({}).count(), 0);
  Errors_Notifications.throwNotification('A new notification!');
  test.equal(Errors_Notifications.collection_notifications.find({}).count(), 1);
  Errors_Notifications.collection_notifications.remove({});
});

Tinytest.addAsync("Errors - template", function(test, done) {
  Errors_Notifications.throwError('A new error!');
  test.equal(Errors_Notifications.collection_errors.find({}).count(), 1);
  // render the template
  UI.insert(UI.render(Template.meteorErrors), document.body);
  Meteor.setTimeout(function() {
    test.equal(Errors_Notifications.collection_errors.find({}).count(), 0);
    done();
  }, 3500);
});

Tinytest.addAsync("Notifications - template", function(test, done) {
  Errors_Notifications.throwNotification('A new notification!');
  test.equal(Errors_Notifications.collection_notifications.find({}).count(), 1);
  // render the template
  UI.insert(UI.render(Template.meteorNotifications), document.body);
  Meteor.setTimeout(function() {
    test.equal(Errors_Notifications.collection_notifications.find({}).count(), 0);
    done();
  }, 3500);
});
