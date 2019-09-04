ClientSettings.grid.Categories = function(config) {
    config = config || {};

    config.tbar = [{
        text        : _('clientsettings.category_create'),
        cls         : 'primary-button',
        handler     : this.createCategory,
        scope       : this
    }, '->', {
        xtype       : 'textfield',
        name        : 'clientsettings-filter-categories-search',
        id          : 'clientsettings-filter-categories-search',
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
        id          : 'clientsettings-filter-categories-clear',
        text        : _('filter_clear'),
        listeners   : {
            'click'     : {
                fn          : this.clearFilter,
                scope       : this
            }
        }
    }];

    var columns = new Ext.grid.ColumnModel({
        columns     : [{
            header      : _('clientsettings.label_category_name'),
            dataIndex   : 'name_formatted',
            sortable    : true,
            editable    : false,
            width       : 250,
            fixed       : true
        }, {
            header      : _('clientsettings.label_category_description'),
            dataIndex   : 'description_formatted',
            sortable    : false,
            editable    : false,
            width       : 250
        }, {
            header      : _('clientsettings.label_category_settings'),
            dataIndex   : 'settings',
            sortable    : true,
            editable    : false,
            width       : 100,
            fixed       : true
        }, {
            header      : _('clientsettings.label_category_active'),
            dataIndex   : 'active',
            sortable    : true,
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
            sortable    : true,
            editable    : false,
            fixed       : true,
            width       : 200,
            renderer    : this.renderDate
        }]
    });
    
    Ext.applyIf(config, {
        cm          : columns,
        id          : 'clientsettings-grid-admin-categories',
        url         : ClientSettings.config.connector_url,
        baseParams  : {
            action      : 'mgr/categories/getlist'
        },
        autosave    : true,
        save_action : 'mgr/categories/updatefromgrid',
        fields      : ['id', 'name', 'description', 'exclude', 'settings', 'menuindex', 'active', 'editedon', 'name_formatted', 'description_formatted'],
        paging      : true,
        pageSize    : MODx.config.default_per_page > 30 ? MODx.config.default_per_page : 30,
        sortBy      : 'menuindex',
        refreshGrid : [],
        enableDragDrop : true,
        ddGroup     : 'clientsettings-grid-admin-categories'
    });
    
    ClientSettings.grid.Categories.superclass.constructor.call(this, config);
    
    this.on('afterrender', this.sortCategory, this);
};

