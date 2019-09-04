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
        id          : 'clientsettings-grid-admin-settings',
        url         : ClientSettings.config.connector_url,
        baseParams  : {
            action      : 'mgr/settings/getlist'
        },
        autosave    : true,
        save_action : 'mgr/settings/updatefromgrid',
        fields      : ['id', 'category_id', 'category_name', 'key', 'label', 'description', 'xtype', 'exclude', 'extra', 'menuindex', 'active', 'editedon', 'category_name_formatted', 'label_formatted', 'description_formatted'],
        paging      : true,
        pageSize    : MODx.config.default_per_page > 30 ? MODx.config.default_per_page : 30,
        sortBy      : 'menuindex',
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
        ddGroup     : 'clientsettings-grid-admin-settings'
    });
    
    ClientSettings.grid.Settings.superclass.constructor.call(this, config);
    
    this.on('afterrender', this.sortSetting, this);
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
            for (var i = 0; i < this.config.refreshGrid.length; i++) {
                Ext.getCmp(this.config.refreshGrid[i]).refresh();
            }
        }
    },
    sortSetting: function() {
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
    renderXtype: function(a, b, c) {
        var xtypes = {
            'textfield'     : _('clientsettings.textfield'),
            'datefield'     : _('clientsettings.datefield'),
            'timefield'     : _('clientsettings.timefield'),
            'datetimefield' : _('clientsettings.datetimefield'),
            'passwordfield' : _('clientsettings.passwordfield'),
            'numberfield'   : _('clientsettings.numberfield'),
            'textarea'      : _('clientsettings.textarea'),
            'richtext'      : _('clientsettings.richtext'),
            'boolean'       : _('clientsettings.boolean'),
            'combo'         : _('clientsettings.combo'),
            'checkbox'      : _('clientsettings.checkbox'),
            'checkboxgroup' : _('clientsettings.checkboxgroup'),
            'radiogroup'    : _('clientsettings.radiogroup'),
            'resource'      : _('clientsettings.resource'),
            'browser'       : _('clientsettings.browser')
        };

        if (xtypes[a]) {
            return xtypes[a];
        }         
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
                items       : [{
                    id          : 'clientsettings-extra-default-create',
                    items       : [{
                        html    : '<p>' + _('clientsettings.no_extra_settings') + '</p>'
                    }]
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
                                name        : 'minDateValue',
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
                                name        : 'maxDateValue',
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
                                name        : 'minTimeValue',
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
                                name        : 'maxTimeValue',
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
                    id          : 'clientsettings-extra-richtext-create',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth     : .5,
                            items       : [{
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_toolbar1'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_toolbar1_desc'),
                                name        : 'toolbar1',
                                anchor      : '100%',
                                value       : 'undo redo | bold italic underline strikethrough | styleselect bullist numlist outdent indent'
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_toolbar1_desc'),
                                cls         : 'desc-under'
                            }, {
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_toolbar3'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_toolbar3_desc'),
                                name        : 'toolbar3',
                                anchor      : '100%',
                                value       : ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_toolbar3_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_toolbar2'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_toolbar2_desc'),
                                name        : 'toolbar2',
                                anchor      : '100%',
                                value       : ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_toolbar2_desc'),
                                cls         : 'desc-under'
                            }, {
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_plugins'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_plugins_desc'),
                                name        : 'plugins',
                                anchor      : '100%',
                                value       : ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_plugins_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-combo-create',
                    items       : [{
                        xtype       : 'clientsettings-combo-values',
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
                                name        : 'source',
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
                                name        : 'allowedFileTypes',
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
                                name        : 'openTo',
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
        var elements = {
            default         : false,
            datefield       : false,
            timefield       : false,
            datetimefield   : false,
            richtext        : false,
            combo           : false,
            browser         : false
        };
        
        switch (event.getValue()) {
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
            case 'richtext':
                elements.richtext   = true;
                
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

        Ext.iterate(elements, function(element, value) {
            var tab = Ext.getCmp('clientsettings-extra-' + element + '-create');

            if (tab) {
                if (value) {
                    tab.show();
                } else {
                    tab.hide();
                }
            }
        });
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
                items       : [{
                    id          : 'clientsettings-extra-default-copy',
                    items       : [{
                        html    : '<p>' + _('clientsettings.no_extra_settings') + '</p>'
                    }]
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
                                name        : 'minDateValue',
                                anchor      : '100%',
                                format      : MODx.config.manager_date_format,
                                startDay    : parseInt(MODx.config.manager_week_start),
                                value       : config.record.extra.minDateValue
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
                                name        : 'maxDateValue',
                                anchor      : '100%',
                                format      : MODx.config.manager_date_format,
                                startDay    : parseInt(MODx.config.manager_week_start),
                                value       : config.record.extra.maxDateValue
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
                                name        : 'minTimeValue',
                                anchor      : '100%',
                                format      : MODx.config.manager_time_format,
                                value       : config.record.extra.minTimeValue
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
                                name        : 'maxTimeValue',
                                anchor      : '100%',
                                format      : MODx.config.manager_time_format,
                                value       : config.record.extra.maxTimeValue
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_maxtime_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-richtext-copy',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_toolbar1'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_toolbar1_desc'),
                                name        : 'toolbar1',
                                anchor      : '100%',
                                value       : config.record.extra.toolbar1 || 'undo redo | bold italic underline strikethrough | styleselect bullist numlist outdent indent'
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_toolbar1_desc'),
                                cls         : 'desc-under'
                            }, {
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_toolbar3'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_toolbar3_desc'),
                                name        : 'toolbar3',
                                anchor      : '100%',
                                value       : config.record.extra.toolbar3 || ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_toolbar3_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_toolbar2'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_toolbar2_desc'),
                                name        : 'toolbar2',
                                anchor      : '100%',
                                value       : config.record.extra.toolbar2 || ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_toolbar2_desc'),
                                cls         : 'desc-under'
                            }, {
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_plugins'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_plugins_desc'),
                                name        : config.record.extra.plugins || 'plugins',
                                anchor      : '100%',
                                value       : ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_plugins_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-combo-copy',
                    items       : [{
                        xtype       : 'clientsettings-combo-values',
                        value       : Ext.encode(config.record.extra.values) || '[]'
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
                                name        : 'source',
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
                                name        : 'allowedFileTypes',
                                anchor      : '100%',
                                value       : config.record.extra.allowedFileTypes || ''
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
                                name        : 'openTo',
                                anchor      : '100%',
                                value       : config.record.extra.openTo || '/'
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_opento_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }]
            }],
        }]
    });
    
    ClientSettings.window.DuplicateSetting.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.DuplicateSetting, MODx.Window, {
    onHandleXtype: function(event) {
        var elements = {
            default         : false,
            datefield       : false,
            timefield       : false,
            datetimefield   : false,
            richtext        : false,
            combo           : false,
            browser         : false
        };

        switch (event.getValue()) {
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
            case 'richtext':
                elements.richtext   = true;

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

        Ext.iterate(elements, function(element, value) {
            var tab = Ext.getCmp('clientsettings-extra-' + element + '-copy');

            if (tab) {
                if (value) {
                    tab.show();
                } else {
                    tab.hide();
                }
            }
        });
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
                items       : [{
                    id          : 'clientsettings-extra-default-update',
                    items       : [{
                        html    : '<p>' + _('clientsettings.no_extra_settings') + '</p>'
                    }]
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
                                name        : 'minDateValue',
                                anchor      : '100%',
                                format      : MODx.config.manager_date_format,
                                startDay    : parseInt(MODx.config.manager_week_start),
                                value       : config.record.extra.minDateValue
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
                                name        : 'maxDateValue',
                                anchor      : '100%',
                                format      : MODx.config.manager_date_format,
                                startDay    : parseInt(MODx.config.manager_week_start),
                                value       : config.record.extra.maxDateValue
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
                                name        : 'minTimeValue',
                                anchor      : '100%',
                                format      : MODx.config.manager_time_format,
                                value       : config.record.extra.minTimeValue
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
                                name        : 'maxTimeValue',
                                anchor      : '100%',
                                format      : MODx.config.manager_time_format,
                                value       : config.record.extra.maxTimeValue
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_maxtime_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-richtext-update',
                    items       : [{
                        layout      : 'column',
                        defaults    : {
                            layout      : 'form',
                            labelSeparator : ''
                        },
                        items       : [{
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_toolbar1'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_toolbar1_desc'),
                                name        : 'toolbar1',
                                anchor      : '100%',
                                value       : config.record.extra.toolbar1 || 'undo redo | bold italic underline strikethrough | styleselect bullist numlist outdent indent'
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_toolbar1_desc'),
                                cls         : 'desc-under'
                            }, {
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_toolbar3'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_toolbar3_desc'),
                                name        : 'toolbar3',
                                anchor      : '100%',
                                value       : config.record.extra.toolbar3 || ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_toolbar3_desc'),
                                cls         : 'desc-under'
                            }]
                        }, {
                            columnWidth : .5,
                            items       : [{
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_toolbar2'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_toolbar2_desc'),
                                name        : 'toolbar2',
                                anchor      : '100%',
                                value       : config.record.extra.toolbar2 || ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_toolbar2_desc'),
                                cls         : 'desc-under'
                            }, {
                                xtype       : 'textfield',
                                fieldLabel  : _('clientsettings.label_setting_plugins'),
                                description : MODx.expandHelp ? '' : _('clientsettings.label_setting_plugins_desc'),
                                name        : config.record.extra.plugins || 'plugins',
                                anchor      : '100%',
                                value       : ''
                            }, {
                                xtype       : MODx.expandHelp ? 'label' : 'hidden',
                                html        : _('clientsettings.label_setting_plugins_desc'),
                                cls         : 'desc-under'
                            }]
                        }]
                    }]
                }, {
                    id          : 'clientsettings-extra-combo-update',
                    items       : [{
                        xtype       : 'clientsettings-combo-values',
                        value       : Ext.encode(config.record.extra.values) || '[]'
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
                                name        : 'source',
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
                                name        : 'allowedFileTypes',
                                anchor      : '100%',
                                value       : config.record.extra.allowedFileTypes || ''
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
                                name        : 'openTo',
                                anchor      : '100%',
                                value       : config.record.extra.openTo || '/'
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
        var elements = {
            default         : false,
            datefield       : false,
            timefield       : false,
            datetimefield   : false,
            richtext        : false,
            combo           : false,
            browser         : false
        };

        switch (event.getValue()) {
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
            case 'richtext':
                elements.richtext   = true;

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

        Ext.iterate(elements, function(element, value) {
            var tab = Ext.getCmp('clientsettings-extra-' + element + '-update');

            if (tab) {
                if (value) {
                    tab.show();
                } else {
                    tab.hide();
                }
            }
        });
    }
});

Ext.reg('clientsettings-window-setting-update', ClientSettings.window.UpdateSetting);

ClientSettings.combo.Categories = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        url         : ClientSettings.config.connector_url,
        baseParams  : {
            action      : 'mgr/categories/getlist',
            combo       : true
        },
        fields      : ['id','name', 'name_formatted'],
        hiddenName  : 'category_id',
        pageSize    : 15,
        valueField  : 'id',
        displayField : 'name_formatted'
    });
    
    ClientSettings.combo.Categories.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.combo.Categories ,MODx.combo.ComboBox);

