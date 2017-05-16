<?php
	
	/**
	 * Client Settings
	 *
	 * Copyright 2017 by Oene Tjeerd de Bruin <modx@oetzie.nl>
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

	class ClientSettingsCategoriesCreateProcessor extends modObjectCreateProcessor {
		/**
		 * @access public.
		 * @var String.
		 */
		public $classKey = 'ClientSettingsCategories';
		
		/**
		 * @access public.
		 * @var Array.
		 */
		public $languageTopics = array('clientsettings:default');
		
		/**
		 * @access public.
		 * @var String.
		 */
		public $objectType = 'clientsettings.categories';
		
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
		
			if (null === $this->getProperty('active')) {
				$this->setProperty('active', 0);
			}
			
			if (null === $this->getProperty('menuindex')) {
				$criteria = $this->modx->newQuery('ClientSettingsCategories');
				$criteria->sortby('menuindex', 'DESC');
				$criteria->limit(1);
				
				if (null !== ($object = $this->modx->getObject('ClientSettingsCategories', $criteria))) {
					$this->setProperty('menuindex', $object->menuindex + 1);
				} else {
					$this->setProperty('menuindex', 0);
				}
			}

			return parent::initialize();
		}
	}
	
	return 'ClientSettingsCategoriesCreateProcessor';
	
?>