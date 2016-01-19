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

	class ClientSettings {
		/**
		 * @acces public.
		 * @var Object.
		 */
		public $modx;
		
		/**
		 * @acces public.
		 * @var Array.
		 */
		public $config = array();
		
		/**
		 * @acces public.
		 * @param Object $modx.
		 * @param Array $config.
		*/
		function __construct(modX &$modx, array $config = array()) {
			$this->modx =& $modx;
		
			$corePath 		= $this->modx->getOption('clientsettings.core_path', $config, $this->modx->getOption('core_path').'components/clientsettings/');
			$assetsUrl 		= $this->modx->getOption('clientsettings.assets_url', $config, $this->modx->getOption('assets_url').'components/clientsettings/');
			$assetsPath 	= $this->modx->getOption('clientsettings.assets_path', $config, $this->modx->getOption('assets_path').'components/clientsettings/');
		
			$this->config = array_merge(array(
				'namespace'				=> $this->modx->getOption('namespace', $config, 'clientsettings'),
				'helpurl'				=> $this->modx->getOption('namespace', $config, 'clientsettings'),
				'language'				=> 'clientsettings:default',
				'base_path'				=> $corePath,
				'core_path' 			=> $corePath,
				'model_path' 			=> $corePath.'model/',
				'processors_path' 		=> $corePath.'processors/',
				'elements_path' 		=> $corePath.'elements/',
				'chunks_path' 			=> $corePath.'elements/chunks/',
				'cronjobs_path' 		=> $corePath.'elements/cronjobs/',
				'plugins_path' 			=> $corePath.'elements/plugins/',
				'snippets_path' 		=> $corePath.'elements/snippets/',
				'templates_path' 		=> $corePath.'templates/',
				'assets_path' 			=> $assetsPath,
				'js_url' 				=> $assetsUrl.'js/',
				'css_url' 				=> $assetsUrl.'css/',
				'assets_url' 			=> $assetsUrl,
				'connector_url'			=> $assetsUrl.'connector.php',
			), $config);
		
			$this->modx->addPackage('clientsettings', $this->config['model_path']);
		}
		
		/**
		 * @acces public.
		 * @return String.
		 */
		public function getHelpUrl() {
			return $this->config['helpurl'];
		}
		
		/**
		 * @acces public.
		 * @return Boolean.
		 */
		public function hasPermission() {
			$usergroups = $this->modx->getOption('newsletter_admin_groups', null, 'Administrator');
			
			$isMember = $this->modx->user->isMember(explode(',', $usergroups), false);
			
			if (!$isMember) {
				$version = $this->modx->getVersionData();
				
				if (version_compare($version['full_version'], '2.2.1-pl') == 1) {
					$isMember = (bool) $this->modx->user->get('sudo');
				}
			}
			
			return $isMember;
		}
		
		/**
		 * @acces protected.
		 * @return Array.
		 */
		public function getCategories() {
			$output = array(
				'categories'	=> array(),
				'values'		=> array()
			);
			
			$criteria = $this->modx->newQuery('ClientSettingsCategories');
			$criteria->where(array(
				'active' 	=> 1
			));
			$criteria->sortby('menuindex', 'ASC');
			$criteria->sortby('name', 'ASC');
			
			foreach ($this->modx->getCollection('ClientSettingsCategories', $criteria) as $category) {				
				$settings = array();
				
				$criteria = $this->modx->newQuery('ClientSettingsSettings');
				$criteria->where(array(
					'category_id'	=> $category->id,
					'active' 		=> 1
				));
				$criteria->sortby('menuindex', 'ASC');
				
				foreach ($category->getMany('ClientSettingsSettings', $criteria) as $setting) {
					$settings[] = array_merge($setting->toArray(), array(
						'extra'	=> $this->modx->fromJSON($setting->extra)	
					));
				}
				
				$output['categories'][] = array_merge($category->toArray(), array(
					'settings' 	=> $settings
				));
			}
			
			foreach ($this->modx->getCollection('ClientSettingsValues') as $key => $value) {
				$output['values'][$value->context.':'.$value->setting_id.$value->key] = array_merge($value->toArray(), array(
					'value'	=> unserialize($value->value)
				));
			}
			
			return $output;
		}
		
		/**
		 * @acces protected.
		 * @return Array.
		 */
		public function getContext() {
			$contexts = array();

			foreach ($this->modx->getCollection('modContext', array('key:!=' => 'mgr')) as $context) {
				$contexts[] = $context->toArray();
			}
			
			return $contexts;
		}
		
		/**
		 * @acces public.
		 * @return Array.
		 */
		public function getSettings() {
			$settings = array();
			
			$criteria = $this->modx->newQuery('ClientSettingsValues');
			$criteria->leftJoin('ClientSettingsSettings', 'ClientSettingsSettings');
			$criteria->select($this->modx->getSelectColumns('ClientSettingsValues', 'ClientSettingsValues'));
			$criteria->select($this->modx->getSelectColumns('ClientSettingsSettings', 'ClientSettingsSettings', 'setting_', array('key')));
			
			$criteria->where(array(
				'ClientSettingsSettings.active' 	=> 1,
				'ClientSettingsValues.context'		=> $this->modx->context->key
			));

			foreach ($this->modx->getCollection('ClientSettingsValues', $criteria) as $setting) {
				if (!preg_match('/-replace$/si', $setting->setting_key)) {
					$value =  unserialize($setting->value);
					
					if (is_array($value)) {
						$value = implode(',', $value);
					}
					
					$settings[$setting->setting_key] = $value;
				}
			}
			
			return $settings;
		}
	}
	
?>