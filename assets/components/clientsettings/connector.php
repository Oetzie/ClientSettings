<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    require_once dirname(dirname(dirname(__DIR__))) . '/config.core.php';
    
    require_once MODX_CORE_PATH . 'config/' . MODX_CONFIG_KEY . '.inc.php';
    require_once MODX_CONNECTORS_PATH . 'index.php';
    
    $modx->getService('clientsettings', 'ClientSettings', $modx->getOption('clientsettings.core_path', null, $modx->getOption('core_path') . 'components/clientsettings/') . 'model/clientsettings/');
    
    if ($modx->clientsettings instanceof ClientSettings) {
        $modx->request->handleRequest([
            'processors_path'   => $modx->clientsettings->config['processors_path'],
            'location'          => ''
        ]);
    }

?>