<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    require_once dirname(dirname(dirname(dirname(__FILE__)))).'/config.core.php';
    
    require_once MODX_CORE_PATH.'config/'.MODX_CONFIG_KEY.'.inc.php';
    require_once MODX_CONNECTORS_PATH.'index.php';
    
    $instance = $modx->getService('clientsettings', 'ClientSettings', $modx->getOption('clientsettings.core_path', null, $modx->getOption('core_path').'components/clientsettings/').'model/clientsettings/');
    
    if ($instance instanceOf ClientSettings) {
        $modx->request->handleRequest([
            'processors_path'   => $instance->config['processors_path'],
            'location'          => ''
        ]);
    }

?>