Ext.extend(ClientSettings.grid.Categories, MODx.grid.Grid, {
    filterSearch: function(tf, nv, ov) {
        this.getStore().baseParams.query = tf.getValue();
        
        this.getBottomToolbar().changePage(1);
    },
    clearFilter: function() {
        this.getStore().baseParams.query = '';
        
        Ext.getCmp('clientsettings-filter-categories-search').reset();
        
        this.getBottomToolbar().changePage(1);
    },
    getMenu: function() {
        return [{
            text    : '<i class="x-menu-item-icon icon icon-edit"></i>' + _('clientsettings.category_update'),
            handler : this.updateCategory,
            scope   : this
        }, '-', {
            text    : '<i class="x-menu-item-icon icon icon-times"></i>' + _('clientsettings.category_remove'),
            handler : this.removeCategory,
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
    sortCategory: function() {
        new Ext.dd.DropTarget(this.getView().mainBody, {
            ddGroup     : this.config.ddGroup,
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
                            action      : 'mgr/categories/sort',
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
    createCategory: function(btn, e) {
        if (this.createCategoryWindow) {
            this.createCategoryWindow.destroy();
        }
        
        this.createCategoryWindow = MODx.load({
            xtype       : 'clientsettings-window-category-create',
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
        
        this.createCategoryWindow.show(e.target);
    },
    updateCategory: function(btn, e) {
        if (this.updateCategoryWindow) {
            this.updateCategoryWindow.destroy();
        }
        
        this.updateCategoryWindow = MODx.load({
            xtype       : 'clientsettings-window-category-update',
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
        
        this.updateCategoryWindow.setValues(this.menu.record);
        this.updateCategoryWindow.show(e.target);
    },
    removeCategory: function() {
        MODx.msg.confirm({
            title       : _('clientsettings.category_remove'),
            text        : _('clientsettings.category_remove_confirm'),
            url         : ClientSettings.config.connector_url,
            params      : {
                action      : 'mgr/categories/remove',
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
    renderDate: function(a) {
        if (Ext.isEmpty(a)) {
            return '—';
        }
        
        return a;
    }
});

Ext.reg('clientsettings-grid-categories', ClientSettings.grid.Categories);

ClientSettings.window.CreateCategory = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        autoHeight  : true,
        title       : _('clientsettings.category_create'),
        url         : ClientSettings.config.connector_url,
        baseParams  : {
            action      : 'mgr/categories/create'
        },
        fields      : [{
            layout      : 'column',
            defaults    : {
                layout      : 'form',
                labelSeparator : ''
            },
            items       : [{
                columnWidth : .85,
                items       : [{
                    xtype       : 'textfield',
                    fieldLabel  : _('clientsettings.label_category_name'),
                    description : MODx.expandHelp ? '' : _('clientsettings.label_category_name_desc'),
                    name        : 'name',
                    anchor      : '100%',
                    allowBlank  : false
                }, {
                    xtype       : MODx.expandHelp ? 'label' : 'hidden',
                    html        : _('clientsettings.label_category_name_desc'),
                    cls         : 'desc-under'
                }]
            }, {
                columnWidth : .15,
                items       : [{
                    xtype       : 'checkbox',
                    fieldLabel  : _('clientsettings.label_category_active'),
                    description : MODx.expandHelp ? '' : _('clientsettings.label_category_active_desc'),
                    name        : 'active',
                    inputValue  : 1,
                    checked     : true
                }, {
                    xtype       : MODx.expandHelp ? 'label' : 'hidden',
                    html        : _('clientsettings.label_category_active_desc'),
                    cls         : 'desc-under'
                }]
            }]
        }, {
            xtype       : 'textarea',
            fieldLabel  : _('clientsettings.label_category_description'),
            description : MODx.expandHelp ? '' : _('clientsettings.label_category_description_desc'),
            name        : 'description',
            anchor      : '100%'
        }, {
            xtype       : MODx.expandHelp ? 'label' : 'hidden',
            html        : _('clientsettings.label_category_description_desc'),
            cls         : 'desc-under'
        }, {
            xtype       : 'textfield',
            fieldLabel  : _('clientsettings.label_category_exclude'),
            description : MODx.expandHelp ? '' : _('clientsettings.label_category_exclude_desc'),
            name        : 'exclude',
            anchor      : '100%'
        }, {
            xtype       : MODx.expandHelp ? 'label' : 'hidden',
            html        : _('clientsettings.label_category_exclude_desc'),
            cls         : 'desc-under'
        }]
    });
    
    ClientSettings.window.CreateCategory.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.CreateCategory, MODx.Window);

Ext.reg('clientsettings-window-category-create', ClientSettings.window.CreateCategory);

ClientSettings.window.UpdateCategory = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        autoHeight  : true,
        title       : _('clientsettings.category_create'),
        url         : ClientSettings.config.connector_url,
        baseParams  : {
            action      : 'mgr/categories/update'
        },
        fields      : [{
            xtype       : 'hidden',
            name        : 'id'
        }, {
            layout      : 'column',
            defaults    : {
                layout      : 'form',
                labelSeparator : ''
            },
            items       : [{
                columnWidth : .85,
                items       : [{
                    xtype       : 'textfield',
                    fieldLabel  : _('clientsettings.label_category_name'),
                    description : MODx.expandHelp ? '' : _('clientsettings.label_category_name_desc'),
                    name        : 'name',
                    anchor      : '100%',
                    allowBlank  : false
                }, {
                    xtype       : MODx.expandHelp ? 'label' : 'hidden',
                    html        : _('clientsettings.label_category_name_desc'),
                    cls         : 'desc-under'
                }]
            }, {
                columnWidth : .15,
                items       : [{
                    xtype       : 'checkbox',
                    fieldLabel  : _('clientsettings.label_category_active'),
                    description : MODx.expandHelp ? '' : _('clientsettings.label_category_active_desc'),
                    name        : 'active',
                    inputValue  : 1
                }, {
                    xtype       : MODx.expandHelp ? 'label' : 'hidden',
                    html        : _('clientsettings.label_category_active_desc'),
                    cls         : 'desc-under'
                }]
            }]
        }, {
            xtype       : 'textarea',
            fieldLabel  : _('clientsettings.label_category_description'),
            description : MODx.expandHelp ? '' : _('clientsettings.label_category_description_desc'),
            name        : 'description',
            anchor      : '100%'
        }, {
            xtype       : MODx.expandHelp ? 'label' : 'hidden',
            html        : _('clientsettings.label_category_description_desc'),
            cls         : 'desc-under'
        }, {
            xtype       : 'textfield',
            fieldLabel  : _('clientsettings.label_category_exclude'),
            description : MODx.expandHelp ? '' : _('clientsettings.label_category_exclude_desc'),
            name        : 'exclude',
            anchor      : '100%'
        }, {
            xtype       : MODx.expandHelp ? 'label' : 'hidden',
            html        : _('clientsettings.label_category_exclude_desc'),
            cls         : 'desc-under'
        }]
    });
    
    ClientSettings.window.UpdateCategory.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.UpdateCategory, MODx.Window);

Ext.reg('clientsettings-window-category-update', ClientSettings.window.UpdateCategory);