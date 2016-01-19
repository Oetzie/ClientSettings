<?php

	/**
	 * Client Settings
	 *
	 * Copyright 2015 by Oene Tjeerd de Bruin <info@oetzie.nl>
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

	class CategoriesGetListProcessor extends modObjectGetListProcessor {
		/**
		 * @acces public.
		 * @var String.
		 */
		public $classKey = 'ClientSettingsCategories';
		
		/**
		 * @acces public.
		 * @var Array.
		 */
		public $languageTopics = array('clientsettings:default');
		
		/**
		 * @acces public.
		 * @var String.
		 */
		public $defaultSortField = 'menuindex';
		
		/**
		 * @acces public.
		 * @var String.
		 */
		public $defaultSortDirection = 'ASC';
		
		/**
		 * @acces public.
		 * @var String.
		 */
		public $objectType = 'clientsettings.categories';
		
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
			
			$this->setDefaultProperties(array(
				'dateFormat' => '%b %d, %Y %H:%M',
			));
			
			return parent::initialize();
		}
		
		/**
		 * @acces public.
		 * @param Object $c.
		 * @return Object.
		 */
		public function prepareQueryBeforeCount(xPDOQuery $c) {
			$query = $this->getProperty('query');
			
			if (!empty($query)) {
				$c->where(array(
					'name:LIKE' 			=> '%'.$query.'%',
					'OR:description:LIKE' 	=> '%'.$query.'%'
				));
			}
			
			return $c;
		}
		
		/**
		 * @acces public.
		 * @param Object $query.
		 * @return Array.
		 */
		public function prepareRow(xPDOObject $object) {
			$array = array_merge($object->toArray(), array(
				'settings'	=> count($object->getMany('ClientSettingsSettings'))
			));
			
			if (in_array($array['editedon'], array('-001-11-30 00:00:00', '0000-00-00 00:00:00', '0000-00-00', null))) {
				$array['editedon'] = '';
			} else {
				$array['editedon'] = strftime($this->getProperty('dateFormat'), strtotime($array['editedon']));
			}
			
			return $array;	
		}
	}

	return 'CategoriesGetListProcessor';
	
?>