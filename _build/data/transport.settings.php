<?php

	$settings = array();

	$settings[0] = $modx->newObject('modSystemSetting');
	$settings[0]->fromArray(array(
		'key' 		=> PKG_NAME_LOWER.'_admin_groups',
		'value' 	=> 'Administrator',
		'xtype' 	=> 'textfield',
		'namespace' => PKG_NAME_LOWER,
		'area' 		=> PKG_NAME_LOWER
	), '', true, true);
		
	return $settings;
	
?>