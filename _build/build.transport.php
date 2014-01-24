<?php

	$mtime = microtime();
	$mtime = explode(" ", $mtime);
	$mtime = $mtime[1] + $mtime[0];
	$tstart = $mtime;
	set_time_limit(0);

	define('PKG_NAME', 'ClientSettings');
	define('PKG_NAME_LOWER', strtolower(PKG_NAME));
	define('PKG_NAMESPACE', strtolower(PKG_NAME));
	
	define('PKG_VERSION','1.0.0');
	define('PKG_RELEASE','pl');

	$root = dirname(dirname(__FILE__)).'/';

	$sources = array(
	    'root' 			=> $root,
	    'build' 		=> $root.'_build/',
	    'data' 			=> $root.'_build/data/',
	    'resolvers' 	=> $root.'_build/resolvers/',
	    'chunks' 		=> $root.'core/components/'.PKG_NAME_LOWER.'/elements/chunks/',
	    'snippets' 		=> $root.'core/components/'.PKG_NAME_LOWER.'/elements/snippets/',
	    'plugins' 		=> $root.'core/components/'.PKG_NAME_LOWER.'/elements/plugins/',
	    'lexicon' 		=> $root.'core/components/'.PKG_NAME_LOWER.'/lexicon/',
	    'docs' 			=> $root.'core/components/'.PKG_NAME_LOWER.'/docs/',
	    'pages' 		=> $root.'core/components/'.PKG_NAME_LOWER.'/elements/pages/',
	    'source_assets' => $root.'assets/components/'.PKG_NAME_LOWER,
	    'source_core' 	=> $root.'core/components/'.PKG_NAME_LOWER,
	);

	require_once $sources['build'].'/build.config.php';
	require_once MODX_CORE_PATH.'model/modx/modx.class.php';
	require_once $sources['build'].'/includes/functions.php';
	
	$modx = new modX();
	$modx->initialize('mgr');
	$modx->setLogLevel(modX::LOG_LEVEL_INFO);
	
	echo XPDO_CLI_MODE ? '' : '<pre>';
	
	$modx->setLogTarget('ECHO');
	
	$modx->loadClass('transport.modPackageBuilder', '', false, true);
	
	$builder = new modPackageBuilder($modx);
	$builder->createPackage(PKG_NAMESPACE, PKG_VERSION, PKG_RELEASE);
	$builder->registerNamespace(PKG_NAMESPACE, false, true, '{core_path}components/'.PKG_NAMESPACE.'/');
	
	/* Category */
	
	$modx->log(modX::LOG_LEVEL_INFO, 'Packaging in category...');
	
	$category = include $sources['data'].'transport.category.php';
	
	if (empty($category)) {
		$modx->log(modX::LOG_LEVEL_ERROR, 'No category to be packed.');
	} else {
		$modx->log(modX::LOG_LEVEL_INFO, 'Packaging in plugin...');
		
		$plugin = $modx->newObject('modPlugin');
		$plugin->fromArray(array(
			'id' 			=> 1,
			'name'			=> PKG_NAME,
			'description'	=> PKG_NAME.' '.PKG_VERSION.'-'.PKG_RELEASE.' plugin for MODx Revolution',
			'plugincode'	=> getSnippetContent($sources['plugins'].'/'.PKG_NAME_LOWER.'.plugin.php')
		));
		
		$events = include $sources['data'].'transport.plugin.events.php';
		
		if (!is_array($events) || empty($events)) {
		    $modx->log(xPDO::LOG_LEVEL_ERROR, 'No plugin events to be packed.');
		} else {
			$plugin->addMany($events);
			
		    $modx->log(xPDO::LOG_LEVEL_INFO, 'Plugin events packed.');
		    
		    flush();
		}
		
		$category->addMany($plugin);
			
		$modx->log(modX::LOG_LEVEL_INFO, 'Plugin packed.');
		
		$builder->putVehicle($builder->createVehicle($category, array(
		    xPDOTransport::UNIQUE_KEY 		=> 'category',
		    xPDOTransport::PRESERVE_KEYS 	=> false,
		    xPDOTransport::UPDATE_OBJECT 	=> true,
		    xPDOTransport::RELATED_OBJECTS 	=> true,
		    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => array (
		        'Plugins' => array(
		            xPDOTransport::PRESERVE_KEYS 	=> false,
		            xPDOTransport::UPDATE_OBJECT 	=> true,
		            xPDOTransport::UNIQUE_KEY 		=> 'name'
		        ),
		        'PluginEvents' => array(
		            xPDOTransport::PRESERVE_KEYS 	=> true,
		            xPDOTransport::UPDATE_OBJECT 	=> false,
		            xPDOTransport::UNIQUE_KEY 		=> array('pluginid', 'event'),
		        )
		    )
		)));
		
		$modx->log(modX::LOG_LEVEL_INFO, 'Category packed.');
	}
	
	unset($category);
	
	/* Menu */
	
	$modx->log(modX::LOG_LEVEL_INFO, 'Packaging in menu...');
	
	$menu = include $sources['data'].'transport.menu.php';
	
	if (empty($menu)) {
		$modx->log(modX::LOG_LEVEL_ERROR, 'No menu found to be packed.');
	} else {
		$vehicle = $builder->createVehicle($menu, array (
		    xPDOTransport::PRESERVE_KEYS 	=> true,
		    xPDOTransport::UPDATE_OBJECT 	=> true,
		    xPDOTransport::UNIQUE_KEY 		=> 'text',
		    xPDOTransport::RELATED_OBJECTS 	=> true,
		    xPDOTransport::RELATED_OBJECT_ATTRIBUTES => array (
		        'Action' => array (
		            xPDOTransport::PRESERVE_KEYS 	=> false,
		            xPDOTransport::UPDATE_OBJECT 	=> true,
		            xPDOTransport::UNIQUE_KEY 	=> array ('namespace','controller')
		        ),
		    ),
		));
		
		$modx->log(modX::LOG_LEVEL_INFO, 'Adding in PHP resolvers...');
		
		$vehicle->resolve('file', array(
	    	'source' => $sources['source_assets'],
	    	'target' => "return MODX_ASSETS_PATH.'components/';",
	    ));
	    
		$vehicle->resolve('file', array(
		    'source' => $sources['source_core'],
		    'target' => "return MODX_CORE_PATH.'components/';",
		));
		
		$vehicle->resolve('php',array(
		    'source' => $sources['resolvers'].'resolve.tables.php',
		));
		
		$builder->putVehicle($vehicle);
		
		$modx->log(modX::LOG_LEVEL_INFO, 'Menu packed.');
	}

	unset($menu, $vehicle);
	
	/* Settings */
	
	$modx->log(modX::LOG_LEVEL_INFO, 'Packaging in system settings...');
	
	$settings = include $sources['data'].'transport.settings.php';
	
	if (!is_array($settings) || empty($settings)) {
		$modx->log(modX::LOG_LEVEL_ERROR, 'No system settings found to be packed.');
	} else {
    	foreach ($settings as $setting) {
	         $builder->putVehicle($builder->createVehicle($setting, array(
	         	xPDOTransport::UNIQUE_KEY 		=> 'key',
	         	xPDOTransport::PRESERVE_KEYS 	=> true,
	         	xPDOTransport::UPDATE_OBJECT 	=> false
	         )));
	    }
	    
	    $modx->log(xPDO::LOG_LEVEL_INFO, count($settings).' system settings packed.');
	    
	    flush();
	}
	
	unset($settings);
	
	$modx->log(xPDO::LOG_LEVEL_INFO, 'Setting Package Attributes...');
	
	flush();
	
	$builder->setPackageAttributes(array(
	    'license' 	=> file_get_contents($sources['docs'].'license.txt'),
	    'readme' 	=> file_get_contents($sources['docs'].'readme.txt'),
	    'changelog' => file_get_contents($sources['docs'].'changelog.txt'),
	));

	$modx->log(xPDO::LOG_LEVEL_INFO, 'Zipping up package...');
	
	flush();
	
	$builder->pack();
	
	$mtime		= microtime();
	$mtime		= explode(" ", $mtime);
	$mtime		= $mtime[1] + $mtime[0];
	$tend		= $mtime;
	$totalTime	= ($tend - $tstart);
	$totalTime	= sprintf("%2.4f s", $totalTime);

	$modx->log(modX::LOG_LEVEL_INFO, 'Package Built: Execution time: {'.$totalTime.'}');
	
	echo XPDO_CLI_MODE ? '' : '</pre>';

	exit();