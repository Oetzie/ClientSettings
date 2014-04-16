<?php

	/**
	 * ClientSettings
	 *
	 * Copyright 2013 by Oene Tjeerd de Bruin <info@oetzie.nl>
	 *
	 * This file is part of ClientSettings, a real estate property listings component
	 * for MODX Revolution.
	 *
	 * ClientSettings is free software; you can redistribute it and/or modify it under
	 * the terms of the GNU General Public License as published by the Free Software
	 * Foundation; either version 2 of the License, or (at your option) any later
	 * version.
	 *
	 * ClientSettings is distributed in the hope that it will be useful, but WITHOUT ANY
	 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
	 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License along with
	 * ClientSettings; if not, write to the Free Software Foundation, Inc., 59 Temple Place,
	 * Suite 330, Boston, MA 02111-1307 USA
	 */

	switch($modx->event->name) {
		case 'OnHandleRequest':
			require_once $modx->getOption('clientsettings.core_path', null, $modx->getOption('core_path').'components/clientsettings/').'/model/clientsettings/clientsettings.class.php';
			
			$clientsettings = new ClientSettings($modx);
			
			$settings = $clientsettings->getSettings();
			
			$modx->setPlaceholders($settings, '+');
			
			foreach ($settings as $key => $value) {
				$modx->setOption($key, $value);
			}
		
			break;
	}
	
	return;
	
?>