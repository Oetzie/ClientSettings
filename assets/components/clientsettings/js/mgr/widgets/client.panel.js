ClientSettings.panel.Client = function(config) {
    config = config || {};

    Ext.apply(config, {
    	url			: ClientSettings.config.connector_url,
    	baseParams	: {},
        id			: 'clientsettings-panel-client',
        cls			: 'container',
	    defaults	: {
			collapsible	: false,
			autoHeight	: true,
			autoWidth	: true,
			border		: false
		},
        items		: [{
            html		: '<h2>' + _('clientsettings') + '</h2>',
            id			: 'clientsettings-header',
            cls			: 'modx-page-header'
        }, {
        	xtype		: 'modx-tabs',
        	border 		: true,
        	defaults	: {
				autoHeight	: true,
				autoWidth	: true,
				border		: false
			},
            items		: this.getContexts()
        }],
        listeners	: {
            'setup'		: {
            	fn			:this.setup,
            	scope		:this
            }
        }
    });

    ClientSettings.panel.Client.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.panel.Client, MODx.FormPanel, {
	setup: function() {
		this.fireEvent('ready');
	},
	getContexts: function() {
		var contexts 	= [];
		var _contexts 	= ClientSettings.config.contexts;

		for (var i = 0; i < _contexts.length; i++) {
			contexts.push({
				xtype		: 'modx-vtabs',
				title		: _contexts[i].name,
	            defaults	: {
	            	autoHeight	: true,
	            	autoWidth	: true,
	            	border		: false
	            },
	            items		: this.getSettings(_contexts[i])
	        });
		}
		
		return contexts;
	},
    getSettings: function(context) {
    	var categories 		= [];
    	var _categories 	= ClientSettings.config.categories;

		for (var i = 0; i < _categories.categories.length; i++) {
	    	var settings 	= [];
	    	var category 	= _categories.categories[i];

	    	for (var ii = 0; ii < category.settings.length; ii++) {
		    	var setting = category.settings[ii];
	    		var exclude = setting.exclude.split(',');

	    		if (-1 == exclude.indexOf(context.key)) {
		    		var name = context.key + ':' + setting.id;

	                var element = Ext.applyIf(setting, {
						xtype		: 'textfield',
						fieldLabel	: setting.label,
						name 		: name,
						anchor		: '60%',
						value		: undefined == _categories.values[name] ? '' : _categories.values[name].value,
					});
					
					element = Ext.applyIf({
						id			: 'element-' + element.id,
						description	: '<b>[[++' + setting.key + ']]</b>',
					}, element);
					
					switch (element.xtype) {
						case 'datefield':
							element = Ext.applyIf({
								format			: MODx.config.manager_date_format,
								startDay		: parseInt(MODx.config.manager_week_start),
								minValue 		: element.extra.minDateValue,
								maxValue 		: element.extra.maxDateValue
							}, element);
							
							break;
						case 'timefield':
							element = Ext.applyIf({
								format			: MODx.config.manager_time_format,
								offset_time		: MODx.config.server_offset_time,
								minValue 		: element.extra.minTimeValue,
								maxValue 		: element.extra.maxTimeValue
							}, element);
							
							break;
						case 'datetimefield':
							element = Ext.applyIf({
								xtype 			: 'xdatetime',
								dateFormat		: MODx.config.manager_date_format,
								timeFormat		: MODx.config.manager_time_format,
								startDay		: parseInt(MODx.config.manager_week_start),
								offset_time		: MODx.config.server_offset_time,
								minDateValue 	: element.extra.minDateValue,
								maxDateValue 	: element.extra.maxDateValue,
								minTimeValue 	: element.extra.minTimeValue,
								maxTimeValue 	: element.extra.maxTimeValue
							}, element);
							
							break;
						case 'passwordfield':
							element = Ext.applyIf({
								xtype 			: 'textfield',
								inputType		: 'password'
							}, element);
							
							break;
						case 'richtext':
							element = Ext.applyIf({
								xtype			: 'textarea',
								listeners		: {
									'afterrender' : {
										fn 			: function(event) {
											if (MODx.loadRTE) {
												MODx.loadRTE(event.id, {
													toolbar1 				: element.extra.toolbar1 || 'undo redo | bold italic underline strikethrough | styleselect bullist numlist outdent indent',
													toolbar2 				: element.extra.toolbar2 || '',
													toolbar3 				: element.extra.toolbar3 || '',
													plugins 				: element.extra.plugins || '',
													menubar 				: false,
													statusbar				: false,
													width 					: '60%',
													height					: '150px',
													toggle					: false
												});
											}
										}
									}
								}
							}, element);	
							
							break;
						case 'boolean':
							element = Ext.applyIf({
								xtype			: 'combo-boolean'
							}, element);
							
							break;
						case 'combo':
							element = Ext.applyIf({
								xtype			: 'modx-combo',
							   	store			: new Ext.data.JsonStore({
									fields			: ['value', 'label'],
									data			: element.extra.values || []
								}),
								mode 			: 'local',
								hiddenName		: element.name,
								valueField		: 'value',
								displayField	: 'label',
								listeners		: {
									'select'	: function(data) {
										Ext.getCmp(this.config.id + '-replace').setValue(data.lastSelectionText);
									}
								}
							}, element);
						
							break;
						case 'checkbox':
							settings.push({
								xtype	: 'hidden',
								name	: element.name + '-ignore',
							});
							
							element = Ext.applyIf({
								fieldLabel 	: '',
								boxLabel	: element.fieldLabel,
								inputValue	: 1,
								checked		: undefined == _categories.values[name] ? false : Boolean(_categories.values[name].value)
							}, element);
						
							break;
						case 'checkboxgroup':
							var items = [];
							
							for (var a = 0; a < element.extra.values.length; a++) {
								items.push({
									name 		: element.name + '[]',
									boxLabel	: element.extra.values[a].label,
									inputValue	: element.extra.values[a].value
								});
							}
							
							if (0 < items.length) {
								settings.push({
									xtype	: 'hidden',
									name	: element.name,
								});
							
								element = Ext.applyIf({
									xtype			: 'checkboxgroup',
									columns			: 1,
									items			: items
								}, element);
							}
						
							break;
						case 'radiogroup':
							var items = [];
							
							for (var a = 0; a < element.extra.values.length; a++) {
								items.push({
									name 		: element.name,
									boxLabel	: element.extra.values[a].label,
									inputValue	: element.extra.values[a].value
								});
							}
							
							if (0 < items.length) {
								element = Ext.applyIf({
									xtype			: 'radiogroup',
								   	columns			: 1,
								   	items			: items
								}, element);
							}
							
							break;
						case 'resource':
							settings.push({
								xtype	: 'hidden',
								name	: element.name,
								id		: element.id + '-replace',
								value	: undefined == _categories.values[name] ? '' : _categories.values[name].value
							});
								
							element = Ext.applyIf({
								xtype		: 'modx-field-parent-change',
								name		: element.name + '-replace',
								formpanel	: 'clientsettings-panel-client',
								parentcmp	: element.id + '-replace',
								contextcmp	: null,
								currentid	: 0,
								value		: undefined == _categories.values[name + '-replace'] ? '' : _categories.values[name + '-replace'].value
							}, element);
						
							break;
						case 'browser':
							settings.push({
								xtype	: 'hidden',
								name	: element.name,
								id		: element.id + '-replace',
								value	: undefined == _categories.values[name] ? '' : _categories.values[name].value,
							});
								
							element = Ext.applyIf({
								xtype		: 'modx-combo-browser',
								name		: element.name + '-replace',
								source		: element.extra.source || MODx.config.default_media_source,
								openTo		: element.extra.openTo || '/',
								allowedFileTypes : element.extra.allowedFileTypes || '',
								value		: undefined == _categories.values[name + '-replace'] ? '' : _categories.values[name + '-replace'].value,
								listeners	: {
									'select'	: {
										fn			: function(data) {
											Ext.getCmp(this.id + '-replace').setValue(data.fullRelativeUrl);
										},
										scope		: element
									}
								}
							}, element);
						
							break;
					}
					
	                settings.push(element, {
			        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
			            html		: setting.description,
			            cls			: 'desc-under'
			        });
			    }
            }
	    	
	    	if (settings.length > 0) {
		   		categories.push({
	            	title		: category.name,
		            defaults	: {
						autoHeight	: true,
						autoWidth	: true,
						border		: false
					},
		            items		: [{
			            html			: '<p>' + category.description + '</p>',
			            bodyCssClass	: 'modx-desc'
		            }, {
			            layout			: 'form',
		                cls				: 'main-wrapper form-with-labels',
		                labelAlign		: 'top',
	                    labelSeparator	: '',
		                items			: settings
		            }]
		   		});
		   	}
	    }
	    
	    if (categories.length == 0) {
		    return [{
				title		: _('clientsettings.no_settings'),
				defaults	: {
		        	autoHeight	: true,
		        	autoWidth	: true,
		        	border 		: false
		        },
		        items		: [{
		            html			: '<p>' + _('clientsettings.no_settings_desc') + '</p>',
					bodyCssClass	: 'modx-config-error'
	            }]
		   }]; 
	    }
    	
        return categories;
    }
});

Ext.reg('clientsettings-panel-client', ClientSettings.panel.Client);