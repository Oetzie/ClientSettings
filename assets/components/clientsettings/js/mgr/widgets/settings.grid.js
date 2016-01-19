ClientSettings.grid.Settings = function(config) {
    config = config || {};

	config.tbar = [{
        text	: _('clientsettings.setting_create'),
        cls		:'primary-button',
        handler	: this.createSetting,
        scope	: this
    }, '->', {
    	xtype		: 'clientsettings-combo-categories',
    	name		: 'clientsettings-filter-categories',
        id			: 'clientsettings-filter-categories',
        emptyText	: _('clientsettings.filter_category'),
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
        emptyText	: _('search')+'...',
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
    	cls		: 'x-form-filter-clear',
    	id		: 'clientsettings-filter-clear-settings',
    	text	: _('filter_clear'),
    	listeners: {
        	'click': {
        		fn		: this.clearFilter,
        		scope	: this
        	}
        }
    }];
    
    expander = new Ext.grid.RowExpander({
        tpl : new Ext.Template(
            '<p class="desc">{description}</p>'
        )
    });
    
    columns = new Ext.grid.ColumnModel({
        columns: [expander, {
            header		: _('clientsettings.setting_label_label'),
            dataIndex	: 'label',
            sortable	: true,
            editable	: true,
            width		: 150,
			editor		: {
            	xtype		: 'textfield'
            }
        }, {
            header		: _('clientsettings.setting_label_key'),
            dataIndex	: 'key',
            sortable	: true,
            editable	: false,
            width		: 100
        }, {
            header		: _('clientsettings.setting_label_xtype'),
            dataIndex	: 'xtype',
            sortable	: true,
            editable	: true,
            fixed		: true,
			width		: 100,
			renderer	: this.renderXtype,
            editor		: {
            	xtype		: 'clientsettings-combo-xtype'
            }
        }, {
            header		: _('clientsettings.setting_label_active'),
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
        }, {
            header		: _('clientsettings.setting_label_category'),
            dataIndex	: 'category_name',
            sortable	: true,
            hidden		: true,
            editable	: false
        }]
    });
    
    Ext.applyIf(config, {
    	cm			: columns,
        id			: 'clientsettings-grid-admin-settings',
        url			: ClientSettings.config.connector_url,
        baseParams	: {
        	action		: 'mgr/settings/getList'
        },
        autosave	: true,
        save_action	: 'mgr/settings/updateFromGrid',
        fields		: ['id', 'category_id', 'category_name', 'category_menuindex', 'key', 'label', 'description', 'xtype', 'exclude', 'extra', 'menuindex', 'active', 'editedon'],
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
        }],
        enableDragDrop : true,
	    ddGroup 	: 'clientsettings-grid-admin-settings',
	    listeners	: {
	        'afterrender' : {
	           fn			: this.moveSetting,
	           scope		: this
	    	}
		}
    });
    
    ClientSettings.grid.Settings.superclass.constructor.call(this, config);
    
    this.on('afterrender', this.moveSetting, this);
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
	        handler	: this.updateSetting,
	        scope	: this
	    }, {
	        text	: _('clientsettings.setting_copy'),
	        handler	: this.copySetting,
	        scope	: this
	    }, '-',  {
		    text	: _('clientsettings.setting_remove'),
		    handler	: this.removeSetting,
		    scope	: this
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
		        	fn		: function() {
	            		Ext.getCmp('clientsettings-grid-admin-categories').refresh();
	            		
            			this.getSelectionModel().clearSelections(true);
            			this.refresh();
            		},
		        	scope		:this
		        }
	         }
        });
        
        this.createSettingWindow.show(e.target);
    },
    copySetting: function(btn, e) {
    	if (this.copySettingWindow) {
	        this.copySettingWindow.destroy();
        }
        
        var duplicate = Ext.apply({}, this.menu.record);
        
        Ext.apply(duplicate, {
        	key			: 'copy_' + this.menu.record.key,
        	menuindex	: 0
        });
        
        this.copySettingWindow = MODx.load({
	        xtype		: 'clientsettings-window-setting-copy',
	        record		: duplicate,
	        closeAction	:'close',
	        listeners	: {
		        'success'	: {
		        	fn		: function() {
	            		Ext.getCmp('clientsettings-grid-admin-categories').refresh();
	            		
            			this.getSelectionModel().clearSelections(true);
            			this.refresh();
            		},
		        	scope		:this
		        }
	         }
        });

        this.copySettingWindow.setValues(duplicate);
        this.copySettingWindow.show(e.target);
    },
    updateSetting: function(btn, e) {
    	if (this.updateSettingWindow) {
	        this.updateSettingWindow.destroy();
        }

        this.updateSettingWindow = MODx.load({
	        xtype		: 'clientsettings-window-setting-update',
	        record		: this.menu.record,
	        closeAction	:'close',
	        listeners	: {
		        'success'	: {
		        	fn		: function() {
	            		Ext.getCmp('clientsettings-grid-admin-categories').refresh();
	            		
            			this.getSelectionModel().clearSelections(true);
            			this.refresh();
            		},
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
        	url		: ClientSettings.config.connector_url,
        	params	: {
            	action	: 'mgr/settings/remove',
            	id		: this.menu.record.id
            },
            listeners: {
            	'success': {
            		fn		: function() {
	            		Ext.getCmp('clientsettings-grid-admin-categories').refresh();
	            		
            			this.getSelectionModel().clearSelections(true);
            			this.refresh();
            		},
		        	scope		:this
            	}
            }
    	});
    },
    moveSetting: function() {
		var grid = this;

		var ddrow = new Ext.dd.DropTarget(this.getView().mainBody, {
        	ddGroup 	: grid.config.ddGroup,
            notifyDrop 	: function(dd, e, data) {
            	var sm = grid.getSelectionModel();
                var sels = sm.getSelections();
                var cindex = dd.getDragData(e).rowIndex;
                
                if (undefined != cindex) {
	                var record = grid.getStore().getAt(cindex);

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
		                if (i == cindex || sm[i].data.category_id == record.data.category_id) {
			                sort.push({
				                'id' 			: sm[i].id,
				                'category_id'	: record.data.category_id
				            });
		                }
	                }

	                Ext.Ajax.request({
		                url		: ClientSettings.config.connector_url,
		                params 	: {
			                action		: 'mgr/settings/sort',
			                sort 		: Ext.encode(sort)
		                },
		                success: function(r) {
			            	Ext.getCmp('clientsettings-grid-admin-categories').refresh();
		            		
	            			grid.getSelectionModel().clearSelections(true);
	            			grid.refresh();
			            }
		            });
                }
            }
        });
    },
    renderBoolean: function(d, c) {
    	c.css = 1 == parseInt(d) || d ? 'green' : 'red';
    	
    	return 1 == parseInt(d) || d ? _('yes') : _('no');
    },
    renderXtype: function(a, b, c) {
		xtypes = {
			'textfield'		: _('clientsettings.textfield'),
			'datefield'		: _('clientsettings.datefield'),
			'timefield'		: _('clientsettings.timefield'),
			'datetimefield'	: _('clientsettings.datetimefield'),
			'passwordfield'	: _('clientsettings.passwordfield'),
			'numberfield'	: _('clientsettings.numberfield'),
            'textarea'		: _('clientsettings.textarea'),
            'richtext'		: _('clientsettings.richtext'),
            'boolean'		: _('clientsettings.boolean'),
            'combo'			: _('clientsettings.combo'),
            'checkbox'		: _('clientsettings.checkbox'),
            'checkboxgroup'	: _('clientsettings.checkboxgroup'),
            'radiogroup'	: _('clientsettings.radiogroup'),
            'resource'		: _('clientsettings.resource'),
            'browser'		: _('clientsettings.browser'),
		};

		return xtypes[a];            
	}
});

