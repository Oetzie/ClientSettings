ClientSettings.grid.Settings = function(config) {
    config = config || {};
    
    this.exp = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<p class="desc">{description}</p>'
        )
    });

	config.tbar = [{
        text	: _('clientsettings.admin_setting_create'),
        handler	: this.createSetting
    }];
    
    config.tbar.push('->', {
    	xtype		: 'clientsettings-combo-areas',
    	name		: 'clientsettings-settings-filter-area',
        id			: 'clientsettings-settings-filter-area',
        emptyText	: _('area_filter'),
        listeners	: {
        	'select'	: {
	            	fn			: this.filterArea,
	            	scope		: this   
		    }
		},
		width: 250
    }, '-', {
        xtype		: 'textfield',
        name 		: 'clientsettings-settings-filter-search',
        id			: 'clientsettings-settings-filter-search',
        emptyText	: _('search_by_key')+'...',
        listeners	: {
	        'change'	: {
	        	fn			: this.filterSearch,
	        	scope		: this
	        },
	        'render'	: {
		        fn			: function(cmp) {
			        new Ext.KeyMap(cmp.getEl(), {
				        key		: Ext.EventObject.ENTER,
			        	fn		: this.blur,
				        scope	: cmp
			        });
		        },
		        scope	: this
	        }
        }
    }, {
    	xtype	: 'button',
    	id		: 'clientsettings-settings-filter-clear',
    	text	: _('filter_clear'),
    	listeners: {
        	'click': {
        		fn		: this.clearFilter,
        		scope	: this
        	}
        }
    });
    
    this.cm = new Ext.grid.ColumnModel({
        columns: [this.exp, {
            header		: _('clientsettings.label'),
            dataIndex	: 'label',
            sortable	: true,
            editable	: false,
            width		: 150
        }, {
            header		: _('clientsettings.key'),
            dataIndex	: 'key',
            sortable	: true,
            editable	: false,
            width		: 150
        }, {
            header		: _('clientsettings.xtype'),
            dataIndex	: 'xtype',
            sortable	: true,
            editable	: true,
            fixed		: true,
			width		: 200,
            editor		: {
            	xtype		: 'clientsettings-combo-xtype'
            }
        }, {
            header		: _('last_modified'),
            dataIndex	: 'editedon',
            sortable	: true,
            editable	: false,
            fixed		: true,
			width		: 200
        }, {
            header		: _('clientsettings.area'),
            dataIndex	: 'area_name',
            sortable	: true,
            hidden		: true,
            editable	: false
        }]
    });
    
    Ext.applyIf(config, {
    	cm			: this.cm,
        id			: 'clientsettings-grid-admin-settings',
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
        	action		: 'mgr/settings/getList'
        },
        autosave	: true,
        save_action	: 'mgr/settings/updateFromGrid',
        fields		: ['id', 'area_id', 'key', 'label', 'description', 'xtype', 'exclude', 'value', 'menuindex', 'editedon', 'area_name'],
        paging		: true,
        pageSize	: MODx.config.default_per_page > 30 ? MODx.config.default_per_page : 30,
        grouping	: true,
        groupBy		: 'area_name',
        plugins		: this.exp,
        singleText	: _('clientsettings.admin_setting'),
        pluralText	: _('clientsettings.admin_settings'),
        tools		: [{
            id			: 'plus',
            qtip 		: _('expand_all'),
            handler		: this.expandAll,
            scope		: this
        }, {
            id			: 'minus',
            hidden		: true,
            qtip 		: _('collapse_all'),
            handler		: this.collapseAll,
            scope		: this
        }]
    });
    
    ClientSettings.grid.Settings.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.grid.Settings, MODx.grid.Grid, {
	filterArea: function(tf, nv, ov) {
        this.getStore().baseParams.area = tf.getValue();
        this.getBottomToolbar().changePage(1);
    },
    filterSearch: function(tf, nv, ov) {
        this.getStore().baseParams.search = tf.getValue();
        this.getBottomToolbar().changePage(1);
    },
    clearFilter: function() {
	    this.getStore().baseParams.area 	= '';
	    this.getStore().baseParams.search 	= '';
	    Ext.getCmp('clientsettings-settings-filter-area').reset();
	    Ext.getCmp('clientsettings-settings-filter-search').reset();
        this.getBottomToolbar().changePage(1);
    },
    getMenu: function() {
        return [{
	        text	: _('clientsettings.admin_setting_update'),
	        handler	: this.updateSetting
	    }, '-',  {
		    text	: _('clientsettings.admin_setting_remove'),
		    handler	: this.removeSetting
		 }];
    },
    createSetting: function(btn, e) {
        if (this.createSettingWindow) {
	        this.createSettingWindow.destroy();
        }
        
        this.createSettingWindow = MODx.load({
	        xtype		: 'clientsettings-window-admin-setting-create',
	        listeners	: {
		        'success'	: {
		        	fn			:this.refresh,
		        	scope		:this
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
	        xtype		: 'clientsettings-window-admin-setting-update',
	        record		: this.menu.record,
	        listeners	: {
		        'success'	: {
		        	fn			:this.refresh,
		        	scope		:this
		        }
	         }
        });
        
        this.updateSettingWindow.setValues(this.menu.record);
        this.updateSettingWindow.show(e.target);
    },
    removeSetting: function() {
    	MODx.msg.confirm({
        	title 	: _('clientsettings.admin_setting_remove'),
        	text	: _('clientsettings.admin_setting_remove_confirm'),
        	url		: this.config.url,
        	params	: {
            	action	: 'mgr/settings/remove',
            	id		: this.menu.record.id
            },
            listeners: {
            	'success': {
            		fn		: this.refresh,
            		scope	: this
            	}
            }
    	});
    }
});

Ext.reg('clientsettings-grid-admin-setting', ClientSettings.grid.Settings);

ClientSettings.window.CreateSetting = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
    	width		: 600,
        title 		: _('clientsettings.admin_setting_create'),
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
            action		: 'mgr/settings/create'
        },
        fields		: [{
            layout		: 'column',
            border		: false,
            defaults	: {
                layout		: 'form',
                labelAlign	: 'top',
                anchor		: '100%',
                border		: false
            },
            items: [{
                columnWidth: .5,
                items: [{
		        	xtype		: 'textfield',
		        	fieldLabel	: _('clientsettings.key'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.key_desc'),
		        	name		: 'key',
		           	anchor		: '100%',
		        	allowBlank	: false,
		        	maxLength	: 75
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.key_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textfield',
		        	fieldLabel	: _('clientsettings.label'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.label_desc'),
		        	name		: 'label',
		           	anchor		: '100%',
		        	allowBlank	: false,
		        	maxLength	: 75
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textarea',
		        	fieldLabel	: _('clientsettings.description'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.description_desc'),
		        	name		: 'description',
		        	anchor		: '100%',
		        	allowBlank	: true
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.description_desc'),
		        	cls			: 'desc-under'
		        }, {
		            xtype		: 'clientsettings-combo-areas',
		            fieldLabel	: _('clientsettings.area'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.area_desc'),
		            name		: 'area_id',
		            anchor		: '100%',
		            allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.area_desc'),
		            cls			: 'desc-under'
		        }]
		    }, {
		    	columnWidth: .5,
                items: [{
		        	xtype		: 'clientsettings-combo-xtype',
		        	fieldLabel	: _('clientsettings.xtype'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.xtype_desc'),
		        	name		: 'xtype',
		        	anchor		: '100%',
		        	allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.xtype_desc'),
		            cls			: 'desc-under'
		        }, {
			        xtype		: 'textfield',
		            fieldLabel	: _('clientsettings.exclude'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.exclude_desc'),
		            name		: 'exclude',
		            anchor		: '100%',
		            allowBlank	: true
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.exclude_desc'),
		            cls			: 'desc-under'
		        }, {
			        xtype		: 'numberfield',
		            fieldLabel	: _('clientsettings.menuindex'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.menuindex_desc'),
		            name		: 'menuindex',
		            anchor		: '100%',
		            allowBlank	: false,
		            minValue	: 0,
		            maxValue	: 9999999999,
		            value		: 0
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.menuindex_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textarea',
		        	fieldLabel	: _('clientsettings.value'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.value_desc'),
		        	name		: 'value',
		        	anchor		: '100%',
		        	allowBlank	: true
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.value_desc'),
		        	cls			: 'desc-under'
		        }]    
		    }]
	    }]
    });
    
    ClientSettings.window.CreateSetting.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.CreateSetting, MODx.Window);

Ext.reg('clientsettings-window-admin-setting-create', ClientSettings.window.CreateSetting);

ClientSettings.window.CreateUpdate = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
    	width		: 600,
        title 		: _('clientsettings.admin_setting_update'),
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
            action		: 'mgr/settings/update'
        },
        fields		: [{
            layout		: 'column',
            border		: false,
            defaults	: {
                layout		: 'form',
                labelAlign	: 'top',
                anchor		: '100%',
                border		: false
            },
            items: [{
                columnWidth: .5,
                items: [{
		            xtype		: 'hidden',
		            name		: 'id'
		        }, {
		        	xtype		: 'statictextfield',
		        	fieldLabel	: _('clientsettings.key'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.key_desc'),
		        	name		: 'key',
		           	anchor		: '100%',
		        	allowBlank	: false,
		        	maxLength	: 75
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.key_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textfield',
		        	fieldLabel	: _('clientsettings.label'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.label_desc'),
		        	name		: 'label',
		           	anchor		: '100%',
		        	allowBlank	: false,
		        	maxLength	: 75
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textarea',
		        	fieldLabel	: _('clientsettings.description'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.description_desc'),
		        	name		: 'description',
		        	anchor		: '100%',
		        	allowBlank	: true
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.description_desc'),
		        	cls			: 'desc-under'
		        }, {
		            xtype		: 'clientsettings-combo-areas',
		            fieldLabel	: _('clientsettings.area'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.area_desc'),
		            name		: 'area_id',
		            anchor		: '100%',
		            allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('area_desc'),
		            cls			: 'desc-under'
		        }]
		    }, {
		    	columnWidth: .5,
                items: [{
		        	xtype		: 'clientsettings-combo-xtype',
		        	fieldLabel	: _('clientsettings.xtype'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.xtype_desc'),
		        	name		: 'xtype',
		        	anchor		: '100%',
		        	allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.xtype_desc'),
		            cls			: 'desc-under'
		        }, {
			        xtype		: 'textfield',
		            fieldLabel	: _('clientsettings.exclude'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.exclude_desc'),
		            name		: 'exclude',
		            anchor		: '100%',
		            allowBlank	: true
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.exclude_desc'),
		            cls			: 'desc-under'
		        }, {
			        xtype		: 'numberfield',
		            fieldLabel	: _('clientsettings.menuindex'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.menuindex_desc'),
		            name		: 'menuindex',
		            anchor		: '100%',
		            allowBlank	: false,
		            minValue	: 0,
		            maxValue	: 9999999999
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.menuindex_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textarea',
		        	fieldLabel	: _('clientsettings.value'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.value_desc'),
		        	name		: 'value',
		        	anchor		: '100%',
		        	allowBlank	: true
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.value_desc'),
		        	cls			: 'desc-under'
		        }]    
		    }]
	    }]
    });
    
    ClientSettings.window.CreateUpdate.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.CreateUpdate, MODx.Window);

Ext.reg('clientsettings-window-admin-setting-update', ClientSettings.window.CreateUpdate);

ClientSettings.combo.Areas = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        url			: ClientSettings.config.connectorUrl,
        baseParams 	: {
            action		: 'mgr/areas/getlist',
            combo		: true
        },
        fields		: ['id','name'],
        hiddenName	: 'area_id',
        pageSize	: 15,
        valueField	: 'id',
        displayField: 'name'
    });
    
    ClientSettings.combo.Areas.superclass.constructor.call(this,config);
};

Ext.extend(ClientSettings.combo.Areas ,MODx.combo.ComboBox);

Ext.reg('clientsettings-combo-areas', ClientSettings.combo.Areas);

ClientSettings.combo.FieldTypes = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        store: new Ext.data.ArrayStore({
            mode	: 'local',
            fields	: ['xtype','label'],
            data	: [
               	['textfield', _('textfield')],
                ['textarea', _('textarea')],
                ['combo-boolean', _('yesno')],
                ['text-password', _('password')],
                ['numberfield', _('clientsettings.number')],
                ['modx-combo', _('list')]
            ]
        }),
        remoteSort	: ['label', 'asc'],
        hiddenName	: 'xtype',
        valueField	: 'xtype',
        displayField: 'label',
        mode		: 'local',
        value		: 'textfield'
    });
    
    ClientSettings.combo.FieldTypes.superclass.constructor.call(this,config);
};

Ext.extend(ClientSettings.combo.FieldTypes, MODx.combo.ComboBox);

Ext.reg('clientsettings-combo-xtype', ClientSettings.combo.FieldTypes);