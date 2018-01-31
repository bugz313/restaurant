Package.describe({
  name: 'bogdanlungu:errors-notifications',
  version: '0.0.1',
  summary: 'A pattern to display application errors and notifications',
  git: '',
  documentation: 'null'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(['minimongo', 'mongo-livedata', 'templating','ovcharik:alertify'], 'client');
  api.addFiles(['errors_notifications_helper.js', 'errors_notifications.html', 'errors_notifications.js', 'errors_notifications.css'], 'client');
 
  // export the package level variable so it is available in other packages and in the project
  if(api.export)
    api.export('Errors_Notifications');
    api.export('hasPermission');
});


// Run the test using tinytest
// The test worked fine after I raised the disk space to 5000MB, I got errors with 1750MB

Package.onTest(function(api) {
  api.use('bogdanlungu:errors-notifications');
  api.use('tinytest@1.0.0');
  api.addFiles('errors_notifications_tests.js', 'client');
});


