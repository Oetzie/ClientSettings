<?php
    
    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    switch($modx->event->name) {
        case 'OnLoadWebDocument':
            $modx->getService('clientsettings', 'ClientSettings', $modx->getOption('clientsettings.core_path', null, $modx->getOption('core_path') . 'components/clientsettings/') . 'model/clientsettings/');
            
            if ($modx->clientsettings instanceof ClientSettings) {
                return $modx->clientsettings->onLoadWebDocument();
            }
            
            break;
    }
    
    return;
	
?>