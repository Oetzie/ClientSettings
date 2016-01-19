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

	class ClientSettingsAdminManagerController extends ClientSettingsManagerController {
		/**
		 * @acces public.
		 * @param Array $scriptProperties.
		 */
		public function process(array $scriptProperties = array()) {
			if (!$this->clientsettings->hasPermission()) {
				$this->modx->sendRedirect($this->modx->getOption('manager_url').'?a='.$_GET['a']);
			}
		}
		
		/**
		 * @acces public.
		 */
		public function loadCustomCssJs() {
			$this->addJavascript($this->modx->getOption('js_url', $this->clientsettings->config).'mgr/widgets/admin.panel.js');
			
			$this->addJavascript($this->modx->getOption('js_url', $this->clientsettings->config).'mgr/widgets/categories.grid.js');
			$this->addJavascript($this->modx->getOption('js_url', $this->clientsettings->config).'mgr/widgets/settings.grid.js');
			
			$this->addLastJavascript($this->modx->getOption('js_url', $this->clientsettings->config).'mgr/sections/admin.js');
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
			return $this->modx->getOption('templates_path', $this->clientsettings->config).'admin.tpl';
		}
	}

?>