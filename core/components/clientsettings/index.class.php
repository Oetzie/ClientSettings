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

	abstract class ClientSettingsManagerController extends modExtraManagerController {
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
			require_once $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path').'components/clientsettings/').'/model/clientsettings/clientsettings.class.php';
			
			$this->clientsettings = new ClientSettings($this->modx);
			
			$this->addJavascript($this->clientsettings->config['jsUrl'].'mgr/clientsettings.js');
			$this->addHtml('<script type="text/javascript">
				Ext.onReady(function() {
					MODx.config.help_url = "http://rtfm.modx.com/extras/revo/'.$this->clientsettings->getHelpUrl().'";
			
					ClientSettings.config = '.$this->modx->toJSON(array_merge(array('admin' => $this->clientsettings->hasPermission()), $this->clientsettings->config)).';
				});
			</script>');
			
			return parent::initialize();
		}
		
		/**
		 * @acces public.
		 * @return Array.
		 */
		public function getLanguageTopics() {
			return array('clientsettings:default', 'setting');
		}
		
		/**
		 * @acces public.
		 * @returns Boolean.
		 */	    
		public function checkPermissions() {
			return true;
		}
	}
		
	class IndexManagerController extends ClientSettingsManagerController {
		/**
		 * @acces public.
		 * @return String.
		 */
		public static function getDefaultController() {
			return 'client';
		}
	}

?>