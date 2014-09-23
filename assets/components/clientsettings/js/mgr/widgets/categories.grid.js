ClientSettings.grid.Categories = function(config) {
    config = config || {};

	config.tbar = [{
        text	: _('clientsettings.category_create'),
        handler	: this.createCategory
    }, '->', {
        xtype		: 'textfield',
        name 		: 'clientsettings-filter-search-categories',
        id			: 'clientsettings-filter-search-categories',
        emptyText	: _('search')+'...',
        listeners	: {
	        'change'	: {
	        	fn			: this.filterSearch,
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
    	id		: 'clientsettings-filter-clear-categories',
    	text	: _('filter_clear'),
    	listeners: {
        	'click': {
        		fn		: this.clearFilter,
        		scope	: this
        	}
        }
    }];

    columns = new Ext.grid.ColumnModel({
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
        }]
    });
    
    Ext.applyIf(config, {
    	cm			: columns,
        id			: 'clientsettings-grid-admin-categories',
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
        	action		: 'mgr/categories/getList'
        },
        autosave	: true,
        save_action	: 'mgr/categories/updateFromGrid',
        fields		: ['id', 'name', 'description', 'menuindex', 'active', 'editedon'],
        paging		: true,
        pageSize	: MODx.config.default_per_page > 30 ? MODx.config.default_per_page : 30,
        sortBy		: 'menuindex'
    });
    
    ClientSettings.grid.Categories.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.grid.Categories, MODx.grid.Grid, {
    filterSearch: function(tf, nv, ov) {
        this.getStore().baseParams.query = tf.getValue();
        this.getBottomToolbar().changePage(1);
    },
    clearFilter: function() {
	    this.getStore().baseParams.query = '';
	    Ext.getCmp('clientsettings-filter-search-categories').reset();
        this.getBottomToolbar().changePage(1);
    },
    getMenu: function() {
        return [{
	        text	: _('clientsettings.category_update'),
	        handler	: this.updateCategory
	    }, '-', {
		    text	: _('clientsettings.category_remove'),
		    handler	: this.removeCategory
		 }];
    },
    createCategory: function(btn, e) {
        if (this.updateCategoryWindow) {
	        this.updateCategoryWindow.destroy();
        }
        
        this.updateCategoryWindow = MODx.load({
	        xtype		: 'clientsettings-window-category-create',
	        closeAction	:'close',
	        listeners	: {
		        'success'	: {
		        	fn			:this.refresh,
		        	scope		:this
		        }
	         }
        });
        
        
        this.updateCategoryWindow.show(e.target);
    },
    updateCategory: function(btn, e) {
        if (this.createCategoryWindow) {
	        this.createCategoryWindow.destroy();
        }
        
        this.createCategoryWindow = MODx.load({
	        xtype		: 'clientsettings-window-category-update',
	        record		: this.menu.record,
	        closeAction	:'close',
	        listeners	: {
		        'success'	: {
		        	fn			:this.refresh,
		        	scope		:this
		        }
	         }
        });
        
        this.createCategoryWindow.setValues(this.menu.record);
        this.createCategoryWindow.show(e.target);
    },
    removeCategory: function() {
    	MODx.msg.confirm({
        	title 	: _('clientsettings.category_remove'),
        	text	: _('clientsettings.category_remove_confirm'),
        	url		: this.config.url,
        	params	: {
            	action	: 'mgr/categories/remove',
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

Ext.reg('clientsettings-grid-categories', ClientSettings.grid.Categories);

ClientSettings.window.CreateCategory = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
    	autoHeight	: true,
        title 		: _('clientsettings.category_create'),
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
            action		: 'mgr/categories/create'
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
        	items		: [{
	        	columnWidth	: .9,
	        	items		: [{
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
		        }]
	        }, {
		        columnWidth	: .1,
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
        	fieldLabel	: _('clientsettings.label_description'),
        	description	: MODx.expandHelp ? '' : _('clientsettings.label_description_desc'),
        	name		: 'description',
        	anchor		: '100%'
        }, {
        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
        	html		: _('clientsettings.label_description_desc'),
        	cls			: 'desc-under'
        }]
    });
    
    ClientSettings.window.CreateCategory.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.CreateCategory, MODx.Window);

Ext.reg('clientsettings-window-category-create', ClientSettings.window.CreateCategory);

ClientSettings.window.UpdateCategory = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
    	autoHeight	: true,
        title 		: _('clientsettings.category_create'),
        url			: ClientSettings.config.connectorUrl,
        baseParams	: {
            action		: 'mgr/categories/update'
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
        	items		: [{
	        	columnWidth	: .9,
	        	items		: [{
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
		        }]
	        }, {
		        columnWidth	: .1,
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
	        xtype		: 'numberfield',
            fieldLabel	: _('clientsettings.label_menuindex'),
            description	: MODx.expandHelp ? '' : _('clientsettings.label_menu_desc'),
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
        	fieldLabel	: _('clientsettings.label_description'),
        	description	: MODx.expandHelp ? '' : _('clientsettings.label_description_desc'),
        	name		: 'description',
        	anchor		: '100%'
        }, {
        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
        	html		: _('clientsettings.label_description_desc'),
        	cls			: 'desc-under'
        }]
    });
    
    ClientSettings.window.UpdateCategory.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.UpdateCategory, MODx.Window);

Ext.reg('clientsettings-window-category-update', ClientSettings.window.UpdateCategory);