<?php
	
    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsCategory extends xPDOSimpleObject {
        /**
         * @access public.
         * @return Integer.
         */
        public function getMenuIndex() {
            $query = $this->xpdo->newQuery('ClientSettingsCategory');
            
            $query->sortby('menuindex', 'DESC');
            $query->limit(1);
            
            if (null !== ($object = $this->xpdo->getObject('ClientSettingsCategory', $query))) {
                return (int) $object->get('menuindex') + 1;
            } else {
                return 0;
            }
        }
        
        /**
         * @access public.
         * @return Array.
         */
        public function getSettings() {
            return $this->getMany('Settings');
        }
        
        /**
         * @access public.
         * @return Integer.
         */
        public function getSettingsCount() {
            return count($this->getSettings());
        }
    }
	
?>