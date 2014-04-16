ClientSettings.panel.Admin = function(config) {
	config = config || {};
	
	Ext.apply(config, {
		id			: 'clientsettings-panel-admin',
		cls			: 'container',
		defaults	: {
			collapsible	: false,
			autoHeight	: true,
			autoWidth	: true,
			border		: false
		},
		items		: [{
			html		: '<h2>'+_('clientsettings')+'</h2>',
			id			: 'clientsettings-header',
			cls			: 'modx-page-header'
		}, {
			xtype		: 'modx-tabs',
			items		: [{
				layout		: 'form',
				title		: _('clientsettings.settings'),
				defaults	: {
					autoHeight	: true,
					autoWidth	: true,
					border		: false
				},
				items		: [{
					html			: '<p>'+_('clientsettings.settings_desc')+'</p>',
					bodyCssClass	: 'panel-desc'
				}, {
					xtype			: 'clientsettings-grid-settings',
					cls				: 'main-wrapper',
					preventRender	: true
				}]
			}, {
				layout		: 'form',
				title		: _('clientsettings.categories'),
				defaults	: {
					autoHeight	: true,
					autoWidth	: true,
					border		: false
				},
				items		: [{
					html			: '<p>'+_('clientsettings.categories_desc')+'</p>',
					bodyCssClass	: 'panel-desc'
				}, {
					xtype			: 'clientsettings-grid-categories',
					cls				: 'main-wrapper',
					preventRender	: true
				}]
			}]
		}]
	});

	ClientSettings.panel.Admin.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.panel.Admin, MODx.FormPanel);

Ext.reg('clientsettings-panel-admin', ClientSettings.panel.Admin);