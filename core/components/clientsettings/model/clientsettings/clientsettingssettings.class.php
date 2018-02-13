<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsSettings extends xPDOSimpleObject {
        /**
         * @access public.
         * @param Integer $categoryID.
         * @param Boolean $reset.
         * @return Integer.
         */
        public function getMenuIndex($categoryID, $reset = true) {
            if ($reset || $categoryID != $this->get('category_id')) {
                $c = $this->xpdo->newQuery('ClientSettingsSettings');
                
                $c->where([
                    'category_id' => $categoryID
                ]);
                
                $c->sortby('menuindex', 'DESC');
                $c->limit(1);
                
                if (null !== ($object = $this->xpdo->getObject('ClientSettingsSettings', $c))) {
                    return (int) $object->get('menuindex') + 1;
                } else {
                    return 0;
                }
            }
            
            return $this->get('menuindex');
        }
    }
	
?>