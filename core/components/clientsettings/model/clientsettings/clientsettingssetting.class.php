<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsSetting extends xPDOSimpleObject {
        /**
         * @access public.
         * @param Integer $categoryID.
         * @param Boolean $reset.
         * @return Integer.
         */
        public function getMenuIndex($categoryID, $reset = true) {
            if ($reset || $categoryID != $this->get('category_id')) {
                $query = $this->xpdo->newQuery('ClientSettingsSetting');
                
                $query->where([
                    'category_id' => $categoryID
                ]);
                
                $query->sortby('menuindex', 'DESC');
                $query->limit(1);
                
                if (null !== ($object = $this->xpdo->getObject('ClientSettingsSetting', $query))) {
                    return (int) $object->get('menuindex') + 1;
                } else {
                    return 0;
                }
            }
            
            return $this->get('menuindex');
        }
    }
	
?>