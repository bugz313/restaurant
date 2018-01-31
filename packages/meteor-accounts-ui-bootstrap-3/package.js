Package.describe({
	name: 'ian:accounts-ui-bootstrap-3',
	summary: 'Bootstrap-styled accounts-ui with multi-language support.',
	version: '1.2.66',
	git: "https://github.com/ianmartorell/meteor-accounts-ui-bootstrap-3"
})

Package.on_use(function (api) {
	api.use(['session@1.0.0',
		'spacebars@1.0.0',
		'stylus',
		'accounts-base@1.0.0',
		'underscore@1.0.0',
		'templating@1.0.0',
		'anti:i18n@0.4.3'
		],'client');
  
  api.use('bogdanlungu:errors-notifications', 'client');

	api.imply('accounts-base', ['client', 'server']);

	// Allows the user of this package to choose their own Bootstrap
	// implementation.
	api.use(['twbs:bootstrap@3.3.1', 'nemo64:bootstrap@3.3.1_1', 'cwohlman:bootboxjs'], 'client', {weak: true});
	api.use(['19degrees:paypal-extended-secured'], ['client', 'server']);
	api.use(['meteorhacks:async'], 'server');
   	api.imply('meteorhacks:async', 'server');
  
  // Iron router
  api.use(['iron:router', 'peppelg:bootstrap-3-modal'], ['client','server']);
  
  // Imply the iron controller
  api.imply('iron:controller', ['client','server']);
  
	// Allows us to call Accounts.oauth.serviceNames, if there are any OAuth
	// services.
	api.use('accounts-oauth@1.0.0', {weak: true});
	// Allows us to directly test if accounts-password (which doesn't use
	// Accounts.oauth.registerService) exists.
	api.use('accounts-password@1.0.0', {weak: true});
	api.add_files("server/accountsFunctions.js","server");
	api.add_files("server/paypal_config.js","server");
	api.add_files([
		'accounts_ui.js',

		// translations
		'i18n/en.i18n.js',
		'i18n/es.i18n.js',
		'i18n/ca.i18n.js',
		'i18n/fr.i18n.js',
		'i18n/de.i18n.js',
		'i18n/it.i18n.js',
		'i18n/pt-PT.i18n.js',
		'i18n/pt-BR.i18n.js',
		'i18n/pt.i18n.js',
		'i18n/ru.i18n.js',
		'i18n/el.i18n.js',
		'i18n/ko.i18n.js',
		'i18n/ar.i18n.js',
		'i18n/pl.i18n.js',
		'i18n/zh-CN.i18n.js',
		'i18n/zh-TW.i18n.js',
		'i18n/zh.i18n.js',
		'i18n/nl.i18n.js',
		'i18n/ja.i18n.js',
		'i18n/he.i18n.js',
		'i18n.js',

		'login_buttons.html',
		'login_buttons_single.html',
		'login_buttons_dropdown.html',
		'login_buttons_dialogs.html',

		'login_buttons_session.js',

		'login_buttons.js',
		'login_buttons_single.js',
		'login_buttons_dropdown.js',
		'login_buttons_dialogs.js',
		'accounts_ui.styl',
    'style.css',
    'drop_down.html',
    'drop_down.js',
    'common/router.js',
    'settings.html',
    'settings.js'
		], 'client');

	api.addAssets(['img/menu-top.png', 'img/default-avatar.png'],['client']);

	api.export('accountsUIBootstrap3', 'client')
})
