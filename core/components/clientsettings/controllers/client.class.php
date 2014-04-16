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

	class ClientSettingsClientManagerController extends ClientSettingsManagerController {
		/**
		 * @acces public.
		 * @param Array $scriptProperties.
		 */
		public function process(array $scriptProperties = array()) {
			$this->addHtml('<script type="text/javascript">
				Ext.onReady(function() {
					ClientSettings.config.contexts = '.$this->modx->toJSON($this->getContext()).';
					ClientSettings.config.categories = '.$this->modx->toJSON($this->getCategories()).';
				});
			</script>');
		}
		
		/**
		 * @acces public.
		 */
		public function loadCustomCssJs() {
			$this->addCss($this->clientsettings->config['cssUrl'].'mgr/clientsettings.css');
			$this->addJavascript($this->clientsettings->config['jsUrl'].'mgr/widgets/client.panel.js');
			$this->addLastJavascript($this->clientsettings->config['jsUrl'].'mgr/sections/client.js');
		}
		
		/**
		 * @acces public.
		 * @return String.
		 */
		public function getPageTitle() {
			return $this->modx->lexicon('clientsettings');
		}
		
		/**
		 * @acces public.
		 * @return String.
		 */
		public function getTemplateFile() {
			return $this->clientsettings->config['templatesPath'].'client.tpl';
		}
		
		/**
		 * @acces protected.
		 * @return Array.
		 */
		protected function getCategories() {
			$categories = array();
			
			$query = $this->modx->newQuery('Categories');
			$query->where(array(
				'active' => 1
			));
			$query->sortby('menuindex', 'ASC');
			$query->sortby('name', 'ASC');
			
			foreach ($this->modx->getCollection('Categories', $query) as $key => $category) {
				$categoryTab = array_merge($category->toArray(), array(
					'items' => array()
				));
				
				$query = $this->modx->newQuery('Settings');
				$query->where(array(
					'active' => 1
				));
				$query->sortby('menuindex', 'ASC');
				$query->sortby('label', 'ASC');
				
				foreach ($category->getMany('SettingsAlias', $query) as $setting) {
					$settingTab = array_merge($setting->toArray(), array(
						'values' => array()
					));
					
					foreach ($setting->getMany('ValuesAlias', $this->modx->newQuery('Values')) as $value) {
						$value = $value->toArray();
						
						$settingTab['values'][$value['context']] = $value;
					}
					
					$categoryTab['items'][] = $settingTab;
				}
				
				$categories[] = $categoryTab;
			}
			
			return $categories;
		}
		
		/**
		 * @acces protected.
		 * @return Array.
		 */
		protected function getContext() {
			$contexts = array();
			
			$query = $this->modx->newQuery('modContext', array(
				'key:NOT IN' => array('mgr')
			));
			
			foreach ($this->modx->getCollection('modContext', $query) as $key => $context) {
				$contexts[] = array(
					'key' => $key
				);
			}
			
			return $contexts;
		}
    }

?>