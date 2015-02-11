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
		    		
		    		var element = {};
		    		
		    		element = Ext.applyIf(element, {
	                    xtype		: setting.xtype,
	                    fieldLabel	: setting.label,
	                    description	: '<b>[[++' + setting.key + ']]</b>',
	                    anchor		: '60%',
	                    value		: undefined == _settings.values[tmpName] ? '' : _settings.values[tmpName].value
	                });
	
			        if ('modx-combo' == setting.xtype) {
	                   var options = [];
	                    
					   Ext.each(setting.value.split('||'), function(option) {
	                        var option = option.split('==');
	                        
	                        if (option[1]) {
	                            options.push([option[1], option[0]]);
	                        } else {
	                            options.push([option[0],option[0]]);
							}
						});
	                   
						element = Ext.applyIf({
					   		store			: new Ext.data.ArrayStore({
	                    		mode			: 'local',
								fields			: ['value','label'],
								data			: options
							}),
							mode 			: 'local',
							hiddenName		: tmpName,
							valueField		: 'value',
							displayField	: 'label'
						}, element);
					} else if ('modx-field-parent-change' == setting.xtype) {
						settings.push({
							name		: tmpName,
							xtype		: 'hidden',
							value		: undefined == _settings.values[tmpName] ? '' : _settings.values[tmpName].value,
							id			: tmpName + '_id',
						});
						
						element = Ext.applyIf({
							name		: tmpName + '_alias_ignore',
							formpanel	: 'clientsettings-panel-client',
							parentcmp	: tmpName + '_id',
							contextcmp	: null,
							currentid	: 0,
							value		: undefined == _settings.values[tmpName + '_alias_ignore'] ? '' : _settings.values[tmpName + '_alias_ignore'].value
						}, element);
					} else if ('modx-combo-browser' == setting.xtype) {
						settings.push({
							name		: tmpName,
							xtype		: 'hidden',
							value		: undefined == _settings.values[tmpName] ? '' : _settings.values[tmpName].value,
							id			: tmpName + '_image',
						});
						
						element = Ext.applyIf({
							name		: tmpName + '_alias_ignore',
							value		: undefined == _settings.values[tmpName + '_alias_ignore'] ? '' : _settings.values[tmpName + '_alias_ignore'].value,
							listeners : {
								'select'	: {
									fn	: function(data) {
										Ext.getCmp(tmpName + '_image').setValue(data.fullRelativeUrl);
									}
								}
							}
						}, element);
					} else if ('datefield' == setting.xtype) {
						element = Ext.applyIf({
							format		: MODx.config.manager_date_format,
							startDay	: parseInt(MODx.config.manager_week_start),
						}, element);
					} else if ('timefield' == setting.xtype) {	
						element = Ext.applyIf({
							format		: MODx.config.manager_time_format,
							offset_time	: MODx.config.server_offset_time
						}, element);
					} else if ('xdatetime' == setting.xtype) {	
						element = Ext.applyIf({
							dateFormat	: MODx.config.manager_date_format,
							timeFormat	: MODx.config.manager_time_format,
							startDay	: parseInt(MODx.config.manager_week_start),
							offset_time	: MODx.config.server_offset_time
						}, element);
					}
					
					if (/^\{(.+?)\}$/.test(setting.value)) {
						element = Ext.applyIf(Ext.decode(setting.value), element);
					}

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