<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */
    
class ClientSettingsCategory extends xPDOSimpleObject
{
    /**
     * @access public.
     * @return Integer.
     */
    public function getMenuIndex()
    {
        $criteria = $this->xpdo->newQuery('ClientSettingsCategory');

        $criteria->sortby('menuindex', 'DESC');
        $criteria->limit(1);

        $object = $this->xpdo->getObject('ClientSettingsCategory', $criteria);

        if ($object) {
            return (int) $object->get('menuindex') + 1;
        }

        return 0;
    }
}
