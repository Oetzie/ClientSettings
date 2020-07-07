ClientSettings.panel.Home = function(config) {
    config = config || {};
    
    Ext.apply(config, {
        url         : ClientSettings.config.connector_url,
        baseParams  : {
            action      : 'mgr/save'
        },
        id          : 'clientsettings-panel-home',
        cls         : 'container',
        items       : [{
            html        : '<h2>' + _('clientsettings') + '</h2>',
            cls         : 'modx-page-header'
        }, this.getItems(config.settings)],
        listeners   : {
            'setup'     : {
                fn          : this.setup,
                scope       : this
            }
        }
    });
    
    ClientSettings.panel.Home.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.panel.Home, MODx.FormPanel, {
    setup: function() {
        this.fireEvent('ready');
    },
    getItems: function(settings) {
        var items = [];

        if (settings.length === 0) {
            items.push({
                html    : '<p>' + _('clientsettings.no_settings_desc') + '</p>',
                cls     : 'modx-config-error'
            });
        } else {
            var tabs = [];

            settings.forEach((function (category, index) {
                tabs.push({
                    title           : category.name_formatted,
                    items           : [{
                        html            : '<p>' + category.description_formatted + '</p>',
                        bodyCssClass    : 'panel-desc',
                        hidden          : category.description_formatted === ''
                    }, {
                        layout          : 'form',
                        labelAlign      : 'top',
                        labelSeparator  : '',
                        cls             : ClientSettings.config.vtabs ? '' : 'main-wrapper',
                        items           : this.getSettings(category.settings)
                    }]
                });
            }).bind(this));

            if (ClientSettings.config.vtabs) {
                items.push({
                    xtype   : 'modx-vtabs',
                    items   : tabs
                });
            } else {
                items.push({
                    xtype   : 'modx-tabs',
                    items   : tabs
                });
            }
        }

        if (ClientSettings.config.vtabs) {
            return [{
                layout      : 'form',
                items       : items
            }];
        }

        return items;
    },
    getSettings: function(settings) {
        var items = [];

        if (settings.length === 0) {
            items.push({
                html    : '<p>' + _('clientsettings.no_settings_desc') + '</p>',
                cls     : 'modx-config-error'
            });
        } else {
            var context = MODx.request.context || MODx.config.default_context;

            settings.forEach((function (setting, index) {
                var element = Ext.applyIf({
                    fieldLabel  : setting.label_formatted || setting.label,
                    description : '<b>[[++' + setting.key + ']]</b>',
                    name        : context + ':' + setting.id,
                    anchor      : '100%',
                    id          : 'clientsettings-setting-' + context + '-' + setting.id,
                    value       : setting.value.value || ''
                }, setting);

                switch (element.xtype) {
                    case 'datefield':
                        element = Ext.applyIf({
                            format          : MODx.config.manager_date_format,
                            startDay        : parseInt(MODx.config.manager_week_start),
                            minValue        : element.extra.min_date_value,
                            maxValue        : element.extra.max_date_value
                        }, element);

                        break;
                    case 'timefield':
                        element = Ext.applyIf({
                            format          : MODx.config.manager_time_format,
                            offset_time     : MODx.config.server_offset_time,
                            minValue        : element.extra.min_time_value,
                            maxValue        : element.extra.max_time_value
                        }, element);

                        break;
                    case 'datetimefield':
                        element = Ext.applyIf({
                            xtype           : 'xdatetime',
                            dateFormat      : MODx.config.manager_date_format,
                            timeFormat      : MODx.config.manager_time_format,
                            startDay        : parseInt(MODx.config.manager_week_start),
                            offset_time     : MODx.config.server_offset_time,
                            minDateValue    : element.extra.min_date_value,
                            maxDateValue    : element.extra.max_date_value,
                            minTimeValue    : element.extra.min_time_value,
                            maxTimeValue    : element.extra.max_time_value
                        }, element);

                        break;
                    case 'passwordfield':
                        element = Ext.applyIf({
                            xtype           : 'textfield',
                            inputType       : 'password'
                        }, element);

                        break;
                    case 'richtext':
                        element = Ext.applyIf({
                            xtype           : 'textarea',
                            listeners       : {
                                afterrender     : {
                                    fn              : function(event) {
                                        if (MODx.loadRTE) {
                                            MODx.loadRTE(event.id);
                                        }
                                    }
                                }
                            }
                        }, element);

                        break;
                    case 'boolean':
                        element = Ext.applyIf({
                            xtype           : 'combo-boolean',
                            hiddenName      : element.name
                        }, element);

                        break;
                    case 'combo':
                        element = Ext.applyIf({
                            xtype           : 'modx-combo',
                            store           : new Ext.data.JsonStore({
                                fields          : ['value', 'label'],
                                data            : element.extra.values || []
                            }),
                            mode            : 'local',
                            hiddenName      : element.name,
                            valueField      : 'value',
                            displayField    : 'label'
                        }, element);

                        break;
                    case 'checkbox':
                        items.push({
                            xtype           : 'hidden',
                            name            : element.name
                        });

                        element = Ext.applyIf({
                            hideLabel       : true,
                            boxLabel        : element.fieldLabel,
                            inputValue      : 1,
                            checked         : parseInt(setting.value.value)
                        }, element);

                        break;
                    case 'checkboxgroup':
                        var options = [];

                        element.extra.values.forEach(function(option, index) {
                            options.push({
                                name        : element.name + '[]',
                                boxLabel    : option.label,
                                inputValue  : option.value
                            });
                        });

                        items.push({
                            xtype           : 'hidden',
                            name            : element.name
                        });

                        if (options.length >= 1) {
                            element = Ext.applyIf({
                                xtype       : 'checkboxgroup',
                                columns     : 1,
                                items       : options,
                                value       : setting.value.value || ''
                            }, element);
                        }

                        break;
                    case 'radiogroup':
                        var options = [];

                        element.extra.values.forEach(function(option, index) {
                            options.push({
                                name        : element.name,
                                boxLabel    : option.label,
                                inputValue  : option.value
                            });
                        });

                        element = Ext.applyIf({
                            xtype           : 'radiogroup',
                            columns         : 1,
                            items           : options
                        }, element);

                        break;
                    case 'resource':
                        items.push({
                            xtype           : 'hidden',
                            name            : element.name,
                            id              : element.id + '-replace',
                            value           : setting.value.value || ''
                        });

                        element = Ext.applyIf({
                            xtype           : 'modx-field-parent-change',
                            name            : element.name + '-replace',
                            formpanel       : 'clientsettings-panel-home',
                            parentcmp       : element.id + '-replace',
                            contextcmp      : null,
                            currentid       : 0,
                            value           : setting.value.replace || ''
                        }, element);

                        break;
                    case 'browser':
                        element = Ext.applyIf({
                            xtype           : 'modx-combo-browser',
                            source          : element.extra.browser_source || MODx.config.default_media_source,
                            openTo          : element.extra.browser_open_to || '/',
                            allowedFileTypes : element.extra.browser_allowed_file_types || ''
                        }, element);

                        break;
                    default:
                        if (ClientSettings.config.xtypes[setting.xtype]) {
                            var customXType = ClientSettings.config.xtypes[setting.xtype];

                            if (customXType.type === 'custom') {
                                element.xtype = customXType.xtype;

                                Ext.iterate(customXType.fields, (function(field) {
                                    if (element.extra[setting.xtype + '_' + field.name]) {
                                        element[field.name] = element.extra[setting.xtype + '_' + field.name];
                                    } else {
                                        element[field.name] = '';
                                    }
                                }).bind(this));

                                if (setting.xtype === 'tinymce') {
                                    element.listeners = {
                                        afterrender     : {
                                            fn              : function(event) {
                                                if (MODx.loadRTE) {
                                                    MODx.loadRTE(event.id, element.config || null);
                                                }
                                            }
                                        }
                                    };
                                }
                            }
                        }

                        break;
                }

                items.push(element);

                if (setting.description_formatted || setting.description) {
                    items.push({
                        xtype    : MODx.expandHelp ? 'label' : 'hidden',
                        html     : setting.description_formatted || setting.description,
                        cls      : 'desc-under'
                    });
                }
            }).bind(this));
        }

        return items;
    }
});

Ext.reg('clientsettings-panel-home', ClientSettings.panel.Home);