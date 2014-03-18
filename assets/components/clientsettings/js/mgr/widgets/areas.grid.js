ClientSettings.grid.Areas = function(config) {
    config = config || {};

	config.tbar = [{
        text	: _('clientsettings.admin_area_create'),
        handler	: this.createArea
    }, '->', {
        xtype		: 'textfield',
        name 		: 'clientsettings-areas-filter-search',
        id			: 'clientsettings-areas-filter-search',
        emptyText	: _('search')+'...',
        listeners	: {
	        'change'	: {
	        	fn			: this.filter,
	        	scope		: this
	        },
	        'render'		: {
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
    	id		: 'clientsettings-areas-filter-clear',
    	text	: _('filter_clear'),
    	listeners: {
        	'click': {
        		fn		: this.clearFilter,
        		scope	: this
        	}
        }
    }];

    this.cm = new Ext.grid.ColumnModel({
        columns: [{
            header		: _('clientsettings.label_name'),
            dataIndex	: 'name',
            sortable	: true,
            editable	: true,
            width		: 150,
            editor		: {
            	xtype		: 'textfield'
            }
        }, {
            header		: _('clientsettings.label_description'),
            dataIndex	: 'description',
            sortable	: true,
            editable	: true,
            width		: 250,
            editor		: {
            	xtype		: 'textfield'
            }
        }, {
            header		: _('last_modified'),
            dataIndex	: 'editedon',
            sortable	: true,
            editable	: false,
            fixed		: true,
			width		: 200
        }]
    });
    
    Ext.applyIf(config, {
    	cm			: this.cm,
        id			: 'clientsettings-grid-admin-areas',
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
        	action		: 'mgr/areas/getList'
        },
        autosave	: true,
        save_action	: 'mgr/areas/updateFromGrid',
        
        fields		: ['id', 'name', 'description', 'menuindex', 'editedon'],
        paging		: true,
        pageSize	: MODx.config.default_per_page > 30 ? MODx.config.default_per_page : 30
    });
    
    ClientSettings.grid.Areas.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.grid.Areas, MODx.grid.Grid, {
    filter: function(tf, nv, ov) {
        this.getStore().baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
    },
    clearFilter: function() {
	    this.getStore().baseParams.query = '';
	    Ext.getCmp('clientsettings-areas-filter-search').reset();
        this.getBottomToolbar().changePage(1);
    },
    getMenu: function() {
        return [{
	        text	: _('clientsettings.admin_area_update'),
	        handler	: this.updateArea
	    }, '-', {
		    text	: _('clientsettings.admin_area_remove'),
		    handler	: this.removeArea
		 }];
    },
    createArea: function(btn, e) {
        if (this.updateAreaWindow) {
	        this.updateAreaWindow.destroy();
        }
        
        this.updateAreaWindow = MODx.load({
	        xtype		: 'clientsettings-window-admin-area-create',
	        listeners	: {
		        'success'	: {
		        	fn			:this.refresh,
		        	scope		:this
		        }
	         }
        });
        
        
        this.updateAreaWindow.show(e.target);
    },
    updateArea: function(btn, e) {
        if (this.createAreaWindow) {
	        this.createAreaWindow.destroy();
        }
        
        this.createAreaWindow = MODx.load({
	        xtype		: 'clientsettings-window-admin-area-update',
	        record		: this.menu.record,
	        listeners	: {
		        'success'	: {
		        	fn			:this.refresh,
		        	scope		:this
		        }
	         }
        });
        
        this.createAreaWindow.setValues(this.menu.record);
        this.createAreaWindow.show(e.target);
    },
    removeArea: function() {
    	MODx.msg.confirm({
        	title 	: _('clientsettings.admin_area_remove'),
        	text	: _('clientsettings.admin_area_remove_confirm'),
        	url		: this.config.url,
        	params	: {
            	action	: 'mgr/areas/remove',
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

Ext.reg('clientsettings-grid-admin-area', ClientSettings.grid.Areas);

ClientSettings.window.CreateArea = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        title 		: _('clientsettings.admin_area_create'),
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
            action		: 'mgr/areas/create'
        },
        fields		: [{
        	xtype		: 'textfield',
        	fieldLabel	: _('clientsettings.label_name'),
        	description	: MODx.expandHelp ? '' : _('clientsettings.label_name_desc'),
        	name		: 'name',
        	anchor		: '100%',
        	allowBlank	: false,
        	maxLength	: 75
        }, {
        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
            html		: _('clientsettings.label_name_desc'),
            cls			: 'desc-under'
        }, {
	        xtype		: 'numberfield',
            fieldLabel	: _('clientsettings.label_menuindex'),
            description	: MODx.expandHelp ? '' : _('clientsettings.label_menuindex_desc'),
            name		: 'menuindex',
            anchor		: '100%',
            allowBlank	: false,
            minValue	: 0,
            maxValue	: 9999999999,
            value		: 0
        }, {
        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
            html		: _('clientsettings.label_menuindex_desc'),
            cls			: 'desc-under'
        }, {
        	xtype		: 'textarea',
        	fieldLabel	: _('clientsettings.label_description'),
        	description	: MODx.expandHelp ? '' : _('clientsettings.label_description_desc'),
        	name		: 'description',
        	anchor		: '100%',
        	allowBlank	: true
        }, {
        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
        	html		: _('clientsettings.label_description_desc'),
        	cls			: 'desc-under'
        }]
    });
    
    ClientSettings.window.CreateArea.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.CreateArea, MODx.Window);

Ext.reg('clientsettings-window-admin-area-create', ClientSettings.window.CreateArea);

ClientSettings.window.UpdateArea = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        title 		: _('clientsettings.admin_area_create'),
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
            action		: 'mgr/areas/update'
        },
        fields		: [{
            xtype		: 'hidden',
            name		: 'id'
        }, {
        	xtype		: 'textfield',
        	fieldLabel	: _('clientsettings.label_name'),
        	description	: MODx.expandHelp ? '' : _('clientsettings.label_name_desc'),
        	name		: 'name',
        	anchor		: '100%',
        	allowBlank	: false,
        	maxLength	: 75
        }, {
        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
            html		: _('clientsettings.label_name_desc'),
            cls			: 'desc-under'
        }, {
	        xtype		: 'numberfield',
            fieldLabel	: _('clientsettings.label_menuindex'),
            description	: MODx.expandHelp ? '' : _('clientsettings.label_menu_desc'),
            name		: 'menuindex',
            anchor		: '100%',
            allowBlank	: false,
            minValue	: 0,
            maxValue	: 9999999999
        }, {
        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
            html		: _('clientsettings.label_menuindex_desc'),
            cls			: 'desc-under'
        }, {
        	xtype		: 'textarea',
        	fieldLabel	: _('clientsettings.label_description'),
        	description	: MODx.expandHelp ? '' : _('clientsettings.label_description_desc'),
        	name		: 'description',
        	anchor		: '100%',
        	allowBlank	: true
        }, {
        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
        	html		: _('clientsettings.label_description_desc'),
        	cls			: 'desc-under'
        }]
    });
    
    ClientSettings.window.UpdateArea.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.UpdateArea, MODx.Window);

Ext.reg('clientsettings-window-admin-area-update', ClientSettings.window.UpdateArea);