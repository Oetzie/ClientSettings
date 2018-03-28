Ext.onReady(function() {
    MODx.load({xtype: 'clientsettings-page-admin'});
});

ClientSettings.page.Admin = function(config) {
    config = config || {};

    config.buttons = [];

    if (ClientSettings.config.branding_url) {
        config.buttons.push({
            text        : 'ClientSettings ' + ClientSettings.config.version,
            cls         : 'x-btn-branding',
            handler     : this.loadBranding
        });
    }

    config.buttons.push({
        text        : '<i class="icon icon-eye"></i>' + _('clientsettings.default_view'),
        handler     : this.toDefaultView,
        scope       : this
    });
    
    if (ClientSettings.config.branding_url_help) {
        config.buttons.push('-', {
            text        : _('help_ex'),
            handler     : MODx.loadHelpPane,
            scope       : this
        });
    }

    Ext.applyIf(config, {
        components  : [{
            xtype       : 'clientsettings-panel-admin',
            renderTo    : 'clientsettings-panel-admin-div'
        }]
    });

    ClientSettings.page.Admin.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.page.Admin, MODx.Component, {
    loadBranding: function(btn) {
        window.open(ClientSettings.config.branding_url);
    },
    toDefaultView: function() {
        MODx.loadPage('?a=home&namespace=' + ClientSettings.config.namespace);
    }
});

Ext.reg('clientsettings-page-admin', ClientSettings.page.Admin);