Ext.reg('clientsettings-combo-categories', ClientSettings.combo.Categories);

ClientSettings.combo.FieldTypes = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        store   : new Ext.data.ArrayStore({
            mode    : 'local',
            fields  : ['xtype', 'label'],
            data    : [
                ['textfield', _('clientsettings.textfield')],
                ['datefield', _('clientsettings.datefield')],
                ['timefield', _('clientsettings.timefield')],
                ['datetimefield', _('clientsettings.datetimefield')], //xdatetime
                ['passwordfield', _('clientsettings.passwordfield')], //text-password
                ['numberfield', _('clientsettings.numberfield')],
                ['textarea', _('clientsettings.textarea')],
                ['richtext', _('clientsettings.richtext')],
                ['boolean', _('clientsettings.boolean')], //combo-boolean
                ['combo', _('clientsettings.combo')], //modx-combo
                ['checkbox', _('clientsettings.checkbox')],
                ['checkboxgroup', _('clientsettings.checkboxgroup')],
                ['radiogroup', _('clientsettings.radiogroup')],
                ['resource', _('clientsettings.resource')], //modx-field-parent-change
                ['browser', _('clientsettings.browser')] //modx-combo-browser
            ]
        }),
        remoteSort  : ['label', 'asc'],
        hiddenName  : 'xtype',
        valueField  : 'xtype',
        displayField : 'label',
        mode        : 'local',
        value       : 'textfield'
    });
    
    ClientSettings.combo.FieldTypes.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.combo.FieldTypes, MODx.combo.ComboBox);

