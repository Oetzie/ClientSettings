ClientSettings.grid.Settings = function(config) {
    config = config || {};

    config.tbar = [{
        text        : _('clientsettings.setting_create'),
        cls         : 'primary-button',
        handler     : this.createSetting,
        scope       : this
    }, '->', {
        xtype       : 'clientsettings-combo-categories',
        name        : 'clientsettings-filter-settings-categories',
        id          : 'clientsettings-filter-settings-categories',
        emptyText   : _('clientsettings.filter_category'),
        listeners   : {
            'select'    : {
                fn          : this.filterCategory,
                scope       : this   
            }
        }
    }, '-', {
        xtype       : 'textfield',
        name        : 'clientsettings-filter-settings-search',
        id          : 'clientsettings-filter-settings-search',
        emptyText   : _('search') + '...',
        listeners   : {
            'change'    : {
                fn          : this.filterSearch,
                scope       : this
            },
            'render'    : {
                fn          : function(cmp) {
                    new Ext.KeyMap(cmp.getEl(), {
                        key     : Ext.EventObject.ENTER,
                        fn      : this.blur,
                        scope   : cmp
                    });
                },
                scope       : this
            }
        }
    }, {
        xtype       : 'button',
        cls         : 'x-form-filter-clear',
        id          : 'clientsettings-filter-settings-clear',
        text        : _('filter_clear'),
        listeners   : {
            'click'     : {
                fn          : this.clearFilter,
                scope       : this
            }
        }
    }];
    
    var expander = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<p class="desc">{description_formatted}</p>'
        )
    });
    
    var columns = new Ext.grid.ColumnModel({
        columns     : [expander, {
            header      : _('clientsettings.label_setting_label'),
            dataIndex   : 'label_formatted',
            sortable    : false,
            editable    : false,
            width       : 150
        }, {
            header      : _('clientsettings.label_setting_key'),
            dataIndex   : 'key',
            sortable    : false,
            editable    : false,
            width       : 100
        }, {
            header      : _('clientsettings.label_setting_xtype'),
            dataIndex   : 'xtype',
            sortable    : false,
            editable    : true,
            fixed       : true,
            width       : 100,
            renderer    : this.renderXtype,
            editor      : {
                xtype       : 'clientsettings-combo-xtype'
            }
        }, {
            header      : _('clientsettings.label_setting_active'),
            dataIndex   : 'active',
            sortable    : false,
            editable    : true,
            width       : 100,
            fixed       : true,
            renderer    : this.renderBoolean,
            editor      : {
                xtype       : 'modx-combo-boolean'
            }
        }, {
            header      : _('last_modified'),
            dataIndex   : 'editedon',
            sortable    : false,
            editable    : false,
            fixed       : true,
            width       : 200,
            renderer    : this.renderDate
        }, {
            header      : _('clientsettings.label_setting_category'),
            dataIndex   : 'category_name_formatted',
            sortable    : false,
            hidden      : true,
            editable    : false
        }]
    });
    
    Ext.applyIf(config, {
        cm          : columns,
        id          : 'clientsettings-grid-settings',
        url         : ClientSettings.config.connector_url,
        baseParams  : {
            action      : 'mgr/settings/getlist'
        },
        autosave    : true,
        save_action : 'mgr/settings/updatefromgrid',
        fields      : ['id', 'category_id', 'category_name', 'key', 'label', 'description', 'xtype', 'exclude', 'extra', 'menuindex', 'active', 'editedon', 'category_name_formatted', 'label_formatted', 'description_formatted'],
        paging      : true,
        pageSize    : MODx.config.default_per_page > 30 ? MODx.config.default_per_page : 30,
        remoteSort  : true,
        grouping    : true,
        groupBy     : 'category_name_formatted',
        plugins     : expander,
        singleText  : _('clientsettings.setting'),
        pluralText  : _('clientsettings.settings'),
        tools       : [{
            id          : 'plus',
            qtip        : _('expand_all'),
            handler     : this.expandAll,
            scope       : this
        }, {
            id          : 'minus',
            hidden      : true,
            qtip        : _('collapse_all'),
            handler     : this.collapseAll,
            scope       : this
        }],
        refreshGrid : [],
        enableDragDrop : true,
        ddGroup     : 'clientsettings-grid-settings'
    });
    
    ClientSettings.grid.Settings.superclass.constructor.call(this, config);
    
    this.on('afterrender', this.sortSettings, this);
};