Ext.reg('clientsettings-grid-settings', ClientSettings.grid.Settings);

ClientSettings.window.CreateSetting = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
    	autoHeight	: true,
    	width		: 600,
        title 		: _('clientsettings.setting_create'),
        url			: ClientSettings.config.connector_url,
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
				        	fieldLabel	: _('clientsettings.setting_label_key'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_key_desc'),
				        	name		: 'key',
				           	anchor		: '100%',
				        	allowBlank	: false
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_key_desc'),
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
		        	fieldLabel	: _('clientsettings.setting_label_label'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_label_desc'),
		        	name		: 'label',
		           	anchor		: '100%',
		        	allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_label_desc'),
		            cls			: 'desc-under'
		        }, {
		            xtype		: 'clientsettings-combo-categories',
		            fieldLabel	: _('clientsettings.setting_label_category'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_category_desc'),
		            name		: 'category_id',
		            anchor		: '100%',
		            allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_category_desc'),
		            cls			: 'desc-under'
		        }]
		    }, {
		    	columnWidth: .5,
		    	style		: 'margin-right: 0;',
                items		: [{
		        	xtype		: 'clientsettings-combo-xtype',
		        	fieldLabel	: _('clientsettings.setting_label_xtype'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_xtype_desc'),
		        	id			: 'clientsettings-combo-xtype-create',
		        	name		: 'xtype',
		        	anchor		: '100%',
		        	allowBlank	: false,
		        	listeners	: {
			        	'render' 	: {
				        	fn 			: this.xtype,
				        	scope		: this
			        	},
			        	'select'	: {
				        	fn 			: this.xtype,
				        	scope		: this
			        	}
		        	}
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_xtype_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textfield',
		        	fieldLabel	: _('clientsettings.setting_label_description'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_description_desc'),
		        	name		: 'description',
		        	anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.setting_label_description_desc'),
		        	cls			: 'desc-under'
		        }, {
			        xtype		: 'textfield',
		            fieldLabel	: _('clientsettings.setting_label_exclude'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_exclude_desc'),
		            name		: 'exclude',
		            anchor		: '100%',
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_exclude_desc'),
		            cls			: 'desc-under'
		        }]    
		    }]
	    }, {
	    	xtype		: 'fieldset',
	    	title		: _('clientsettings.extra_settings'),
			collapsible : true,
			collapsed 	: true,
			id			: 'clientsettings-extra-settings-create',
			defaults	: {
                layout		: 'form',
                labelSeparator : ''
            },
			items		: [{
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-default-create',
			    style 		: 'padding-top: 2px',
			    hidden 		: false,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		        	xtype		: 'label',
		            html		: _('clientsettings.no_extra_settings'),
		            cls			: 'desc-under'
		        }]
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-datefield-create',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'datefield',
				        	fieldLabel	: _('clientsettings.setting_label_mindate'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_mindate_desc'),
				        	name		: 'minDateValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_date_format,
							startDay	: parseInt(MODx.config.manager_week_start)
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_mindate_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'datefield',
				        	fieldLabel	: _('clientsettings.setting_label_maxdate'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_maxdate_desc'),
				        	name		: 'maxDateValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_date_format,
							startDay	: parseInt(MODx.config.manager_week_start)
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_maxdate_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-timefield-create',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'timefield',
				        	fieldLabel	: _('clientsettings.setting_label_mintime'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_mintime_desc'),
				        	name		: 'minTimeValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_time_format
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_mintime_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'timefield',
				        	fieldLabel	: _('clientsettings.setting_label_maxtime'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_maxtime_desc'),
				        	name		: 'maxTimeValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_time_format
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_maxtime_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-richtext-create',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_toolbar1'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_toolbar1_desc'),
				        	name		: 'toolbar1',
				        	anchor		: '100%',
				        	value		: 'undo redo | bold italic underline strikethrough | styleselect bullist numlist outdent indent'
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_toolbar1_desc'),
				            cls			: 'desc-under'
				        }, {
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_toolbar3'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_toolbar3_desc'),
				        	name		: 'toolbar3',
				        	anchor		: '100%',
				        	value		: ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_toolbar3_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_toolbar2'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_toolbar2_desc'),
				        	name		: 'toolbar2',
				        	anchor		: '100%',
				        	value		: ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_toolbar2_desc'),
				            cls			: 'desc-under'
				        }, {
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_plugins'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_plugins_desc'),
				        	name		: 'plugins',
				        	anchor		: '100%',
				        	value		: ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_plugins_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}, {
			    xtype		: 'clientsettings-combo-values',
			    id 			: 'clientsettings-extra-combo-create',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
					labelSeparator : ''
	            }
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-browser-create',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'modx-combo-source',
				        	fieldLabel	: _('clientsettings.setting_label_source'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_source_desc'),
				        	name		: 'source',
				        	anchor		: '100%',
				        	value 		: MODx.config.default_media_source
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_source_desc'),
				            cls			: 'desc-under'
				        }, {
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_filetypes'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_filetypes_desc'),
				        	name		: 'allowedFileTypes',
				        	anchor		: '100%',
				        	value		: ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_filetypes_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_opento'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_opento_desc'),
				        	name		: 'openTo',
				        	anchor		: '100%',
				        	value		: '/'
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_opento_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}]
		}]
    });
    
    ClientSettings.window.CreateSetting.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.CreateSetting, MODx.Window, {
	xtype: function(event) {
		var type = 'create';
		var event = Ext.getCmp('clientsettings-combo-xtype-' + type);

		var elements = {
			default 		: true,
			datefield 		: false,
			timefield 		: false,
			datetimefield	: false,
			richtext		: false,
			combo			: false,
			browser			: false
		};
		
		switch (event.getValue()) {
			case 'datefield':
				elements.default 	= false;
				elements.datefield 	= true;
				
				break;	
			case 'timefield':
				elements.default 	= false;
				elements.timefield 	= true;
				
				break;
			case 'datetimefield':
				elements.default 	= false;
				elements.datefield 	= true;
				elements.timefield 	= true;
				
				break;
			case 'richtext':
				elements.default 	= false;
				elements.richtext 	= true;
				
				break;
			case 'combo':
			case 'radiogroup':
			case 'checkboxgroup':
				elements.default 	= false;
				elements.combo	 	= true;
				
				break;
			case 'browser':
				elements.default 	= false;
				elements.browser 	= true;
				
				break;
		}
		
		if (!elements.default) {
			if (undefined !== (cmp = Ext.getCmp('clientsettings-extra-settings-' + type))) {
				cmp.expand();
			}
		} else {
			if (undefined !== (cmp = Ext.getCmp('clientsettings-extra-settings-' + type))) {
				cmp.collapse();
			}
		}

		for (element in elements) {
			if (undefined !== (cmp = Ext.getCmp('clientsettings-extra-' + element + '-' + type))) {
				if (elements[element]) {
					cmp.show();
				} else {
					cmp.hide();
				}
			}
		}
	}
});

