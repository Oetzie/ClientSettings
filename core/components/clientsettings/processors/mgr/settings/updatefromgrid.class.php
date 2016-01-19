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
	 
	require_once dirname(__FILE__).'/update.class.php';
	
	class SettingsUpdateFromGridProcessor extends SettingsUpdateProcessor {
		/**
	 	 * @acces public.
	 	 * @return Mixed.
		 */
		public function initialize() {
			$data = $this->getProperty('data');
			
			if (empty($data)) {
				return $this->modx->lexicon('invalid_data');
			}
		
			$data = $this->modx->fromJSON($data);
		
			if (empty($data)) {
				return $this->modx->lexicon('invalid_data');
			}
			
			if (isset($data['extra'])) {
				$data['extra'] = $this->modx->toJSON($data['extra']);
			}
		
			$this->setProperties($data);
			$this->unsetProperty('data');
		
			return parent::initialize();
		}
	}
	
	return 'SettingsUpdateFromGridProcessor';
?>