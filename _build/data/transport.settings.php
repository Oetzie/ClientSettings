<?php

	$settings = array();

	$settings['admin_groups'] = $modx->newObject('modSystemSetting');
	$settings['admin_groups']->fromArray(array(
		'key' 		=> PKG_NAME_LOWER.'.admin_groups',
		'value' 	=> 'Administrator',
		'xtype' 	=> 'textfield',
		'namespace' => PKG_NAME_LOWER,
		'area' 		=> PKG_NAME_LOWER
	), '', true, true);
		
	return $settings;
	
?>