Ext.extend(ClientSettings.grid.Settings, MODx.grid.Grid, {
    filterCategory: function(tf, nv, ov) {
        this.getStore().baseParams.category = tf.getValue();
        
        this.getBottomToolbar().changePage(1);
    },
    filterSearch: function(tf, nv, ov) {
        this.getStore().baseParams.query = tf.getValue();
        
        this.getBottomToolbar().changePage(1);
    },
    clearFilter: function() {
        this.getStore().baseParams.category = '';
        this.getStore().baseParams.query    = '';
        
        Ext.getCmp('clientsettings-filter-settings-categories').reset();
        Ext.getCmp('clientsettings-filter-settings-search').reset();
        
        this.getBottomToolbar().changePage(1);
    },
    getMenu: function() {
        return [{
            text    : '<i class="x-menu-item-icon icon icon-edit"></i>' + _('clientsettings.setting_update'),
            handler : this.updateSetting,
            scope   : this
        }, {
            text    : '<i class="x-menu-item-icon icon icon-copy"></i>' + _('clientsettings.setting_duplicate'),
            handler : this.duplicateSetting,
            scope   : this
        }, '-',  {
            text    : '<i class="x-menu-item-icon icon icon-times"></i>' + _('clientsettings.setting_remove'),
            handler : this.removeSetting,
            scope   : this
        }];
    },
    refreshGrids: function() {
        if (typeof this.config.refreshGrid === 'string') {
            Ext.getCmp(this.config.refreshGrid).refresh();
        } else {
            this.config.refreshGrid.forEach(function(grid) {
                Ext.getCmp(grid).refresh();
            });
        }
    },
    sortSettings: function() {
        new Ext.dd.DropTarget(this.getView().mainBody, {
            ddGroup     : this.config.ddGroup,
            notifyOver  : function(dd, e, data) {
                var index       = dd.getDragData(e).rowIndex,
                    minIndex    = null,
                    maxIndex    = null;

                Ext.each(data.grid.getStore().data.items, (function(record, recordIndex) {
                    if (record.data.category_id === data.selections[0].data.category_id) {
                        if (recordIndex <= minIndex || minIndex === null) {
                            minIndex = recordIndex;
                        }

                        if (recordIndex >= maxIndex || maxIndex === null) {
                            maxIndex = recordIndex;
                        }
                    }
                }).bind(this));

                return index >= minIndex && index <= maxIndex ? this.dropAllowed : this.dropNotAllowed;
            },
            notifyDrop  : function(dd, e, data) {
                if (this.dropAllowed === this.notifyOver(dd, e, data)) {
                    var index = dd.getDragData(e).rowIndex;

                    if (undefined !== index) {
                        for (var i = 0; i < data.selections.length; i++) {
                            data.grid.getStore().remove(data.grid.getStore().getById(data.selections[i].id));
                            data.grid.getStore().insert(index, data.selections[i]);
                        }

                        var order = [];

                        Ext.each(data.grid.getStore().data.items, (function(record) {
                            order.push(record.id);
                        }).bind(this));

                        MODx.Ajax.request({
                            url         : ClientSettings.config.connector_url,
                            params      : {
                                action      : 'mgr/settings/sort',
                                sort        : order.join(',')
                            },
                            listeners   : {
                                'success'   : {
                                    fn          : function() {

                                    },
                                    scope       : this
                                }
                            }
                        });
                    }
                }
            }
        });
    },
    createSetting: function(btn, e) {
        if (this.createSettingWindow) {
            this.createSettingWindow.destroy();
        }
        
        this.createSettingWindow = MODx.load({
            xtype       : 'clientsettings-window-setting-create',
            closeAction : 'close',
            listeners   : {
                'success'   : {
                    fn          : function() {
                        this.refreshGrids();
                        this.refresh();
                    },
                    scope       : this
                }
            }
        });
        
        this.createSettingWindow.show(e.target);
    },
    updateSetting: function(btn, e) {
        if (this.updateSettingWindow) {
            this.updateSettingWindow.destroy();
        }
        
        this.updateSettingWindow = MODx.load({
            xtype       : 'clientsettings-window-setting-update',
            record      : this.menu.record,
            closeAction : 'close',
            listeners   : {
                'success'   : {
                    fn          : function() {
                        this.refreshGrids();
                        this.refresh();
                    },
                    scope       : this
                }
            }
        });
        
        this.updateSettingWindow.setValues(this.menu.record);
        this.updateSettingWindow.show(e.target);
    },
    duplicateSetting: function(btn, e) {
        if (this.duplicateSettingWindow) {
            this.duplicateSettingWindow.destroy();
        }
        
        var record = Ext.apply({}, {
            key : 'copy_' + this.menu.record.key
        }, this.menu.record);

        this.duplicateSettingWindow = MODx.load({
            xtype       : 'clientsettings-window-setting-duplicate',
            record      : record,
            closeAction : 'close',
            listeners   : {
                'success'   : {
                    fn          : function() {
                        this.refreshGrids();
                        this.refresh();
                    },
                    scope       : this
                }
            }
        });
        
        this.duplicateSettingWindow.setValues(record);
        this.duplicateSettingWindow.show(e.target);
    },
    removeSetting: function() {
        MODx.msg.confirm({
            title       : _('clientsettings.setting_remove'),
            text        : _('clientsettings.setting_remove_confirm'),
            url         : ClientSettings.config.connector_url,
            params      : {
                action      : 'mgr/settings/remove',
                id          : this.menu.record.id
            },
            listeners   : {
                'success'   : {
                    fn          : function() {
                        this.refreshGrids();
                        this.refresh();
                    },
                    scope       : this
                }
            }
        });
    },
    renderBoolean: function(d, c) {
        c.css = parseInt(d) === 1 || d ? 'green' : 'red';

        return parseInt(d) === 1 || d ? _('yes') : _('no');
    },
    renderXtype: function(d, c) {
        if (ClientSettings.config.xtypes[d]) {
            return ClientSettings.config.xtypes[d].name;
        }

        return '';
    },
    renderDate: function(a) {
        if (Ext.isEmpty(a)) {
            return '—';
        }
        
        return a;
    }
});

