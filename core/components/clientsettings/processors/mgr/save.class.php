<?php

	/**
	 * Client Settings
	 *
	 * Copyright 2016 by Oene Tjeerd de Bruin <info@oetzie.nl>
	 *
	 * This file is part of Client Settings, a real estate property listings component
	 * for MODX Revolution.
	 *
	 * Client Settings is free software; you can redistribute it and/or modify it under
	 * the terms of the GNU General Public License as published by the Free Software
	 * Foundation; either version 2 of the License, or (at your option) any later
	 * version.
	 *
	 * Client Settings is distributed in the hope that it will be useful, but WITHOUT ANY
	 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
	 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License along with
	 * Client Settings; if not, write to the Free Software Foundation, Inc., 59 Temple Place,
	 * Suite 330, Boston, MA 02111-1307 USA
	 */

	class ClientSettingsValuesSaveProcessor extends modObjectProcessor {
		/**
		 * @access public.
		 * @var String.
		 */
		public $classKey = 'ClientSettingsValues';
		
		/**
		 * @access public.
		 * @var Array.
		 */
		public $languageTopics = array('clientsettings:default');
		
		/**
		 * @access public.
		 * @var String.
		 */
		public $objectType = 'clientsettings.values';
		
		/**
		 * @access public.
		 * @var Object.
		 */
		public $clientsettings;
		
		/**
		 * @access public.
		 * @return Mixed.
		 */
		public function initialize() {
			$this->clientsettings = $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path').'components/clientsettings/').'model/clientsettings/');

			return parent::initialize();
		}
		
		/**
		 * @access public
		 * @return Mixed.
		 */
		public function process() {
			$this->modx->cacheManager->clearCache();
			
			foreach ($this->getProperties() as $key => $value) {
				if (false !== strpos($key, ':')) {
					list($context, $setting) = explode(':', $key);
					
					if (false !== strpos($setting, '-')) {
						list($setting, $key) = explode('-', $setting);
						
						if ('ignore' == $key) {
							continue;
						}
						
						$key = '-'.$key;
					} else {
						$key = '';
					}
					
					$setting = array(
						'setting_id' 	=> $setting,
						'key'			=> $key,
						'context' 		=> $context
					);
				
					if (null === ($object = $this->modx->getObject('ClientSettingsValues', $setting))) {
						$object = $this->modx->newObject('ClientSettingsValues');
					}
					
					$object->fromArray(array_merge($setting, array(
						'key'			=> $key,
						'value' 		=> serialize($value)
					)));	
					$object->save();
				}
			}
			
			$this->modx->invokeEvent('onClientSettingsSave');

			return $this->success();
		}
	}
	
	return 'ClientSettingsValuesSaveProcessor';
	
?>