ClientSettings.panel.Client = function(config) {
    config = config || {};

    Ext.apply(config, {
    	url			: ClientSettings.config.connectorUrl,
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
            items		: this.contexts()
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
	contexts: function() {
		var contexts = [];
		var _this = this;
		
		Ext.each(ClientSettings.config.contexts, function(context) {
			contexts.push({
				xtype		: 'modx-vtabs',
				title		: context.name,
	            defaults	: {
	            	autoHeight	: true,
	            	autoWidth	: true,
	            	border		: false
	            },
	            items		: _this.settings(context)
	        });
		});
		
		return contexts;
	},
    settings: function(context) {
    	var categories = [];
    	var _settings = ClientSettings.config.settings;
    	var _this = this;

	    Ext.each(_settings.settings, function(category) {
	    	var settings = [];
	    	
	    	Ext.iterate(category.settings, function(setting) {
	    		var exclude = setting.exclude.split(',');

	    		if (-1 == exclude.indexOf(context.key)) {
		    		var tmpName = context.key + ':' + setting.key;
		    		
		    		var element = {
	                    xtype		: setting.xtype,
	                    fieldLabel	: setting.label,
	                    description	: '<b>[[++' + setting.key + ']]</b>',
	                    anchor		: '60%'
	                }
	
			        if (setting.xtype == 'modx-combo') {
	                   var options = [];
	                    
					   Ext.each(setting.value.split('||'), function(option) {
	                        var option = option.split('==');
	                        
	                        if (option[1]) {
	                            options.push([option[1], option[0]]);
	                        } else {
	                            options.push([option[0],option[0]]);
							}
						});
	                   
					   	Ext.applyIf(element, {
					   		store			: new Ext.data.ArrayStore({
	                    		mode			: 'local',
								fields			: ['value','label'],
								data			: options
							}),
							mode 			: 'local',
							hiddenName		: tmpName,
							valueField		: 'value',
							displayField	: 'label'
						});
					} else if (setting.xtype == 'modx-field-parent-change') {
						Ext.applyIf(element, {
							name		: tmpName + '_alias_ignore',
							formpanel	: 'clientsettings-panel-client',
							parentcmp	: tmpName + '_id',
							contextcmp	: null,
							currentid	: 0,
							value		: undefined == _settings.values[tmpName + '_alias_ignore'] ? '' : _settings.values[tmpName + '_alias_ignore'].value
						});
						
						settings.push({
							name		: tmpName,
							xtype		: 'hidden',
							value		: undefined == _settings.values[tmpName] ? '' : _settings.values[tmpName].value,
							id			: tmpName + '_id',
						});
					} else if (setting.xtype == 'modx-combo-browser') {
						Ext.applyIf(element, {
							name		: tmpName + '_alias_ignore',
							value		: undefined == _settings.values[tmpName + '_alias_ignore'] ? '' : _settings.values[tmpName + '_alias_ignore'].value,
							listeners : {
								'select'	: {
									fn	: function(data) {
										Ext.getCmp(tmpName + '_image').setValue(data.fullRelativeUrl);
									}
								}
							}
						});
						
						settings.push({
							name		: tmpName,
							xtype		: 'hidden',
							value		: undefined == _settings.values[tmpName] ? '' : _settings.values[tmpName].value,
							id			: tmpName + '_image',
						});
					} else if (setting.xtype == 'datefield') {
						Ext.applyIf(element, {
							format	: MODx.config.manager_date_format,
							startDay	: parseInt(MODx.config.manager_week_start),
						});
					} else if (setting.xtype == 'timefield') {	
						Ext.applyIf(element, {
							format		: MODx.config.manager_time_format,
							offset_time	: MODx.config.server_offset_time
						});
					} else if (setting.xtype == 'xdatetime') {	
						Ext.applyIf(element, {
							dateFormat	: MODx.config.manager_date_format,
							timeFormat	: MODx.config.manager_time_format,
							startDay	: parseInt(MODx.config.manager_week_start),
							offset_time	: MODx.config.server_offset_time
						});
					}
					
					if (/^\{(.+?)\}$/.test(setting.value)) {
						Ext.applyIf(element, Ext.decode(setting.value));
					}

					Ext.applyIf(element, {
						name		: tmpName,
						value		: undefined == _settings.values[tmpName] ? '' : _settings.values[tmpName].value,
					});
	                
	                settings.push(element, {
			        	xtype		: MODx.expandHelp ? 'label' : 'hidden',
			            html		: setting.description,
			            cls			: 'desc-under'
			        });
			    }
            });
	    	
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
	    });
	    
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