Ext.reg('clientsettings-window-setting-create', ClientSettings.window.CreateSetting);

ClientSettings.window.CopySetting = function(config) {
    config = config || {};

    Ext.applyIf(config, {
    	autoHeight	: true,
    	width		: 600,
        title 		: _('clientsettings.setting_copy'),
        url			: ClientSettings.config.connector_url,
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
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_key'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_key_desc'),
				        	name		: 'key',
				           	anchor		: '100%',
				        	allowBlank	: false
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_key_desc'),
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
		        	fieldLabel	: _('clientsettings.setting_label_label'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_label_desc'),
		        	name		: 'label',
		           	anchor		: '100%',
		        	allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_label_desc'),
		            cls			: 'desc-under'
		        }, {
		            xtype		: 'clientsettings-combo-categories',
		            fieldLabel	: _('clientsettings.setting_label_category'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_category_desc'),
		            name		: 'category_id',
		            anchor		: '100%',
		            allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_category_desc'),
		            cls			: 'desc-under'
		        }]
		    }, {
		    	columnWidth	: .5,
		    	style		: 'margin-right: 0;',
                items		: [{
		        	xtype		: 'clientsettings-combo-xtype',
		        	fieldLabel	: _('clientsettings.setting_label_xtype'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_xtype_desc'),
		        	name		: 'xtype',
		        	anchor		: '100%',
		        	allowBlank	: false,
		        	listeners	: {
			        	'render' 	: {
				        	fn 			: this.xtype,
				        	scope		: this
			        	},
			        	'select'	: {
				        	fn 			: this.xtype,
				        	scope		: this
			        	}
		        	}
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_xtype_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textfield',
		        	fieldLabel	: _('clientsettings.setting_label_description'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_description_desc'),
		        	name		: 'description',
		        	anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.setting_label_description_desc'),
		        	cls			: 'desc-under'
		        }, {
			        xtype		: 'textfield',
		            fieldLabel	: _('clientsettings.setting_label_exclude'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_exclude_desc'),
		            name		: 'exclude',
		            anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_exclude_desc'),
		            cls			: 'desc-under'
		        }]    
		    }]
	    }, {
	    	xtype		: 'fieldset',
	    	title		: _('clientsettings.extra_settings'),
			collapsible : true,
			collapsed 	: true,
			id			: 'clientsettings-extra-settings-copy',
			defaults	: {
                layout		: 'form',
                labelSeparator : ''
            },
			items		: [{
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-default-copy',
			    style 		: 'padding-top: 2px',
			    hidden 		: false,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		        	xtype		: 'label',
		            html		: _('clientsettings.no_extra_settings'),
		            cls			: 'desc-under'
		        }]
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-datefield-copy',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'datefield',
				        	fieldLabel	: _('clientsettings.setting_label_mindate'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_mindate_desc'),
				        	name		: 'minDateValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_date_format,
							startDay	: parseInt(MODx.config.manager_week_start),
							value 		: config.record.extra.minDateValue
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_mindate_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'datefield',
				        	fieldLabel	: _('clientsettings.setting_label_maxdate'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_maxdate_desc'),
				        	name		: 'maxDateValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_date_format,
							startDay	: parseInt(MODx.config.manager_week_start),
							value 		: config.record.extra.maxDateValue
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_maxdate_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-timefield-copy',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'timefield',
				        	fieldLabel	: _('clientsettings.setting_label_mintime'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_mintime_desc'),
				        	name		: 'minTimeValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_time_format,
				        	value 		: config.record.extra.minTimeValue
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_mintime_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'timefield',
				        	fieldLabel	: _('clientsettings.setting_label_maxtime'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_maxtime_desc'),
				        	name		: 'maxTimeValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_time_format,
				        	value 		: config.record.extra.maxTimeValue
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_maxtime_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-richtext-copy',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_toolbar1'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_toolbar1_desc'),
				        	name		: 'toolbar1',
				        	anchor		: '100%',
				        	value		: config.record.extra.toolbar1 || 'undo redo | bold italic underline strikethrough | styleselect bullist numlist outdent indent'
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_toolbar1_desc'),
				            cls			: 'desc-under'
				        }, {
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_toolbar3'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_toolbar3_desc'),
				        	name		: 'toolbar3',
				        	anchor		: '100%',
				        	value		: config.record.extra.toolbar3 || ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_toolbar3_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_toolbar2'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_toolbar2_desc'),
				        	name		: 'toolbar2',
				        	anchor		: '100%',
				        	value		: config.record.extra.toolbar2 || ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_toolbar2_desc'),
				            cls			: 'desc-under'
				        }, {
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_plugins'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_plugins_desc'),
				        	name		: config.record.extra.plugins || 'plugins',
				        	anchor		: '100%',
				        	value		: ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_plugins_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}, {
			    xtype		: 'clientsettings-combo-values',
			    id 			: 'clientsettings-extra-combo-copy',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
					labelSeparator : ''
	            },
	            value 		: Ext.encode(config.record.extra.values) || '[]'
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-browser-copy',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'modx-combo-source',
				        	fieldLabel	: _('clientsettings.setting_label_source'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_source_desc'),
				        	name		: 'source',
				        	anchor		: '100%',
				        	value 		: config.record.extra.source || MODx.config.default_media_source
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_source_desc'),
				            cls			: 'desc-under'
				        }, {
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_filetypes'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_filetypes_desc'),
				        	name		: 'allowedFileTypes',
				        	anchor		: '100%',
				        	value		: config.record.extra.allowedFileTypes || ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_filetypes_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_opento'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_opento_desc'),
				        	name		: 'openTo',
				        	anchor		: '100%',
				        	value		: config.record.extra.openTo || '/'
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_opento_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}]
		}]
    });
    
    ClientSettings.window.CopySetting.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.CopySetting, MODx.Window, {
	xtype: function(event) {
		var type = 'copy';
		
		var elements = {
			default 		: true,
			datefield 		: false,
			timefield 		: false,
			datetimefield	: false,
			richtext		: false,
			combo			: false,
			browser			: false
		};
		
		switch (event.value) {
			case 'datefield':
				elements.default 	= false;
				elements.datefield 	= true;
				
				break;	
			case 'timefield':
				elements.default 	= false;
				elements.timefield 	= true;
				
				break;
			case 'datetimefield':
				elements.default 	= false;
				elements.datefield 	= true;
				elements.timefield 	= true;
				
				break;
			case 'richtext':
				elements.default 	= false;
				elements.richtext 	= true;
				
				break;
			case 'combo':
			case 'radiogroup':
			case 'checkboxgroup':
				elements.default 	= false;
				elements.combo	 	= true;
				
				break;
			case 'browser':
				elements.default 	= false;
				elements.browser 	= true;
				
				break;
		}
		
		if (!elements.default) {
			if (undefined !== (cmp = Ext.getCmp('clientsettings-extra-settings-' + type))) {
				cmp.expand();
			}
		} else {
			if (undefined !== (cmp = Ext.getCmp('clientsettings-extra-settings-' + type))) {
				cmp.collapse();
			}
		}

		for (element in elements) {
			if (undefined !== (cmp = Ext.getCmp('clientsettings-extra-' + element + '-' + type))) {
				if (elements[element]) {
					cmp.show();
				} else {
					cmp.hide();
				}
			}
		}
	}
});

