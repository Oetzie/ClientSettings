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

	class ClientSettingsHomeManagerController extends ClientSettingsManagerController {
		/**
		 * @access public.
		 */
		public function loadCustomCssJs() {
			$this->addCSS($this->clientsettings->config['css_url'].'mgr/clientsettings.css');
			
			$this->addJavascript($this->clientsettings->config['js_url'].'mgr/widgets/home.panel.js');
			
			$this->addLastJavascript($this->clientsettings->config['js_url'].'mgr/sections/home.js');

			$this->addHtml('<script type="text/javascript">
				Ext.onReady(function() {
					ClientSettings.config.contexts 		= '.$this->modx->toJSON($this->clientsettings->getContext()).';
					ClientSettings.config.categories 	= '.$this->modx->toJSON($this->clientsettings->getCategories()).';
				});
			</script>');
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
			return $this->clientsettings->config['templates_path'].'home.tpl';
		}
		
		/**
		 * @access public.
		 * @param Array $scriptProperties.
		 */
		public function process(array $scriptProperties = array()) {
			if ($this->modx->getOption('use_editor') && $richtext = $this->modx->getOption('which_editor')) {
				$properties = array(
					'editor' 	=> $richtext,
					'elements' 	=> array()
				);

				$onRichTextEditorInit = $this->modx->invokeEvent('OnRichTextEditorInit', $properties);
	            
	            if (is_array($onRichTextEditorInit)) {
					$onRichTextEditorInit = implode('', $onRichTextEditorInit);
            	}
            	
            	$this->addHtml($onRichTextEditorInit);
			}
		}
    }

?>