<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */
    
class ClientSettingsSetting extends xPDOSimpleObject
{
    /**
     * @access public.
     * @return Integer.
     */
    public function getMenuIndex()
    {
        $criteria = $this->xpdo->newQuery('ClientSettingsSetting', [
            'category_id' => $this->get('category_id')
        ]);

        $criteria->sortby('menuindex', 'DESC');
        $criteria->limit(1);

        $object = $this->xpdo->getObject('ClientSettingsSetting', $criteria);

        if ($object) {
            return (int) $object->get('menuindex') + 1;
        }

        return 0;
    }
}
