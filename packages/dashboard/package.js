Package.describe({
  name: 'bugz313:dashboard',
  version: '1.0.1',
  summary: 'The dashboard Restaurante.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(['sacha:spin','twbs:bootstrap','templating','peppelg:bootstrap-3-modal', 'multiply:iron-router-progress', 'meteorhacks:fast-render','ovcharik:alertify'], 'client');
  api.use('bogdanlungu:errors-notifications', 'client');

  api.use(['accounts-password','lmachens:prerenderio'], ['client','server']);

  api.use(['iron:router'], ['client','server']);
  api.imply('iron:controller', ['client','server']);

  api.use('ian:accounts-ui-bootstrap-3@1.2.59', ['client','server']);

  api.addFiles(['common/router.js'],['client','server']); // add this line to load the router before the rest of the files.
  api.addFiles(['server/initPrerender.js'],['server']); // add this line to load the router before the rest of the files.

  api.addFiles([
      'client/forgotPassword/forgotPassword.html',
      'client/forgotPassword/forgotPassword.css',
      'client/forgotPassword/forgotPassword.js',
      'client/layout.html',
      'client/main.html',
      'client/welcome.html',
      'client/welcome.js',
      'client/stylesheets/style.css',
      'client/includes/access_denied.html',
      'client/includes/loading.html',
      'client/includes/not_found.html',
      'client/config.js'
  ],'client');


});
