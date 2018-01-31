Package.describe({
  name: 'bugz313:restaurant-list',
  version: '1.0.1',
  summary: 'The restaurant Admin page for Restaurante.',
  git: '',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.1.0.2');
  api.use(['mongo','minimongo','mongo-livedata','templating'], ['client','server']);
  api.use(['sacha:spin','twbs:bootstrap','templating','peppelg:bootstrap-3-modal', 'multiply:iron-router-progress', 'meteorhacks:fast-render','ovcharik:alertify'], 'client');
  api.use('bogdanlungu:errors-notifications', 'client');

  api.use(['accounts-password'], ['client','server']);

  api.use(['iron:router'], ['client','server']);
  api.imply('iron:controller', ['client','server']);

  api.use('ian:accounts-ui-bootstrap-3@1.2.59', ['client','server']);

  api.addFiles(['common/router.js'],['client','server']); // add this line to load the router before the rest of the files.
  api.addFiles(['collections/restaurantCollections.js'],['client','server']); // add this line to load the router before the rest of the files.
  api.addFiles(['server/restaurantFunctions.js'],['server']); // add this line to load the router before the rest of the files.

  api.addFiles([
      'client/createRestaurant/createRestaurant.html',
      'client/createRestaurant/createRestaurant.js',
      'client/restaurant_list.html',
      'client/restaurant_list.css',
      'client/restaurant_list.js'
  ],'client');

  api.export("Restaurants");
  api.export("Tables");


});
