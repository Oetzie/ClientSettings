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

	class SettingsCreateProcessor extends modObjectCreateProcessor {
		/**
		 * @acces public.
		 * @var String.
		 */
		public $classKey = 'Settings';
		
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
		 * @acces public.
		 * @return Mixed.
		 */
		public function beforeSave() {
			$key = $this->getProperty('key');
			
			if (!preg_match('/^([a-zA-Z0-9\_\-]+)$/si', $key)) {
				$this->addFieldError('key', $this->modx->lexicon('clientsettings.setting_error_character'));
			} else if ($this->doesAlreadyExist(array('key' => $key))) {
				$this->addFieldError('key', $this->modx->lexicon('clientsettings.setting_error_exists'));
			}
			
			return parent::beforeSave();
		}
	}
	
	return 'SettingsCreateProcessor';
	
?>