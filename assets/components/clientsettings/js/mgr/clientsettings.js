var ClientSettings = function(config) {
    config = config || {};
    
    ClientSettings.superclass.constructor.call(this, config);
};

Ext.extend(ClientSettings, Ext.Component, {
    page    : {},
    window  : {},
    grid    : {},
    tree    : {},
    panel   : {},
    combo   : {},
    config  : {}
});

Ext.reg('clientsettings', ClientSettings);

ClientSettings = new ClientSettings();