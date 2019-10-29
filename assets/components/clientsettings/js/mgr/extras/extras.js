ClientSettings.combo.Categories = function(config) {
    config = config || {};

    Ext.applyIf(config, {
        url         : ClientSettings.config.connector_url,
        baseParams  : {
            action      : 'mgr/categories/getlist',
            combo       : true
        },
        fields      : ['id', 'name', 'name_formatted'],
        hiddenName  : 'category_id',
        pageSize    : 15,
        valueField  : 'id',
        displayField : 'name_formatted'
    });

    ClientSettings.combo.Categories.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.combo.Categories, MODx.combo.ComboBox);

Ext.reg('clientsettings-combo-categories', ClientSettings.combo.Categories);

ClientSettings.combo.FieldTypes = function(config) {
    config = config || {};

    var data = [];

    Ext.iterate(ClientSettings.config.xtypes, function(xtype, label) {
        data.push([xtype, label]);
    });

    Ext.applyIf(config, {
        store       : new Ext.data.ArrayStore({
            mode        : 'local',
            fields      : ['xtype', 'label'],
            data        : data
        }),
        remoteSort  : ['label', 'asc'],
        hiddenName  : 'xtype',
        valueField  : 'xtype',
        displayField : 'label',
        mode        : 'local',
        value       : 'textfield'
    });

    ClientSettings.combo.FieldTypes.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.combo.FieldTypes, MODx.combo.ComboBox);

Ext.reg('clientsettings-combo-xtype', ClientSettings.combo.FieldTypes);

ClientSettings.combo.Values = function(config) {
    config = config || {};

    var id = Ext.id();

    Ext.applyIf(config, {
        id          : config.id || id,
        cls         : 'clientsettings-extra-combo',
        layout      : 'form',
        labelSeparator  : '',
        items       : [{
            xtype       : 'hidden',
            name        : 'values',
            id          : (config.id || id) + '-value',
            value       : config.value || '[]',
            anchor      : '100%'
        }],
        listeners   : {
            afterrender : {
                fn          : this.decodeData,
                scope       : this
            }
        }
    });

    ClientSettings.combo.Values.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings.combo.Values, MODx.Panel, {
    decodeData: function() {
        var textfield = Ext.getCmp(this.config.id + '-value');

        if (textfield) {
            var data = Ext.decode(textfield.getValue() || '[]');

            if (data && data.length >= 1) {
                for (var i = 0; i < data.length; i++) {
                    this.addElement(i + 1, data[i]);
                }
            } else {
                this.addElement(1, {});
            }
        }
    },
    encodeData: function() {
        var textfield = Ext.getCmp(this.config.id + '-value');

        if (textfield) {
            var data = [];
            var values = {
                value : [],
                label : []
            };

            this.findByType('textfield').forEach(function(element) {
                if (element.xtype === 'textfield') {
                    values[element.type].push(element.getValue());
                }
            });

            values.value.forEach(function(value, index) {
                data.push({
                    value : value,
                    label : values.label[index] || ''
                });
            });

            textfield.setValue(Ext.encode(data));
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
        var id = Ext.id();

        var nextBtn = {
            xtype       : 'box',
            autoEl      : {
                tag         : 'a',
                html        : '<i class="icon icon-plus"></i>',
                cls         : 'x-btn x-btn-clientsettings',
                current     : this.config.id + '-' + id
            },
            listeners   : {
                render      : {
                    fn          : function(button) {
                        button.getEl().on('click', (function(event) {
                            var index = this.items.findIndexBy(function(item) {
                                return item.id === button.autoEl.current;
                            });

                            this.addElement(index + 1, {});
                        }).bind(this));
                    },
                    scope       : this
                }
            }
        };

        var prevBtn = {
            xtype       : 'box',
            autoEl      : {
                tag         : 'a',
                html        : '<i class="icon icon-minus"></i>',
                cls         : 'x-btn x-btn-clientsettings',
                current     : this.config.id + '-' + id
            },
            listeners   : {
                render      : {
                    fn          : function(button) {
                        button.getEl().on('click', (function(event) {
                            var index = this.items.findIndexBy(function(item) {
                                return item.id === button.autoEl.current;
                            });

                            this.removeElement(index);
                        }).bind(this));
                    },
                    scope       : this
                }
            }
        };

        return {
            layout      : 'column',
            id          : this.config.id + '-' + id,
            cls         : 'clientsettings-extra-combo-item',
            defaults    : {
                layout      : 'form',
                hideLabels  : true
            },
            items       : [{
                columnWidth : .42,
                items       : [{
                    xtype       : 'textfield',
                    anchor      : '100%',
                    emptyText   : _('clientsettings.value'),
                    type        : 'value',
                    value       : data.value || '',
                    listeners   : {
                        blur        : {
                            fn          : this.encodeData,
                            scope       : this
                        }
                    }
                }]
            }, {
                columnWidth : .42,
                items       : [{
                    xtype       : 'textfield',
                    anchor      : '100%',
                    emptyText   : _('clientsettings.label'),
                    type        : 'label',
                    value       : data.label || '',
                    listeners   : {
                        blur        : {
                            fn          : this.encodeData,
                            scope       : this
                        }
                    }
                }]
            }, {
                columnWidth : .16,
                items       : index === 1 ? [nextBtn] : [nextBtn, prevBtn]
            }]
        };
    }
});

Ext.reg('clientsettings-combo-values', ClientSettings.combo.Values);