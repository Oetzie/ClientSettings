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

	class ValuesSaveProcessor extends modObjectProcessor {
		/**
		 * @acces public.
		 * @var String.
		 */
		public $classKey = 'Values';
		
		/**
		 * @acces public.
		 * @var Array.
		 */
		public $languageTopics = array('clientsettings:default');
		
		/**
		 * @acces public.
		 * @var String.
		 */
		public $objectType = 'clientsettings.settings';
		
		/**
		 * @acces public
		 * @return Mixed.
		 */
		public function process() {
			$this->modx->cacheManager->clearCache();
			
			foreach ($this->getProperties() as $key => $value) {
				if (false !== strpos($key, ':')) {
					list($context, $setting) = explode(':', $key);
					
					$value = array('value' => $value);
					$setting = array('setting' => $setting, 'context' => $context);
					
					if (!$object = $this->modx->getObject($this->classKey, $setting)) {
						$object = $this->modx->newObject($this->classKey, array_merge($setting, $value));
					} else {
						$object->fromArray($value);	
					}
					
					$object->save();
				}
			}
			
			return $this->hasErrors() ? $this->failure() : $this->success();
		}
	}
	
	return 'ValuesSaveProcessor';
	
?>