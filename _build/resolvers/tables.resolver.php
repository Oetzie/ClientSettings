<?php

    $action = $options[xPDOTransport::PACKAGE_ACTION];
    
    if ($object->xpdo) {
        switch ($action) {
            case xPDOTransport::ACTION_INSTALL:
                $modx =& $object->xpdo;
                $modx->addPackage('clientsettings', $modx->getOption('clientsettings.core_path', null, $modx->getOption('core_path').'components/clientsettings/').'model/');
    
                $manager = $modx->getManager();
    
                $manager->createObjectContainer('ClientSettingsCategories');
                $manager->createObjectContainer('ClientSettingsSettings');
                $manager->createObjectContainer('ClientSettingsValues');
    
                break;
        }
    }
    
    return true;

?>