Ext.reg('clientsettings-window-setting-copy', ClientSettings.window.CopySetting);

ClientSettings.window.UpdateSetting = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
    	autoHeight	: true,
    	width		: 600,
        title 		: _('clientsettings.setting_update'),
        url			: ClientSettings.config.connector_url,
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
				        	fieldLabel	: _('clientsettings.setting_label_key'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_key_desc'),
				        	name		: 'key',
				           	anchor		: '100%',
				        	allowBlank	: false
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_key_desc'),
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
		        	fieldLabel	: _('clientsettings.setting_label_label'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_label_desc'),
		        	name		: 'label',
		           	anchor		: '100%',
		        	allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_label_desc'),
		            cls			: 'desc-under'
		        }, {
		            xtype		: 'clientsettings-combo-categories',
		            fieldLabel	: _('clientsettings.setting_label_category'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_category_desc'),
		            name		: 'category_id',
		            anchor		: '100%',
		            allowBlank	: false
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_category_desc'),
		            cls			: 'desc-under'
		        }]
		    }, {
		    	columnWidth	: .5,
		    	style		: 'margin-right: 0;',
                items		: [{
		        	xtype		: 'clientsettings-combo-xtype',
		        	fieldLabel	: _('clientsettings.setting_label_xtype'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_xtype_desc'),
		        	name		: 'xtype',
		        	anchor		: '100%',
		        	allowBlank	: false,
		        	listeners	: {
			        	'render' 	: {
				        	fn 			: this.xtype,
				        	scope		: this
			        	},
			        	'select'	: {
				        	fn 			: this.xtype,
				        	scope		: this
			        	}
		        	}
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_xtype_desc'),
		            cls			: 'desc-under'
		        }, {
		        	xtype		: 'textfield',
		        	fieldLabel	: _('clientsettings.setting_label_description'),
		        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_description_desc'),
		        	name		: 'description',
		        	anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		        	html		: _('clientsettings.setting_label_description_desc'),
		        	cls			: 'desc-under'
		        }, {
			        xtype		: 'textfield',
		            fieldLabel	: _('clientsettings.setting_label_exclude'),
		            description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_exclude_desc'),
		            name		: 'exclude',
		            anchor		: '100%'
		        }, {
		        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
		            html		: _('clientsettings.setting_label_exclude_desc'),
		            cls			: 'desc-under'
		        }]    
		    }]
	    }, {
	    	xtype		: 'fieldset',
	    	title		: _('clientsettings.extra_settings'),
			collapsible : true,
			collapsed 	: true,
			id			: 'clientsettings-extra-settings-update',
			defaults	: {
                layout		: 'form',
                labelSeparator : ''
            },
			items		: [{
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-default-update',
			    style 		: 'padding-top: 2px',
			    hidden 		: false,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		        	xtype		: 'label',
		            html		: _('clientsettings.no_extra_settings'),
		            cls			: 'desc-under'
		        }]
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-datefield-update',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'datefield',
				        	fieldLabel	: _('clientsettings.setting_label_mindate'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_mindate_desc'),
				        	name		: 'minDateValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_date_format,
							startDay	: parseInt(MODx.config.manager_week_start),
							value 		: config.record.extra.minDateValue
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_mindate_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'datefield',
				        	fieldLabel	: _('clientsettings.setting_label_maxdate'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_maxdate_desc'),
				        	name		: 'maxDateValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_date_format,
							startDay	: parseInt(MODx.config.manager_week_start),
							value 		: config.record.extra.maxDateValue
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_maxdate_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-timefield-update',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'timefield',
				        	fieldLabel	: _('clientsettings.setting_label_mintime'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_mintime_desc'),
				        	name		: 'minTimeValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_time_format,
				        	value 		: config.record.extra.minTimeValue
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_mintime_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'timefield',
				        	fieldLabel	: _('clientsettings.setting_label_maxtime'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_maxtime_desc'),
				        	name		: 'maxTimeValue',
				        	anchor		: '100%',
				        	format		: MODx.config.manager_time_format,
				        	value 		: config.record.extra.maxTimeValue
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_maxtime_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-richtext-update',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_toolbar1'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_toolbar1_desc'),
				        	name		: 'toolbar1',
				        	anchor		: '100%',
				        	value		: config.record.extra.toolbar1 || 'undo redo | bold italic underline strikethrough | styleselect bullist numlist outdent indent'
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_toolbar1_desc'),
				            cls			: 'desc-under'
				        }, {
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_toolbar3'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_toolbar3_desc'),
				        	name		: 'toolbar3',
				        	anchor		: '100%',
				        	value		: config.record.extra.toolbar3 || ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_toolbar3_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_toolbar2'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_toolbar2_desc'),
				        	name		: 'toolbar2',
				        	anchor		: '100%',
				        	value		: config.record.extra.toolbar2 || ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_toolbar2_desc'),
				            cls			: 'desc-under'
				        }, {
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_plugins'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_plugins_desc'),
				        	name		: config.record.extra.plugins || 'plugins',
				        	anchor		: '100%',
				        	value		: ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_plugins_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}, {
			    xtype		: 'clientsettings-combo-values',
			    id 			: 'clientsettings-extra-combo-update',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
					labelSeparator : ''
	            },
	            value 		: Ext.encode(config.record.extra.values) || '[]'
			}, {
			    xtype		: 'panel',
			    id 			: 'clientsettings-extra-browser-update',
			    style 		: 'padding-top: 15px',
			    hidden 		: true,
			    defaults	: {
	                layout		: 'form',
	                labelSeparator : ''
	            },
			    items		: [{
		            layout		: 'column',
		            border		: false,
		            defaults	: {
		                layout		: 'form',
		                labelSeparator : ''
		            },
		            items: [{
		                columnWidth: .5,
		                items		: [{
				        	xtype		: 'modx-combo-source',
				        	fieldLabel	: _('clientsettings.setting_label_source'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_source_desc'),
				        	name		: 'source',
				        	anchor		: '100%',
				        	value 		: config.record.extra.source || MODx.config.default_media_source
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_source_desc'),
				            cls			: 'desc-under'
				        }, {
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_filetypes'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_filetypes_desc'),
				        	name		: 'allowedFileTypes',
				        	anchor		: '100%',
				        	value		: config.record.extra.allowedFileTypes || ''
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_filetypes_desc'),
				            cls			: 'desc-under'
				        }]
				    }, {
				    	columnWidth: .5,
				    	style		: 'margin-right: 0;',
		                items		: [{
				        	xtype		: 'textfield',
				        	fieldLabel	: _('clientsettings.setting_label_opento'),
				        	description	: MODx.expandHelp ? '' : _('clientsettings.setting_label_opento_desc'),
				        	name		: 'openTo',
				        	anchor		: '100%',
				        	value		: config.record.extra.openTo || '/'
				        }, {
				        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
				            html		: _('clientsettings.setting_label_opento_desc'),
				            cls			: 'desc-under'
				        }]
				    }]
				}]
			}]
		}]
    });
    
    ClientSettings.window.UpdateSetting.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.window.UpdateSetting, MODx.Window, {
	xtype: function(event) {
		var type = 'update';
		
		var elements = {
			default 		: true,
			datefield 		: false,
			timefield 		: false,
			datetimefield	: false,
			richtext		: false,
			combo			: false,
			browser			: false
		};
		
		switch (event.value) {
			case 'datefield':
				elements.default 	= false;
				elements.datefield 	= true;
				
				break;	
			case 'timefield':
				elements.default 	= false;
				elements.timefield 	= true;
				
				break;
			case 'datetimefield':
				elements.default 	= false;
				elements.datefield 	= true;
				elements.timefield 	= true;
				
				break;
			case 'richtext':
				elements.default 	= false;
				elements.richtext 	= true;
				
				break;
			case 'combo':
			case 'radiogroup':
			case 'checkboxgroup':
				elements.default 	= false;
				elements.combo	 	= true;
				
				break;
			case 'browser':
				elements.default 	= false;
				elements.browser 	= true;
				
				break;
		}
		
		if (!elements.default) {
			if (undefined !== (cmp = Ext.getCmp('clientsettings-extra-settings-' + type))) {
				cmp.expand();
			}
		} else {
			if (undefined !== (cmp = Ext.getCmp('clientsettings-extra-settings-' + type))) {
				cmp.collapse();
			}
		}

		for (element in elements) {
			if (undefined !== (cmp = Ext.getCmp('clientsettings-extra-' + element + '-' + type))) {
				if (elements[element]) {
					cmp.show();
				} else {
					cmp.hide();
				}
			}
		}
	}
});

