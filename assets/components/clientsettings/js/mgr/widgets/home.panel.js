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
                            minValue        : element.extra.minDateValue,
                            maxValue        : element.extra.maxDateValue
                        }, element);

                        break;
                    case 'timefield':
                        element = Ext.applyIf({
                            format          : MODx.config.manager_time_format,
                            offset_time     : MODx.config.server_offset_time,
                            minValue        : element.extra.minTimeValue,
                            maxValue        : element.extra.maxTimeValue
                        }, element);

                        break;
                    case 'datetimefield':
                        element = Ext.applyIf({
                            xtype           : 'xdatetime',
                            dateFormat      : MODx.config.manager_date_format,
                            timeFormat      : MODx.config.manager_time_format,
                            startDay        : parseInt(MODx.config.manager_week_start),
                            offset_time     : MODx.config.server_offset_time,
                            minDateValue    : element.extra.minDateValue,
                            maxDateValue    : element.extra.maxDateValue,
                            minTimeValue    : element.extra.minTimeValue,
                            maxTimeValue    : element.extra.maxTimeValue
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
                                            MODx.loadRTE(event.id, {
                                                toolbar1    : element.extra.toolbar1 || 'undo redo | bold italic underline strikethrough | styleselect bullist numlist outdent indent',
                                                toolbar2    : element.extra.toolbar2 || '',
                                                toolbar3    : element.extra.toolbar3 || '',
                                                plugins     : element.extra.plugins || '',
                                                menubar     : false,
                                                statusbar   : false,
                                                width       : '60%',
                                                height      : '250px',
                                                toggle      : false
                                            });
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
                            source          : element.extra.source || MODx.config.default_media_source,
                            openTo          : element.extra.openTo || '/',
                            allowedFileTypes : element.extra.allowedFileTypes || ''
                        }, element);

                        break;
                    case 'clientgrid':
                        element = Ext.applyIf({
                            xtype           : 'clientgrid-panel-gridview',
                            grid            : element.extra.grid
                        }, element);

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