ClientSettings.grid.Categories = function(config) {
    config = config || {};

	config.tbar = [{
        text	: _('clientsettings.category_create'),
        cls		:'primary-button',
        handler	: this.createCategory,
        scope	: this
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
    	cls		: 'x-form-filter-clear',
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
            header		: _('clientsettings.category_label_name'),
            dataIndex	: 'name',
            sortable	: true,
            editable	: true,
            width		: 250,
            fixed		: true,
            editor		: {
            	xtype		: 'textfield'
            }
        }, {
            header		: _('clientsettings.category_label_description'),
            dataIndex	: 'description',
            sortable	: true,
            editable	: true,
            width		: 250,
            editor		: {
            	xtype		: 'textfield'
            }
        }, {
            header		: _('clientsettings.category_label_settings'),
            dataIndex	: 'settings',
            sortable	: true,
            editable	: false,
            width		: 100,
            fixed		: true
        }, {
            header		: _('clientsettings.label_active'),
            dataIndex	: 'active',
            sortable	: true,
            editable	: true,
            width		: 100,
            fixed		: true,
			renderer	: this.renderBoolean,
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
        url			: ClientSettings.config.connector_url,
        baseParams	: {
        	action		: 'mgr/categories/getList'
        },
        autosave	: true,
        save_action	: 'mgr/categories/updateFromGrid',
        fields		: ['id', 'name', 'description', 'settings', 'menuindex', 'active', 'editedon'],
        paging		: true,
        pageSize	: MODx.config.default_per_page > 30 ? MODx.config.default_per_page : 30,
        sortBy		: 'menuindex',
        enableDragDrop : true,
	    ddGroup 	: 'clientsettings-grid-admin-categories',
	    listeners	: {
	        'afterrender' : {
	           fn			: this.moveCategory,
	           scope		: this
	    	}
		}
    });
    
    ClientSettings.grid.Categories.superclass.constructor.call(this, config);
    
    this.on('afterrender', this.moveCategory, this);
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
	        handler	: this.updateCategory,
	        scope	: this
	    }, '-', {
		    text	: _('clientsettings.category_remove'),
		    handler	: this.removeCategory,
		    scope	: this
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
		        	fn		: function() {
	            		Ext.getCmp('clientsettings-grid-admin-settings').refresh();
	            		
            			this.getSelectionModel().clearSelections(true);
            			this.refresh();
            		},
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
		        	fn		: function() {
	            		Ext.getCmp('clientsettings-grid-admin-settings').refresh();
	            		
            			this.getSelectionModel().clearSelections(true);
            			this.refresh();
            		},
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
        	url		: ClientSettings.config.connector_url,
        	params	: {
            	action	: 'mgr/categories/remove',
            	id		: this.menu.record.id
            },
            listeners: {
            	'success': {
            		fn		: function() {
	            		Ext.getCmp('clientsettings-grid-admin-settings').refresh();
	            		
            			this.getSelectionModel().clearSelections(true);
            			this.refresh();
            		},
		        	scope		:this
            	}
            }
    	});
    },
    moveCategory: function() {
	    var grid = this;

		var ddrow = new Ext.dd.DropTarget(this.getView().mainBody, {
        	ddGroup 	: grid.config.ddGroup,
            notifyDrop 	: function(dd, e, data) {
            	var sm = grid.getSelectionModel();
                var sels = sm.getSelections();
                var cindex = dd.getDragData(e).rowIndex;
                
                if (sm.hasSelection()) {
                	for (i = 0; i < sels.length; i++) {
                    	grid.getStore().remove(grid.getStore().getById(sels[i].id));
                        grid.getStore().insert(cindex, sels[i]);
                    }
                    
                    sm.selectRecords(sels);
                }
                
                var sm = grid.getStore().data.items;
                var sort = new Array();
                
                for (var i = 0; i < sm.length; i++) {
	                sort.push(sm[i].id);
                }

                Ext.Ajax.request({
	                url		: ClientSettings.config.connector_url,
	                params 	: {
		                action	: 'mgr/categories/sort',
		                sort 	: Ext.encode(sort)
	                },
	                success: function(r) {
		            	Ext.getCmp('clientsettings-grid-admin-settings').refresh();
	            		
            			grid.getSelectionModel().clearSelections(true);
            			grid.refresh();
		            }
	            });
            }
        });
	},
    renderBoolean: function(d, c) {
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
        url			: ClientSettings.config.connector_url,
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
		        	fieldLabel	: _('clientsettings.category_label_name'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.category_label_name_desc'),
		        	name		: 'name',
		        	anchor		: '100%',
		        	allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.category_label_name_desc'),
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
        	xtype		: 'textarea',
        	fieldLabel	: _('clientsettings.category_label_description'),
        	description	: MODx.expandHelp ? '' : _('clientsettings.category_label_description_desc'),
        	name		: 'description',
        	anchor		: '100%'
        }, {
        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
        	html		: _('clientsettings.category_label_description_desc'),
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
        url			: ClientSettings.config.connector_url,
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
		        	fieldLabel	: _('clientsettings.category_label_name'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.category_label_name_desc'),
		        	name		: 'name',
		        	anchor		: '100%',
		        	allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.category_label_name_desc'),
		            cls			: 'desc-under'
		        }]
	        }, {
		        columnWidth	: .1,
		        style		: 'margin-right: 0;',
		        items		: [{
			        xtype		: 'checkbox',
		            fieldLabel	: _('clientsettings.category_label_active'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.category_label_active_desc'),
		            name		: 'active',
		            inputValue	: 1
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.category_label_active_desc'),
		            cls			: 'desc-under'
		        }]
	        }]	
	    }, {
        	xtype		: 'textarea',
        	fieldLabel	: _('clientsettings.label_description'),
        	description	: MODx.expandHelp ? '' : _('clientsettings.category_label_description_desc'),
        	name		: 'description',
        	anchor		: '100%'
        }, {
        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
        	html		: _('clientsettings.category_label_description_desc'),
        	cls			: 'desc-under'
        }]
    });
    
    ClientSettings.window.UpdateCategory.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.UpdateCategory, MODx.Window);

Ext.reg('clientsettings-window-category-update', ClientSettings.window.UpdateCategory);