ClientSettings.grid.Settings = function(config) {
    config = config || {};
    
    expander = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<p class="desc">{description}</p>'
        )
    });

	config.tbar = [{
        text	: _('clientsettings.setting_create'),
        handler	: this.createSetting
    }, '->', {
    	xtype		: 'clientsettings-combo-categories',
    	name		: 'clientsettings-filter-categories',
        id			: 'clientsettings-filter-categories',
        emptyText	: _('area_filter'),
        listeners	: {
        	'select'	: {
	            	fn			: this.filterCategory,
	            	scope		: this   
		    }
		},
		width: 250
    }, '-', {
        xtype		: 'textfield',
        name 		: 'clientsettings-filter-search-settings',
        id			: 'clientsettings-filter-search-settings',
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
    	id		: 'clientsettings-filter-clear-settings',
    	text	: _('filter_clear'),
    	listeners: {
        	'click': {
        		fn		: this.clearFilter,
        		scope	: this
        	}
        }
    }];
    
    columns = new Ext.grid.ColumnModel({
        columns: [expander, {
            header		: _('clientsettings.label_label'),
            dataIndex	: 'label',
            sortable	: true,
            editable	: true,
            width		: 150,
			editor		: {
            	xtype		: 'textfield'
            }
        }, {
            header		: _('clientsettings.label_key'),
            dataIndex	: 'key',
            sortable	: true,
            editable	: false,
            width		: 100
        }, {
            header		: _('clientsettings.label_xtype'),
            dataIndex	: 'xtype',
            sortable	: true,
            editable	: true,
            fixed		: true,
			width		: 100,
            editor		: {
            	xtype		: 'clientsettings-combo-xtype'
            }
        }, {
            header		: _('clientsettings.label_active'),
            dataIndex	: 'active',
            sortable	: true,
            editable	: true,
            width		: 100,
            fixed		: true,
			renderer	: this.renderActive,
			editor		: {
            	xtype		: 'modx-combo-boolean'
            }
        }, {
            header		: _('last_modified'),
            dataIndex	: 'editedon',
            sortable	: true,
            editable	: false,
            fixed		: true,
			width		: 200
        }, {
            header		: _('clientsettings.label_category'),
            dataIndex	: 'category_name',
            sortable	: true,
            hidden		: true,
            editable	: false
        }]
    });
    
    Ext.applyIf(config, {
    	cm			: columns,
        id			: 'clientsettings-grid-admin-settings',
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
        	action		: 'mgr/settings/getList'
        },
        autosave	: true,
        save_action	: 'mgr/settings/updateFromGrid',
        fields		: ['id', 'category_id', 'category_name', 'key', 'label', 'description', 'xtype', 'exclude', 'value', 'menuindex', 'active', 'editedon'],
        paging		: true,
        pageSize	: MODx.config.default_per_page > 30 ? MODx.config.default_per_page : 30,
        sortBy		: 'menuindex',
        grouping	: true,
        groupBy		: 'category_name',
        plugins		: expander,
        singleText	: _('clientsettings.setting'),
        pluralText	: _('clientsettings.settings'),
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
	    this.getStore().baseParams.query 	= '';
	    Ext.getCmp('clientsettings-filter-categories').reset();
	    Ext.getCmp('clientsettings-filter-search-settings').reset();
        this.getBottomToolbar().changePage(1);
    },
    getMenu: function() {
        return [{
	        text	: _('clientsettings.setting_update'),
	        handler	: this.updateSetting
	    }, '-',  {
		    text	: _('clientsettings.setting_remove'),
		    handler	: this.removeSetting
		 }];
    },
    createSetting: function(btn, e) {
        if (this.createSettingWindow) {
	        this.createSettingWindow.destroy();
        }
        
        this.createSettingWindow = MODx.load({
	        xtype		: 'clientsettings-window-setting-create',
	        closeAction	:'close',
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
        
        console.log(this.menu.record);
        
        this.updateSettingWindow = MODx.load({
	        xtype		: 'clientsettings-window-setting-update',
	        record		: this.menu.record,
	        closeAction	:'close',
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
        	title 	: _('clientsettings.setting_remove'),
        	text	: _('clientsettings.setting_remove_confirm'),
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
    },
    renderActive: function(d, c) {
    	c.css = 1 == parseInt(d) || d ? 'green' : 'red';
    	
    	return 1 == parseInt(d) || d ? _('yes') : _('no');
    }
});

Ext.reg('clientsettings-grid-settings', ClientSettings.grid.Settings);

ClientSettings.window.CreateSetting = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
    	autoHeight	: true,
    	width		: 600,
        title 		: _('clientsettings.setting_create'),
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
            action		: 'mgr/settings/create'
        },
        defauls		: {
	        labelAlign	: 'top',
            border		: false
        },
        fields		: [{
            layout		: 'column',
            border		: false,
            defaults	: {
                layout		: 'form',
                labelSeparator : ''
            },
            items: [{
                columnWidth: .5,
                items		: [{
		        	layout		: 'column',
		        	border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		        	items		: [{
			        	columnWidth	: .8,
			        	items		: [{
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.label_key'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.label_key_desc'),
				        	name		: 'key',
				           	anchor		: '100%',
				        	allowBlank	: false,
				        	maxLength	: 75
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.label_key_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
					    columnWidth	: .2,
					        style		: 'margin-right: 0;',
					        items		: [{
						        xtype		: 'checkbox',
					            fieldLabel	: _('clientsettings.label_active'),
					            description	: MODx.expandHelp ? '' : _('clientsettings.label_active_desc'),
					            name		: 'active',
					            inputValue	: 1,
					            checked		: true
					        }, {
					        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
					            html		: _('clientsettings.label_active_desc'),
					            cls			: 'desc-under'
					        }]

				    }]
				}, {
		        	xtype		: 'textfield',
		        	fieldLabel	: _('clientsettings.label_label'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.label_label_desc'),
		        	name		: 'label',
		           	anchor		: '100%',
		        	allowBlank	: false,
		        	maxLength	: 75
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_label_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textarea',
		        	fieldLabel	: _('clientsettings.label_description'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.label_description_desc'),
		        	name		: 'description',
		        	anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.label_description_desc'),
		        	cls			: 'desc-under'
		        }, {
		            xtype		: 'clientsettings-combo-categories',
		            fieldLabel	: _('clientsettings.label_category'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.label_category_desc'),
		            name		: 'category_id',
		            anchor		: '100%',
		            allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_category_desc'),
		            cls			: 'desc-under'
		        }]
		    }, {
		    	columnWidth: .5,
		    	style		: 'margin-right: 0;',
                items		: [{
		        	xtype		: 'clientsettings-combo-xtype',
		        	fieldLabel	: _('clientsettings.label_xtype'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.label_xtype_desc'),
		        	name		: 'xtype',
		        	anchor		: '100%',
		        	allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_xtype_desc'),
		            cls			: 'desc-under'
		        }, {
			        xtype		: 'textfield',
		            fieldLabel	: _('clientsettings.label_exclude'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.label_exclude_desc'),
		            name		: 'exclude',
		            anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_exclude_desc'),
		            cls			: 'desc-under'
		        }, {
			        xtype		: 'numberfield',
		            fieldLabel	: _('clientsettings.label_menuindex'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.label_menuindex_desc'),
		            name		: 'menuindex',
		            anchor		: '100%',
		            allowBlank	: false,
		            minValue	: 0,
		            value		: 0
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_menuindex_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textarea',
		        	fieldLabel	: _('clientsettings.label_value'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.label_value_desc'),
		        	name		: 'value',
		        	anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.label_value_desc'),
		        	cls			: 'desc-under'
		        }]    
		    }]
	    }]
    });
    
    ClientSettings.window.CreateSetting.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.CreateSetting, MODx.Window);

Ext.reg('clientsettings-window-setting-create', ClientSettings.window.CreateSetting);

ClientSettings.window.CreateUpdate = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
    	autoHeight	: true,
    	width		: 600,
        title 		: _('clientsettings.setting_update'),
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
            action		: 'mgr/settings/update'
        },
        defauls		: {
	        labelAlign	: 'top',
            border		: false
        },
        fields		: [{
	        xtype		: 'hidden',
	        name		: 'id'
	    }, {
            layout		: 'column',
            border		: false,
            defaults	: {
                layout		: 'form',
                labelSeparator : ''
            },
            items: [{
                columnWidth	: .5,
                items		: [{
		        	layout		: 'column',
		        	border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		        	items		: [{
			        	columnWidth	: .8,
			        	items		: [{
				        	xtype		: 'statictextfield',
				        	fieldLabel	: _('clientsettings.label_key'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.label_key_desc'),
				        	name		: 'key',
				           	anchor		: '100%',
				        	allowBlank	: false,
				        	maxLength	: 75
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.label_key_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
					    columnWidth	: .2,
					        style		: 'margin-right: 0;',
					        items		: [{
						        xtype		: 'checkbox',
					            fieldLabel	: _('clientsettings.label_active'),
					            description	: MODx.expandHelp ? '' : _('clientsettings.label_active_desc'),
					            name		: 'active',
					            inputValue	: 1
					        }, {
					        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
					            html		: _('clientsettings.label_active_desc'),
					            cls			: 'desc-under'
					        }]

				    }]
				}, {
		        	xtype		: 'textfield',
		        	fieldLabel	: _('clientsettings.label_label'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.label_label_desc'),
		        	name		: 'label',
		           	anchor		: '100%',
		        	allowBlank	: false,
		        	maxLength	: 75
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_label_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textarea',
		        	fieldLabel	: _('clientsettings.label_description'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.label_description_desc'),
		        	name		: 'description',
		        	anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.label_description_desc'),
		        	cls			: 'desc-under'
		        }, {
		            xtype		: 'clientsettings-combo-categories',
		            fieldLabel	: _('clientsettings.label_category'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.label_category_desc'),
		            name		: 'category_id',
		            anchor		: '100%',
		            allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_category_desc'),
		            cls			: 'desc-under'
		        }]
		    }, {
		    	columnWidth	: .5,
		    	style		: 'margin-right: 0;',
                items		: [{
		        	xtype		: 'clientsettings-combo-xtype',
		        	fieldLabel	: _('clientsettings.label_xtype'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.label_xtype_desc'),
		        	name		: 'xtype',
		        	anchor		: '100%',
		        	allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_xtype_desc'),
		            cls			: 'desc-under'
		        }, {
			        xtype		: 'textfield',
		            fieldLabel	: _('clientsettings.label_exclude'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.label_exclude_desc'),
		            name		: 'exclude',
		            anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_exclude_desc'),
		            cls			: 'desc-under'
		        }, {
			        xtype		: 'numberfield',
		            fieldLabel	: _('clientsettings.label_menuindex'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.label_menuindex_desc'),
		            name		: 'menuindex',
		            anchor		: '100%',
		            allowBlank	: false,
		            minValue	: 0
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.label_menuindex_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textarea',
		        	fieldLabel	: _('clientsettings.label_value'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.label_value_desc'),
		        	name		: 'value',
		        	anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.label_value_desc'),
		        	cls			: 'desc-under'
		        }]    
		    }]
	    }]
    });
    
    ClientSettings.window.CreateUpdate.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.CreateUpdate, MODx.Window);

Ext.reg('clientsettings-window-setting-update', ClientSettings.window.CreateUpdate);

ClientSettings.combo.Categories = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        url			: ClientSettings.config.connectorUrl,
        baseParams 	: {
            action		: 'mgr/categories/getlist',
            combo		: true
        },
        fields		: ['id','name'],
        hiddenName	: 'category_id',
        pageSize	: 15,
        valueField	: 'id',
        displayField: 'name'
    });
    
    ClientSettings.combo.Categories.superclass.constructor.call(this,config);
};

Ext.extend(ClientSettings.combo.Categories ,MODx.combo.ComboBox);

Ext.reg('clientsettings-combo-categories', ClientSettings.combo.Categories);

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