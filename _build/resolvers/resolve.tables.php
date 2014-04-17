<?php

	if ($object->xpdo) {
	    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
	        case xPDOTransport::ACTION_INSTALL:
	            $modx =& $object->xpdo;
	            $modx->addPackage('clientsettings', $modx->getOption('clientsettings.core_path', null, $modx->getOption('core_path').'components/clientsettings/').'model/');
	
	            $manager = $modx->getManager();
	
	            $manager->createObjectContainer('Categories');
	            $manager->createObjectContainer('Settings');
	            $manager->createObjectContainer('Values');
	
	            break;
	        case xPDOTransport::ACTION_UPGRADE:
	            break;
	    }
	}
	
	return true;