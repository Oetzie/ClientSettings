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

	class SettingsCreateProcessor extends modObjectCreateProcessor {
		/**
		 * @acces public.
		 * @var String.
		 */
		public $classKey = 'ClientSettingsSettings';
		
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
		 * @var Object.
		 */
		public $clientsettings;
		
		/**
		 * @acces public.
		 * @return Mixed.
		 */
		public function initialize() {
			$this->clientsettings = $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path').'components/clientsettings/').'model/clientsettings/');
		
			if (null === $this->getProperty('active')) {
				$this->setProperty('active', 0);
			}
			
			if (null === $this->getProperty('menuindex')) {
				$criteria = $this->modx->newQuery($this->classKey);
				$criteria->where(array(
					'category_id' => $this->getProperty('category_id')
				));
				$criteria->sortby('menuindex', 'DESC');
				$criteria->limit(1);
				
				if (null !== ($object = $this->modx->getObject($this->classKey, $criteria))) {
					$this->setProperty('menuindex', $object->menuindex + 1);
				} else {
					$this->setProperty('menuindex', 0);
				}
			}
			
			if ($xtype = $this->getProperty('xtype')) {
				switch($xtype) {
					case 'datefield':
						$extra = array(
							'minDateValue'	=> $this->getProperty('minDateValue'),
							'maxDateValue'	=> $this->getProperty('maxDateValue')
						);
						
						break;
					case 'timefield':
						$extra = array(
							'minTimeValue'	=> $this->getProperty('minTimeValue'),
							'maxTimeValue'	=> $this->getProperty('maxTimeValue')
						);
						
						break;
					case 'datetimefield':
						$extra = array(
							'minDateValue'	=> $this->getProperty('minDateValue'),
							'maxDateValue'	=> $this->getProperty('maxDateValue'),
							'minTimeValue'	=> $this->getProperty('minTimeValue'),
							'maxTimeValue'	=> $this->getProperty('maxTimeValue')
						);
						
						break;
					case 'richtext':
						$extra = array(
							'toolbar1'		=> $this->getProperty('toolbar1'),
							'toolbar2'		=> $this->getProperty('toolbar2'),
							'toolbar3'		=> $this->getProperty('toolbar3'),
							'plugins'		=> $this->getProperty('plugins')
						);
						
						break;
					case 'combo':
					case 'checkboxgroup':
					case 'radiogroup':
						$extra = array(
							'values'	=> $this->modx->fromJSON($this->getProperty('values'))
						);
						
						break;
					case 'browser':
						$extra = array(
							'browser'	=> $this->getProperty('browser'),
							'openTo'	=> $this->getProperty('openTo'),
							'allowedFileTypes'	=> $this->getProperty('allowedFileTypes')
						);

						break;
					case 'default':
						$extra = array();
						
						break;
				}
				
				$this->setProperty('extra', $this->modx->toJSON($extra));
			}

			return parent::initialize();
		}
		
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