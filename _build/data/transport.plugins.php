<?php

	$plugins = array();
	
	$plugins[0] = $modx->newObject('modPlugin');
	$plugins[0]->fromArray(array(
		'id' 			=> 1,
		'name'			=> PKG_NAME,
		'description'	=> PKG_NAME.' '.PKG_VERSION.'-'.PKG_RELEASE.' plugin for MODx Revolution',
		'plugincode'	=> getSnippetContent($sources['plugins'].'/'.PKG_NAME_LOWER.'.plugin.php')
	));
	
	$events = array();

	$events[0]= $modx->newObject('modPluginEvent');
	$events[0]->fromArray(array(
	    'event' 		=> 'OnHandleRequest',
	    'priority' 		=> 0,
	    'propertyset' 	=> 0
	), '', true, true);

	$plugins[0]->addMany($events);
	
	return $plugins;
	
?>