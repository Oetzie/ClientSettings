<?php

	$category = $modx->newObject('modCategory');
	$category->fromArray(array(
	    'id' 		=> 1,
	    'category' 	=> PKG_NAME
	), '', true, true);
	 
	return $category;

?>