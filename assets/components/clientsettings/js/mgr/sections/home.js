Ext.onReady(function() {
	MODx.load({xtype: 'clientsettings-page-home'});
});

ClientSettings.page.Home = function(config) {
	config = config || {};
	
	config.buttons = [{
		text		: _('save'),
		cls			:'primary-button',
		method		: 'remote',
		process 	: 'mgr/save',
		checkDirty	: true,
		keys		: [{
			ctrl		: true,
			key			: MODx.config.keymap_save || 's'
		}]
	}, '-'];
	
	if (ClientSettings.config.admin) {
		config.buttons.push({
			text		: _('clientsettings.admin_view'),
			handler		: this.toAdminView,
			scope		: this
		}, '-');
	}
	
	config.buttons.push({
		text		: _('help_ex'),
		handler		: MODx.loadHelpPane,
		scope		: this
	});
	
	Ext.applyIf(config, {
		formpanel	: 'clientsettings-panel-home',
		components	: [{
			xtype		: 'clientsettings-panel-home',
			contexts	: ClientSettings.config.contexts,
			categories	: ClientSettings.config.categories,
			renderTo	: 'clientsettings-panel-home-div'
		}]
	});
	
	ClientSettings.page.Home.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.page.Home, MODx.Component, {
	toAdminView: function() {
		MODx.loadPage(MODx.request.a, 'action=admin');
	}
});

Ext.reg('clientsettings-page-home', ClientSettings.page.Home);