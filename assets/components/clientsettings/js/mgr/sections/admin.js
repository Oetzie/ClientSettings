Ext.onReady(function() {
	MODx.load({xtype: 'clientsettings-page-admin'});
});

ClientSettings.page.Admin = function(config) {
	config = config || {};
	
	config.buttons = [{
		text		: _('clientsettings.client_view'),
		handler		: this.toClientView,
		scope		: this
	}, '-', {
		text		: _('help_ex'),
		handler		: MODx.loadHelpPane,
		scope		: this
	}];
	
	Ext.applyIf(config, {
		components	: [{
			xtype		: 'clientsettings-panel-admin',
			renderTo	: 'clientsettings-panel-admin-div'
		}]
	});
	
	ClientSettings.page.Admin.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.page.Admin, MODx.Component, {
	toClientView: function() {
		MODx.loadPage(MODx.request.a);
	}
});

Ext.reg('clientsettings-page-admin', ClientSettings.page.Admin);