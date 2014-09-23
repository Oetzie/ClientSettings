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
				title		: context.key,
	            defaults	: {
	            	autoHeight	: true,
	            	autoWidth	: true,
	            	border		: false
	            },
	            items		: _this.categories(context)
	        });
		});
		
		return contexts;
	},
    categories: function(context) {
    	var categories = [];
    	var _this = this;

	    Ext.each(ClientSettings.config.categories, function(category) {
	    	var settings = [];

	    	Ext.iterate(category.items, function(setting) {
	    		var exclude = setting.exclude.split(',');

	    		if (-1 == exclude.indexOf(context.key)) {
		    		var element = {
	                    name		: context.key + ':' + setting.key,
	                    xtype		: setting.xtype,
	                    fieldLabel	: setting.label,
	                    value		: undefined !== setting.values[context.key] ? setting.values[context.key].value : '',
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
							hiddenName		: context.key + ':' + setting.key,
							valueField		: 'value',
							displayField	: 'label'
						});
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