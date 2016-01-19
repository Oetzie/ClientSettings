Ext.onReady(function() {
	MODx.load({xtype: 'clientsettings-page-client'});
});

ClientSettings.page.Client = function(config) {
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
	}, {
        text		: _('cancel'),
        id			: 'modx-abtn-cancel'
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
		formpanel	: 'clientsettings-panel-client',
		components	: [{
			xtype		: 'clientsettings-panel-client',
			contexts	: ClientSettings.config.contexts,
			categories	: ClientSettings.config.categories,
			renderTo	: 'clientsettings-panel-client-div'
		}]
	});
	
	ClientSettings.page.Client.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.page.Client, MODx.Component, {
	toAdminView: function() {
		MODx.loadPage(MODx.request.a, 'action=admin');
	}
});

Ext.reg('clientsettings-page-client', ClientSettings.page.Client);