Ext.reg('clientsettings-window-setting-update', ClientSettings.window.UpdateSetting);

ClientSettings.combo.Categories = function(config) {
    config = config || {};
    
    Ext.applyIf(config, {
        url			: ClientSettings.config.connector_url,
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

ClientSettings.combo.Values = function(config) {
	config = config || {};

    Ext.applyIf(config, {
	    xtype		: 'panel',
	    id 			: 'customtvs-extra-combo',
	    hideLabels	: true,
	    items		: [{
        	xtype		: 'hidden',
        	anchor		: '100%',
        	height		: '30',
        	id 			: (config.id || 'customtvs-extra-combo') + '-value',
        	name 		: 'values',
        	value 		: config.value || '[]'
        }],
        listeners	: {
        	'afterrender' : {
				fn 		: this.decodeData,
				scope 	: this
			} 
        }
	});
	
	ClientSettings.combo.Values.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.combo.Values, MODx.Panel, {
	decodeData: function() {
		if (undefined !== (cmp = Ext.getCmp(this.config.id + '-value'))) {
			var data = Ext.decode(cmp.getValue() || '[]');
	
			if (null == data || 0 == data.length) {
				this.addElement(0, {});
			} else {
				for (var i = 0; i < data.length; i++) {
					this.addElement(i, data[i]);
				}
			}
		}
	},
	encodeData: function() {
		var data = [];
		var textfields = {
			values : [],
			labels : []	
		};
		
		var elements = this.findByType('textfield');
		
		for (var i = 0; i < elements.length; i++) {
			var element = elements[i];
			
			if ('textfield' == element.xtype) {
				if ('value' == element.type) {
					textfields.values.push(element);
				} else if ('label' == element.type) {
					textfields.labels.push(element);
				}	
			}	
		}
		
		for (var i = 0; i < textfields.values.length; i++) {
			data.push({
				value : textfields.values[i].getValue() || '',
				label : textfields.labels[i].getValue() || ''
			});	
		}
		
		if (undefined !== (cmp = Ext.getCmp(this.config.id + '-value'))) {
			cmp.setValue(Ext.encode(data));
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
		var id = new Date().getTime();
		var scope = this;
		
		var nextBtn = {
		    xtype 		: 'box',
			autoEl 		: {
				tag 		: 'a',
				html		: '<i class="icon icon-plus"></i>',
				style 		: 'padding: 9px; margin: 0 5px; cursor: pointer;',
				cls 		: 'x-btn',
				current 	: this.config.id + '-' + id
			},
			listeners	: {
				'render'	: function(button) {
					button.getEl().on('click', function(event) {
						var index = scope.items.findIndexBy(function(item) {
							return item.id == button.autoEl.current;
						});
						
						scope.addElement(index + 1, {});
	            	});    
	            }
			}
		};
		
		var prevBtn = {
		    xtype 		: 'box',
			autoEl 		: {
				tag 		: 'a',
				html		: '<i class="icon icon-minus"></i>',
				style 		: 'padding: 9px; margin: 0 5px; cursor: pointer;',
				cls 		: 'x-btn',
				current 	: this.config.id + '-' + id
			},
			listeners	: {
				'render'	: function(button) {
					button.getEl().on('click', function(event) {
						var index = scope.items.findIndexBy(function(item) {
							return item.id == button.autoEl.current;
						});
						
						scope.removeElement(index);
	            	});    
	            }
			}
		};

		return {
            layout		: 'column',
            border		: false,
            id 			: this.config.id + '-' + id,
            style		: 'margin-bottom: 5px;',
            defaults	: {
                layout		: 'form',
                hideLabels	: true
            },
            items: [{
	            columnWidth : .41,
                items		: [{
		        	xtype		: 'textfield',
		        	anchor		: '100%',
		        	emptyText 	: _('clientsettings.setting_label_value'),
		        	type 		: 'value',
		        	value		: data.value || '',
		        	listeners	: {
			        	'blur'		: {
				        	fn 			: this.encodeData,
				        	scope		: this
				        }	
			        }
		        }]
		    }, {
		    	columnWidth : .41,
                items		: [{
		        	xtype		: 'textfield',
		        	anchor		: '100%',
		        	emptyText 	: _('clientsettings.setting_label_label'),
		        	type 		: 'label',
		        	value		: data.label || '',
		        	listeners	: {
			        	'blur'		: {
				        	fn 			: this.encodeData,
				        	scope		: this
				        }	
			        }
		        }]
		    }, {
		    	columnWidth : .18,
		    	style		: 'margin-right: 0;',
                items		: 0 == index ? [nextBtn] : [nextBtn, prevBtn]
            }]
		};
	}	
});

Ext.reg('clientsettings-combo-values', ClientSettings.combo.Values);