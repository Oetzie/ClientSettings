<?php
    
    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    switch($modx->event->name) {
        case 'OnLoadWebDocument':
            $clientsettings = $modx->getService('clientsettings', 'ClientSettings', $modx->getOption('clientsettings.core_path', null, $modx->getOption('core_path').'components/clientsettings/').'model/clientsettings/');
            
            if ($clientsettings instanceof ClientSettings) {
                return $clientsettings->onLoadWebDocument();
            }
            
            break;
    }
    
    return;
	
?>