Ext.reg('clientsettings-grid-settings', ClientSettings.grid.Settings);

ClientSettings.window.CreateSetting = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        autoHeight  : true,
        width       : 800,
        title       : _('clientsettings.setting_create'),
        url         : ClientSettings.config.connector_url,
        baseParams  : {
            action      : 'mgr/settings/create'
        },
        bodyStyle   : 'padding: 0',
        fields      : [{
            xtype       : 'modx-vtabs',
            deferredRender : false,
            hideMode    : 'offsets',
            items       : [{
                title       : _('clientsettings.default_settings'),
                items       : [{
                    layout      : 'column',
                    defaults    : {
                        layout      : 'form',
                        labelSeparator : ''
                    },
                    items       : [{
                        columnWidth : .5,
                        items       : [{
                            layout      : 'column',
                            defaults    : {
                                layout      : 'form',
                                labelSeparator : ''
                            },
                            items       : [{
                                columnWidth : .8,
                                items       : [{
                                    xtype       : 'textfield',
                                    fieldLabel  : _('clientsettings.label_setting_key'),
                                    description : MODx.expandHelp ? '' : _('clientsettings.label_setting_key_desc'),
                                    name        : 'key',
                                    anchor      : '100%',
                                    allowBlank  : false
                                }, {
                                    xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                    html        : _('clientsettings.label_setting_key_desc'),
                                    cls         : 'desc-under'
                                }]
                            }, {
                                columnWidth : .2,
                                items       : [{
                                    xtype       : 'checkbox',
                                    fieldLabel  : _('clientsettings.label_setting_active'),
                                    description : MODx.expandHelp ? '' : _('clientsettings.label_setting_active_desc'),
                                    name        : 'active',
                                    inputValue  : 1,
                                    checked     : true
                                }, {
                                    xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                    html        : _('clientsettings.label_setting_active_desc'),
                                    cls         : 'desc-under'
                                }]
                            }]
                        }, {
                            xtype       : 'textfield',
                            fieldLabel  : _('clientsettings.label_setting_label'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_label_desc'),
                            name        : 'label',
                            anchor      : '100%'
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_label_desc'),
                            cls         : 'desc-under'
                        }, {
                            xtype       : 'textarea',
                            fieldLabel  : _('clientsettings.label_setting_description'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_description_desc'),
                            name        : 'description',
                            anchor      : '100%'
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_description_desc'),
                            cls         : 'desc-under'
                        }]
                    }, {
                        columnWidth : .5,
                        items       : [{
                            xtype       : 'clientsettings-combo-xtype',
                            fieldLabel  : _('clientsettings.label_setting_xtype'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_xtype_desc'),
                            id          : 'clientsettings-combo-xtype-create',
                            name        : 'xtype',
                            anchor      : '100%',
                            allowBlank  : false,
                            listeners   : {
                                render      : {
                                    fn          : this.onHandleXtype,
                                    scope       : this
                                },
                                select      : {
                                    fn          : this.onHandleXtype,
                                    scope       : this
                                }
                            }
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_xtype_desc'),
                            cls         : 'desc-under'
                        }, {
                            xtype       : 'clientsettings-combo-categories',
                            fieldLabel  : _('clientsettings.label_setting_category'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_category_desc'),
                            name        : 'category_id',
                            anchor      : '100%',
                            allowBlank  : false
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_category_desc'),
                            cls         : 'desc-under'
                        }, {
                            xtype       : 'textfield',
                            fieldLabel  : _('clientsettings.label_setting_exclude'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_exclude_desc'),
                            name        : 'exclude',
                            anchor      : '100%',
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_exclude_desc'),
                            cls         : 'desc-under'
                        }]
                    }]
                }]
            }, {
                title       : _('clientsettings.extra_settings'),
                defaults    : {
                    layout      : 'form',
                    labelSeparator : ''
                },
                items       : [{
                    id          : 'clientsettings-extra-default-create',
                    items       : []
                }, {
                    id          : 'clientsettings-extra-datefield-create',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'datefield',
                                fieldLabel  : _('clientsettings.label_setting_mindate'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_mindate_desc'),
                                name        : 'extra[min_date_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_date_format,
                                startDay    : parseInt(MODx.config.manager_week_start)
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_mindate_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'datefield',
                                fieldLabel  : _('clientsettings.label_setting_maxdate'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_maxdate_desc'),
                                name        : 'extra[max_date_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_date_format,
                                startDay    : parseInt(MODx.config.manager_week_start)
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_maxdate_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-timefield-create',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'timefield',
                                fieldLabel  : _('clientsettings.label_setting_mintime'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_mintime_desc'),
                                name        : 'extra[min_time_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_time_format
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_mintime_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'timefield',
                                fieldLabel  : _('clientsettings.label_setting_maxtime'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_maxtime_desc'),
                                name        : 'extra[max_time_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_time_format
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_maxtime_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-combo-create',
                    items       : [{
                        xtype       : 'clientsettings-combo-values',
                        fieldLabel  : _('clientsettings.label_setting_values'),
                        name        : 'extra[values]'
                    }, {
                        xtype       : 'textarea',
                        fieldLabel  : _('clientsettings.label_setting_binded_values'),
                        description : MODx.expandHelp ? '' : _('clientsettings.label_setting_binded_values_desc'),
                        name        : 'extra[binded_values]',
                        anchor      : '100%'
                    }, {
                        xtype       : MODx.expandHelp ? 'label' : 'hidden',
                        html        : _('clientsettings.label_setting_binded_values_desc'),
                        cls         : 'desc-under'
                    }]
                }, {
                    id          : 'clientsettings-extra-browser-create',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'modx-combo-source',
                                fieldLabel  : _('clientsettings.label_setting_source'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_source_desc'),
                                name        : 'extra[browser_source]',
                                hiddenName  : 'extra[browser_source]',
                                anchor      : '100%',
                                value       : MODx.config.default_media_source
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_source_desc'),
                                cls         : 'desc-under'
                            }, {
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_filetypes'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_filetypes_desc'),
                                name        : 'extra[browser_allowed_file_types]',
                                anchor      : '100%',
                                value       : ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_filetypes_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_opento'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_opento_desc'),
                                name        : 'extra[browser_open_to]',
                                anchor      : '100%',
                                value       : '/'
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        :  _('clientsettings.label_setting_opento_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }]
            }]
        }]
    });
    
    ClientSettings.window.CreateSetting.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.CreateSetting, MODx.Window, {
    onHandleXtype: function(event) {
        var value = event.getRecordValue();

        if (value) {
            var fields      = [];
            var elements    = {
                default         : false,
                datefield       : false,
                timefield       : false,
                datetimefield   : false,
                combo           : false,
                browser         : false
            };

            switch (value.data.id) {
                case 'datefield':
                    elements.datefield  = true;

                    break;
                case 'timefield':
                    elements.timefield  = true;

                    break;
                case 'datetimefield':
                    elements.datefield  = true;
                    elements.timefield  = true;

                    break;
                case 'combo':
                case 'radiogroup':
                case 'checkboxgroup':
                    elements.combo      = true;

                    break;
                case 'browser':
                    elements.browser    = true;

                    break;
                default:
                    elements.default    = true;

                    break;
            }

            if (value.data.fields) {
                Ext.iterate(value.data.fields, (function(field) {
                    var element = {
                        xtype       : field.xtype || 'textfield',
                        fieldLabel  : field.title,
                        name        : 'extra[' + value.data.id + '_' + field.name + ']',
                        hiddenName  : 'extra[' + value.data.id + '_' + field.name + ']',
                        anchor      : '100%',
                        value       : field.value || ''
                    };

                    if (this.record && this.record.extra) {
                        if (this.record.extra[value.data.id + '_' + field.name]) {
                            element.value = this.record.extra[value.data.id + '_' + field.name];
                        }
                    }

                    if (field.description) {
                        element.description = MODx.expandHelp ? '' : field.description;
                    }

                    fields.push(element);

                    if (field.description) {
                        fields.push({
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : field.description,
                            cls         : 'desc-under'
                        });
                    }
                }).bind(this));
            }

            if (fields.length === 0) {
                fields.push({
                    html        : '<p>' + _('clientsettings.no_extra_settings') + '</p>',
                    cls         : 'modx-config-error'
                });
            }

            Ext.iterate(elements, (function(element, value) {
                var tab = Ext.getCmp('clientsettings-extra-' + element + '-create');

                if (tab) {
                    if (element === 'default') {
                        tab.removeAll();
                        tab.add(fields);
                        tab.doLayout();
                    }

                    if (value) {
                        tab.show();
                    } else {
                        tab.hide();
                    }
                }
            }).bind(this));
        }
    }
});

Ext.reg('clientsettings-window-setting-create', ClientSettings.window.CreateSetting);

ClientSettings.window.DuplicateSetting = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        autoHeight  : true,
        width       : 800,
        title       : _('clientsettings.setting_duplicate'),
        url         : ClientSettings.config.connector_url,
        bodyStyle   : 'padding: 0',
        baseParams  : {
            action      : 'mgr/settings/create'
        },
        fields      : [{
            xtype       : 'modx-vtabs',
            deferredRender : false,
            hideMode    : 'offsets',
            items       : [{
                title       : _('clientsettings.default_settings'),
                items       : [{
                    layout      : 'column',
                    defaults    : {
                        layout      : 'form',
                        labelSeparator : ''
                    },
                    items   : [{
                        columnWidth : .5,
                        items       : [{
                            layout      : 'column',
                            defaults    : {
                                layout      : 'form',
                                labelSeparator : ''
                            },
                            items       : [{
                                columnWidth : .8,
                                items       : [{
                                    xtype       : 'textfield',
                                    fieldLabel  : _('clientsettings.label_setting_key'),
                                    description : MODx.expandHelp ? '' : _('clientsettings.label_setting_key_desc'),
                                    name        : 'key',
                                    anchor      : '100%',
                                    allowBlank  : false
                                }, {
                                    xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                    html        : _('clientsettings.label_setting_key_desc'),
                                    cls         : 'desc-under'
                                }]
                            }, {
                                columnWidth : .2,
                                items       : [{
                                    xtype       : 'checkbox',
                                    fieldLabel  : _('clientsettings.label_setting_active'),
                                    description : MODx.expandHelp ? '' : _('clientsettings.label_setting_active_desc'),
                                    name        : 'active',
                                    inputValue  : 1
                                }, {
                                    xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                    html        : _('clientsettings.label_setting_active_desc'),
                                    cls         : 'desc-under'
                                }]
                            }]
                        }, {
                            xtype       : 'textfield',
                            fieldLabel  : _('clientsettings.label_setting_label'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_label_desc'),
                            name        : 'label',
                            anchor      : '100%'
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_label_desc'),
                            cls         : 'desc-under'
                        }, {
                            xtype       : 'textarea',
                            fieldLabel  : _('clientsettings.label_setting_description'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_description_desc'),
                            name        : 'description',
                            anchor      : '100%'
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_description_desc'),
                            cls         : 'desc-under'
                        }]
                    }, {
                        columnWidth : .5,
                        items       : [{
                            xtype       : 'clientsettings-combo-xtype',
                            fieldLabel  : _('clientsettings.label_setting_xtype'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_xtype_desc'),
                            name        : 'xtype',
                            anchor      : '100%',
                            allowBlank  : false,
                            listeners   : {
                                render      : {
                                    fn          : this.onHandleXtype,
                                    scope       : this
                                },
                                select      : {
                                    fn          : this.onHandleXtype,
                                    scope       : this
                                }
                            }
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_xtype_desc'),
                            cls         : 'desc-under'
                        }, {
                            xtype       : 'clientsettings-combo-categories',
                            fieldLabel  : _('clientsettings.label_setting_category'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_category_desc'),
                            name        : 'category_id',
                            anchor      : '100%',
                            allowBlank  : false
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_category_desc'),
                            cls         : 'desc-under'
                        }, {
                            xtype       : 'textfield',
                            fieldLabel  : _('clientsettings.label_setting_exclude'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_exclude_desc'),
                            name        : 'exclude',
                            anchor      : '100%'
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_exclude_desc'),
                            cls         : 'desc-under'
                        }]
                    }]
                }]
            }, {
                title       : _('clientsettings.extra_settings'),
                defaults    : {
                    layout      : 'form',
                    labelSeparator : ''
                },
                items       : [{
                    id          : 'clientsettings-extra-default-copy',
                    items       : []
                }, {
                    id          : 'clientsettings-extra-datefield-copy',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'datefield',
                                fieldLabel  : _('clientsettings.label_setting_mindate'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_mindate_desc'),
                                name        : 'extra[min_date_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_date_format,
                                startDay    : parseInt(MODx.config.manager_week_start),
                                value       : config.record.extra.min_date_value
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_mindate_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'datefield',
                                fieldLabel  : _('clientsettings.label_setting_maxdate'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_maxdate_desc'),
                                name        : 'extra[max_date_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_date_format,
                                startDay    : parseInt(MODx.config.manager_week_start),
                                value       : config.record.extra.max_date_value
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_maxdate_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-timefield-copy',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'timefield',
                                fieldLabel  : _('clientsettings.label_setting_mintime'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_mintime_desc'),
                                name        : 'extra[min_time_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_time_format,
                                value       : config.record.extra.min_time_value
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_mintime_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'timefield',
                                fieldLabel  : _('clientsettings.label_setting_maxtime'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_maxtime_desc'),
                                name        : 'extra[max_time_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_time_format,
                                value       : config.record.extra.max_time_value
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_maxtime_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-combo-copy',
                    items       : [{
                        xtype       : 'clientsettings-combo-values',
                        fieldLabel  : _('clientsettings.label_setting_values'),
                        name        : 'extra[values]',
                        value       : Ext.encode(config.record.extra.values) || '[]'
                    }, {
                        xtype       : 'textarea',
                        fieldLabel  : _('clientsettings.label_setting_binded_values'),
                        description : MODx.expandHelp ? '' : _('clientsettings.label_setting_binded_values_desc'),
                        name        : 'extra[binded_values]',
                        anchor      : '100%',
                        value       : config.record.extra.binded_values || ''
                    }, {
                        xtype       : MODx.expandHelp ? 'label' : 'hidden',
                        html        : _('clientsettings.label_setting_binded_values_desc'),
                        cls         : 'desc-under'
                    }]
                }, {
                    id          : 'clientsettings-extra-browser-copy',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'modx-combo-source',
                                fieldLabel  : _('clientsettings.label_setting_source'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_source_desc'),
                                name        : 'extra[browser_source]',
                                hiddenName  : 'extra[browser_source]',
                                anchor      : '100%',
                                value       : config.record.extra.source || MODx.config.default_media_source
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_source_desc'),
                                cls         : 'desc-under'
                            }, {
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_filetypes'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_filetypes_desc'),
                                name        : 'extra[browser_allowed_file_types]',
                                anchor      : '100%',
                                value       : config.record.extra.browser_allowed_file_types || ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_filetypes_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_opento'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_opento_desc'),
                                name        : 'extra[browser_open_to]',
                                anchor      : '100%',
                                value       : config.record.extra.browser_open_to || '/'
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_opento_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }]
            }]
        }]
    });
    
    ClientSettings.window.DuplicateSetting.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.DuplicateSetting, MODx.Window, {
    onHandleXtype: function(event) {
        var value = event.getRecordValue();

        if (value) {
            var fields      = [];
            var elements    = {
                default         : false,
                datefield       : false,
                timefield       : false,
                datetimefield   : false,
                combo           : false,
                browser         : false
            };

            switch (value.data.id) {
                case 'datefield':
                    elements.datefield  = true;

                    break;
                case 'timefield':
                    elements.timefield  = true;

                    break;
                case 'datetimefield':
                    elements.datefield  = true;
                    elements.timefield  = true;

                    break;
                case 'combo':
                case 'radiogroup':
                case 'checkboxgroup':
                    elements.combo      = true;

                    break;
                case 'browser':
                    elements.browser    = true;

                    break;
                default:
                    elements.default    = true;

                    break;
            }

            if (value.data.fields) {
                Ext.iterate(value.data.fields, (function(field) {
                    var element = {
                        xtype       : field.xtype || 'textfield',
                        fieldLabel  : field.title,
                        name        : 'extra[' + value.data.id + '_' + field.name + ']',
                        hiddenName  : 'extra[' + value.data.id + '_' + field.name + ']',
                        anchor      : '100%',
                        value       : field.value || ''
                    };

                    if (this.record && this.record.extra) {
                        if (this.record.extra[value.data.id + '_' + field.name]) {
                            element.value = this.record.extra[value.data.id + '_' + field.name];
                        }
                    }

                    if (field.description) {
                        element.description = MODx.expandHelp ? '' : field.description;
                    }

                    fields.push(element);

                    if (field.description) {
                        fields.push({
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : field.description,
                            cls         : 'desc-under'
                        });
                    }
                }).bind(this));
            }

            if (fields.length === 0) {
                fields.push({
                    html        : '<p>' + _('clientsettings.no_extra_settings') + '</p>',
                    cls         : 'modx-config-error'
                });
            }

            Ext.iterate(elements, (function(element, value) {
                var tab = Ext.getCmp('clientsettings-extra-' + element + '-copy');

                if (tab) {
                    if (element === 'default') {
                        tab.removeAll();
                        tab.add(fields);
                        tab.doLayout();
                    }

                    if (value) {
                        tab.show();
                    } else {
                        tab.hide();
                    }
                }
            }).bind(this));
        }
    }
});

Ext.reg('clientsettings-window-setting-duplicate', ClientSettings.window.DuplicateSetting);

ClientSettings.window.UpdateSetting = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        autoHeight  : true,
        width       : 800,
        title       : _('clientsettings.setting_update'),
        url         : ClientSettings.config.connector_url,
            baseParams  : {
            action      : 'mgr/settings/update'
        },
        bodyStyle   : 'padding: 0',
        fields      : [{
            xtype       : 'hidden',
            name        : 'id'
        }, {
            xtype       : 'hidden',
            name        : 'key'
        }, {
            xtype       : 'modx-vtabs',
            deferredRender : false,
            hideMode    : 'offsets',
            items       : [{
                title       : _('clientsettings.default_settings'),
                items       : [{
                    layout      : 'column',
                    defaults    : {
                        layout      : 'form',
                        labelSeparator : ''
                    },
                    items       : [{
                        columnWidth : .5,
                        items       : [{
                            layout      : 'column',
                            defaults    : {
                                layout      : 'form',
                                labelSeparator : ''
                            },
                            items       : [{
                                columnWidth : .8,
                                items       : [{
                                    xtype       : 'statictextfield',
                                    fieldLabel  : _('clientsettings.label_setting_key'),
                                    description : MODx.expandHelp ? '' : _('clientsettings.label_setting_key_desc'),
                                    name        : 'key',
                                    anchor      : '100%',
                                    value       : config.record.key
                                }, {
                                    xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                    html        : _('clientsettings.label_setting_key_desc'),
                                    cls         : 'desc-under'
                                }]
                            }, {
                                columnWidth : .2,
                                items       : [{
                                    xtype       : 'checkbox',
                                    fieldLabel  : _('clientsettings.label_setting_active'),
                                    description : MODx.expandHelp ? '' : _('clientsettings.label_setting_active_desc'),
                                    name        : 'active',
                                    inputValue  : 1
                                }, {
                                    xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                    html        : _('clientsettings.label_setting_active_desc'),
                                    cls         : 'desc-under'
                                }]
                            }]
                        }, {
                            xtype       : 'textfield',
                            fieldLabel  : _('clientsettings.label_setting_label'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_label_desc'),
                            name        : 'label',
                            anchor      : '100%'
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_label_desc'),
                            cls         : 'desc-under'
                        }, {
                            xtype       : 'textarea',
                            fieldLabel  : _('clientsettings.label_setting_description'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_description_desc'),
                            name        : 'description',
                            anchor      : '100%'
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_description_desc'),
                            cls         : 'desc-under'
                        }]
                    }, {
                        columnWidth : .5,
                        items       : [{
                            xtype       : 'clientsettings-combo-xtype',
                            fieldLabel  : _('clientsettings.label_setting_xtype'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_xtype_desc'),
                            name        : 'xtype',
                            anchor      : '100%',
                            allowBlank  : false,
                            listeners   : {
                                render      : {
                                    fn          : this.onHandleXtype,
                                    scope       : this
                                },
                                select      : {
                                    fn          : this.onHandleXtype,
                                    scope       : this
                                }
                            }
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_xtype_desc'),
                            cls         : 'desc-under'
                        }, {
                            xtype       : 'clientsettings-combo-categories',
                            fieldLabel  : _('clientsettings.label_setting_category'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_category_desc'),
                            name        : 'category_id',
                            anchor      : '100%',
                            allowBlank  : false
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_category_desc'),
                            cls         : 'desc-under'
                        }, {
                            xtype       : 'textfield',
                            fieldLabel  : _('clientsettings.label_setting_exclude'),
                            description : MODx.expandHelp ? '' : _('clientsettings.label_setting_exclude_desc'),
                            name        : 'exclude',
                            anchor      : '100%'
                        }, {
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : _('clientsettings.label_setting_exclude_desc'),
                            cls         : 'desc-under'
                        }]
                    }]
                }]
            }, {
                title       : _('clientsettings.extra_settings'),
                defaults    : {
                    layout      : 'form',
                    labelSeparator : ''
                },
                items       : [{
                    id          : 'clientsettings-extra-default-update',
                    items       : []
                }, {
                    id          : 'clientsettings-extra-datefield-update',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'datefield',
                                fieldLabel  : _('clientsettings.label_setting_mindate'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_mindate_desc'),
                                name        : 'extra[min_date_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_date_format,
                                startDay    : parseInt(MODx.config.manager_week_start),
                                value       : config.record.extra.min_date_value
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_mindate_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'datefield',
                                fieldLabel  : _('clientsettings.label_setting_maxdate'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_maxdate_desc'),
                                name        : 'extra[max_date_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_date_format,
                                startDay    : parseInt(MODx.config.manager_week_start),
                                value       : config.record.extra.max_date_value
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_maxdate_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-timefield-update',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'timefield',
                                fieldLabel  : _('clientsettings.label_setting_mintime'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_mintime_desc'),
                                name        : 'extra[min_time_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_time_format,
                                value       : config.record.extra.min_time_value
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_mintime_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'timefield',
                                fieldLabel  : _('clientsettings.label_setting_maxtime'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_maxtime_desc'),
                                name        : 'extra[max_time_value]',
                                anchor      : '100%',
                                format      : MODx.config.manager_time_format,
                                value       : config.record.extra.max_time_value
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_maxtime_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-combo-update',
                    items       : [{
                        xtype       : 'clientsettings-combo-values',
                        fieldLabel  : _('clientsettings.label_setting_values'),
                        name        : 'extra[values]',
                        value       : Ext.encode(config.record.extra.values) || '[]'
                    }, {
                        xtype       : 'textarea',
                        fieldLabel  : _('clientsettings.label_setting_binded_values'),
                        description : MODx.expandHelp ? '' : _('clientsettings.label_setting_binded_values_desc'),
                        name        : 'extra[binded_values]',
                        anchor      : '100%',
                        value       : config.record.extra.binded_values || ''
                    }, {
                        xtype       : MODx.expandHelp ? 'label' : 'hidden',
                        html        : _('clientsettings.label_setting_binded_values_desc'),
                        cls         : 'desc-under'
                    }]
                }, {
                    id          : 'clientsettings-extra-browser-update',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'modx-combo-source',
                                fieldLabel  : _('clientsettings.label_setting_source'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_source_desc'),
                                name        : 'extra[browser_source]',
                                hiddenName  : 'extra[browser_source]',
                                anchor      : '100%',
                                value       : config.record.extra.source || MODx.config.default_media_source
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_source_desc'),
                                cls         : 'desc-under'
                            }, {
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_filetypes'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_filetypes_desc'),
                                name        : 'extra[browser_allowed_file_types]',
                                anchor      : '100%',
                                value       : config.record.extra.browser_allowed_file_types || ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_filetypes_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_opento'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_opento_desc'),
                                name        : 'extra[browser_open_to]',
                                anchor      : '100%',
                                value       : config.record.extra.browser_open_to || '/'
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_opento_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }]
            }]
        }]
    });
    
    ClientSettings.window.UpdateSetting.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.UpdateSetting, MODx.Window, {
    onHandleXtype: function(event) {
        var value = event.getRecordValue();

        if (value) {
            var fields      = [];
            var elements    = {
                default         : false,
                datefield       : false,
                timefield       : false,
                datetimefield   : false,
                combo           : false,
                browser         : false
            };

            switch (value.data.id) {
                case 'datefield':
                    elements.datefield  = true;

                    break;
                case 'timefield':
                    elements.timefield  = true;

                    break;
                case 'datetimefield':
                    elements.datefield  = true;
                    elements.timefield  = true;

                    break;
                case 'combo':
                case 'radiogroup':
                case 'checkboxgroup':
                    elements.combo      = true;

                    break;
                case 'browser':
                    elements.browser    = true;

                    break;
                default:
                    elements.default    = true;

                    break;
            }

            if (value.data.fields) {
                Ext.iterate(value.data.fields, (function(field) {
                    var element = {
                        xtype       : field.xtype || 'textfield',
                        fieldLabel  : field.title,
                        name        : 'extra[' + value.data.id + '_' + field.name + ']',
                        hiddenName  : 'extra[' + value.data.id + '_' + field.name + ']',
                        anchor      : '100%',
                        value       : field.value || ''
                    };

                    if (this.record && this.record.extra) {
                        if (this.record.extra[value.data.id + '_' + field.name]) {
                            element.value = this.record.extra[value.data.id + '_' + field.name];
                        }
                    }

                    if (field.description) {
                        element.description = MODx.expandHelp ? '' : field.description;
                    }

                    fields.push(element);

                    if (field.description) {
                        fields.push({
                            xtype       : MODx.expandHelp ? 'label' : 'hidden',
                            html        : field.description,
                            cls         : 'desc-under'
                        });
                    }
                }).bind(this));
            }

            if (fields.length === 0) {
                fields.push({
                    html        : '<p>' + _('clientsettings.no_extra_settings') + '</p>',
                    cls         : 'modx-config-error'
                });
            }

            Ext.iterate(elements, (function(element, value) {
                var tab = Ext.getCmp('clientsettings-extra-' + element + '-update');

                if (tab) {
                    if (element === 'default') {
                        tab.removeAll();
                        tab.add(fields);
                        tab.doLayout();
                    }

                    if (value) {
                        tab.show();
                    } else {
                        tab.hide();
                    }
                }
            }).bind(this));
        }
    }
});

Ext.reg('clientsettings-window-setting-update', ClientSettings.window.UpdateSetting);