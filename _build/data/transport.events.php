<?php

	$events = array();

	$events[0] = $modx->newObject('modEvent');
	$events[0]->fromArray(array(
		'name' 		=> 'onClientSettingsSave',
		'service' 	=> '6',
		'groupname' => 'System'
	), '', true, true);
		
	return $events;
	
?>