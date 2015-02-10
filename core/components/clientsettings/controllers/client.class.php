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
					ClientSettings.config.settings = '.$this->modx->toJSON($this->getSettings()).';
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
		protected function getSettings() {
			$settings = array(
				'settings'	=> array(),
				'values'	=> array()
			);
			
			$criteria = $this->modx->newQuery('ClientSettingsCategories');
			$criteria->where(array(
				'active' 	=> 1
			));
			$criteria->sortby('menuindex', 'ASC');
			$criteria->sortby('name', 'ASC');
			
			foreach ($this->modx->getCollection('ClientSettingsCategories', $criteria) as $category) {
				$categorySettings = array_merge($category->toArray(), array(
					'settings' 	=> array()
				));
				
				$criteria = $this->modx->newQuery('ClientSettingsSettings');
				$criteria->where(array(
					'active' 	=> 1
				));
				$criteria->sortby('menuindex', 'ASC');
				$criteria->sortby('label', 'ASC');
				
				foreach ($category->getMany('SettingsAlias', $criteria) as $setting) {
					$categorySettings['settings'][] = $setting->toArray(); 
				}
				
				$settings['settings'][] = $categorySettings;
			}
			
			foreach ($this->modx->getCollection('ClientSettingsValues') as $key => $value) {
				$settings['values'][$value->context.':'.$value->setting] = $value->toArray();
			}
			
			return $settings;
		}
		
		/**
		 * @acces protected.
		 * @return Array.
		 */
		protected function getContext() {
			$contexts = array();

			foreach ($this->modx->getCollection('modContext', array('key:NOT IN' => array('mgr'))) as $context) {
				$contexts[] = $context->toArray();
			}
			
			return $contexts;
		}
    }

?>