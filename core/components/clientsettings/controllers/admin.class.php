<?php

	/**
	 * Client Settings
	 *
	 * Copyright 2017 by Oene Tjeerd de Bruin <modx@oetzie.nl>
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

	class ClientSettingsAdminManagerController extends ClientSettingsManagerController {
		/**
		 * @access public.
		 */
		public function loadCustomCssJs() {
			$this->addCSS($this->clientsettings->config['css_url'].'mgr/clientsettings.css');
			
			$this->addJavascript($this->clientsettings->config['js_url'].'mgr/widgets/admin.panel.js');
			
			$this->addJavascript($this->clientsettings->config['js_url'].'mgr/widgets/categories.grid.js');
			$this->addJavascript($this->clientsettings->config['js_url'].'mgr/widgets/settings.grid.js');
			
			$this->addLastJavascript($this->clientsettings->config['js_url'].'mgr/sections/admin.js');
		}
		
		/**
		 * @access public.
		 * @return String.
		 */
		public function getPageTitle() {
			return $this->modx->lexicon('clientsettings');
		}
		
		/**
		* @access public.
		* @return String.
		*/
		public function getTemplateFile() {
			return $this->clientsettings->config['templates_path'].'admin.tpl';
		}
		
		/**
		 * @access public.
		 * @param Array $scriptProperties.
		 */
		public function process(array $scriptProperties = array()) {
			if (!$this->modx->hasPermission('clientsettings_admin')) {
				$this->modx->sendRedirect($this->modx->getOption('manager_url').'?a='.$_GET['a'].'&namespace='.$this->clientsettings->config['namespace']);
			}
		}
	}

?>