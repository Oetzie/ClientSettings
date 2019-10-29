Ext.onReady(function() {
    MODx.load({
        xtype : 'clientsettings-page-home'
    });
});

ClientSettings.page.Home = function(config) {
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
        xtype       : 'modx-combo-context',
        hidden      : ClientSettings.config.context,
        value       : MODx.request.context || MODx.config.default_context,
        name        : 'clientsettings-filter-context',
        emptyText   : _('clientsettings.filter_context'),
        displayField : 'name',
        listeners   : {
            'select'    : {
                fn          : this.filterContext,
                scope       : this   
            }
        },
        baseParams  : {
            action      : 'context/getlist',
            exclude     : ClientSettings.config.exclude_contexts.join(',')
        }
    }, {
        text        : _('save'),
        cls         : 'primary-button',
        method      : 'remote',
        process     : 'mgr/save',
        keys        : [{
            ctrl        : true,
            key         : MODx.config.keymap_save || 's'
        }]
    }, '-');

    if (ClientSettings.config.has_permission) {
        config.buttons.push({
            text        : '<i class="icon icon-cogs"></i>' + _('clientsettings.admin_view'),
            handler     : this.toAdminView,
            scope       : this
        }, '-');
    }

    if (ClientSettings.config.branding_url_help) {
        config.buttons.push({
            text        : _('help_ex'),
            handler     : MODx.loadHelpPane,
            scope       : this
        });
    }

    Ext.applyIf(config, {
        formpanel   : 'clientsettings-panel-home',
        components  : [{
            xtype       : 'clientsettings-panel-home',
            settings    : ClientSettings.config.settings,
            renderTo    : 'clientsettings-panel-home-div'
        }]
    });

    ClientSettings.page.Home.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.page.Home, MODx.Component, {
    loadBranding: function(btn) {
        window.open(ClientSettings.config.branding_url);
    },
    filterContext: function(tf) {
        MODx.loadPage('?a=home&namespace=' + ClientSettings.config.namespace + '&context=' + tf.getValue());
    },
    toAdminView: function() {
        MODx.loadPage('?a=admin&namespace=' + ClientSettings.config.namespace);
    }
});

Ext.reg('clientsettings-page-home', ClientSettings.page.Home);