Ext.reg('clientsettings-combo-xtype', ClientSettings.combo.FieldTypes);

ClientSettings.combo.Values = function(config) {
    config = config || {};

    var id = Ext.id();

    Ext.applyIf(config, {
        id          : config.id || id,
        cls         : 'clientsettings-extra-combo',
        items       : [{
            xtype       : 'hidden',
            name        : 'values',
            id          : (config.id || id) + '-value',
            value       : config.value || '[]'
        }],
        listeners   : {
            afterrender : {
                fn          : this.decodeData,
                scope       : this
            } 
        }
    });
    
    ClientSettings.combo.Values.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.combo.Values, MODx.Panel, {
    decodeData: function() {
        var textfield = Ext.getCmp(this.config.id + '-value');

        if (textfield) {
            var data = Ext.decode(textfield.getValue() || '[]');

            if (data && data.length >= 1) {
                for (var i = 0; i < data.length; i++) {
                    this.addElement(i, data[i]);
                }
            } else {
                this.addElement(0, {});
            }
        }
    },
    encodeData: function() {
        var textfield = Ext.getCmp(this.config.id + '-value');

        if (textfield) {
            var data = [];
            var values = {
                value : [],
                label : []
            };

            this.findByType('textfield').forEach(function(element) {
                if (element.xtype === 'textfield') {
                    values[element.type].push(element.getValue());
                }
            });

            values.value.forEach(function(value, index) {
                data.push({
                    value : value,
                    label : values.label[index] || ''
                });
            });

            textfield.setValue(Ext.encode(data));
        }
    },
    addElement: function(index, data) {
        this.insert(index, this.getElement(index, data));
        this.doLayout();
        
        this.encodeData();
    },
    removeElement: function(index) {
        this.remove(index);
        this.doLayout();
        
        this.encodeData();
    },
    getElement: function(index, data) {
        var id = Ext.id();
    
        var nextBtn = {
            xtype       : 'box',
            autoEl      : {
                tag         : 'a',
                html        : '<i class="icon icon-plus"></i>',
                cls         : 'x-btn x-btn-clientsettings',
                current     : this.config.id + '-' + id
            },
            listeners   : {
                render      : {
                    fn          : function(button) {
                        button.getEl().on('click', (function(event) {
                            var index = this.items.findIndexBy(function(item) {
                                return item.id === button.autoEl.current;
                            });

                            this.addElement(index + 1, {});
                        }).bind(this));
                    },
                    scope       : this
                }
            }
        };
    
        var prevBtn = {
            xtype       : 'box',
            autoEl      : {
                tag         : 'a',
                html        : '<i class="icon icon-minus"></i>',
                cls         : 'x-btn x-btn-clientsettings',
                current     : this.config.id + '-' + id
            },
            listeners   : {
                render      : {
                    fn          : function(button) {
                        button.getEl().on('click', (function(event) {
                            var index = this.items.findIndexBy(function(item) {
                                return item.id === button.autoEl.current;
                            });

                            this.removeElement(index);
                        }).bind(this));
                    },
                    scope       : this
                }
            }
        };
    
        return {
            layout      : 'column',
            id          : this.config.id + '-' + id,
            cls         : 'clientsettings-extra-combo-item',
            defaults    : {
                layout      : 'form',
                hideLabels  : true
            },
            items       : [{
                columnWidth : .42,
                items       : [{
                    xtype       : 'textfield',
                    anchor      : '100%',
                    emptyText   : _('clientsettings.label_setting_value'),
                    type        : 'value',
                    value       : data.value || '',
                    listeners   : {
                        blur        : {
                            fn          : this.encodeData,
                            scope       : this
                        }
                    }
                }]
            }, {
                columnWidth : .42,
                items       : [{
                    xtype       : 'textfield',
                    anchor      : '100%',
                    emptyText   : _('clientsettings.label_setting_label'),
                    type        : 'label',
                    value       : data.label || '',
                    listeners   : {
                        blur        : {
                            fn          : this.encodeData,
                            scope       : this
                        }
                    }
                }]
            }, {
                columnWidth : .16,
                items       : index === 0 ? [nextBtn] : [nextBtn, prevBtn]
            }]
        };
    }
});

Ext.reg('clientsettings-combo-values', ClientSettings.combo.Values);