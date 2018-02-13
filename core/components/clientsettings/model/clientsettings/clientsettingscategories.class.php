<?php
	
    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsCategories extends xPDOSimpleObject {
        /**
         * @access public.
         * @return Integer.
         */
        public function getMenuIndex() {
            $c = $this->xpdo->newQuery('ClientSettingsCategories');
            
            $c->sortby('menuindex', 'DESC');
            $c->limit(1);
            
            if (null !== ($object = $this->xpdo->getObject('ClientSettingsCategories', $c))) {
                return (int) $object->get('menuindex') + 1;
            } else {
                return 0;
            }
        }
    }
	
?>