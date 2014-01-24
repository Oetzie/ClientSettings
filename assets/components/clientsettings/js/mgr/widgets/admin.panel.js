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
				title		: _('clientsettings.admin_settings'),
				defaults	: {
					autoHeight	: true,
					autoWidth	: true,
					border		: false
				},
				items		: [{
					html			: '<p>'+_('clientsettings.admin_settings_desc')+'</p>',
					bodyCssClass	: 'panel-desc'
				}, {
					xtype			: 'clientsettings-grid-admin-setting',
					cls				: 'main-wrapper',
					preventRender	: true
				}]
			}, {
				layout		: 'form',
				title		: _('clientsettings.admin_areas'),
				defaults	: {
					autoHeight	: true,
					autoWidth	: true,
					border		: false
				},
				items		: [{
					html			: '<p>'+_('clientsettings.admin_areas_desc')+'</p>',
					bodyCssClass	: 'panel-desc'
				}, {
					xtype			: 'clientsettings-grid-admin-area',
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