<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */

class ClientSettingsCategoryCreateProcessor extends modObjectCreateProcessor
{
    /**
     * @access public.
     * @var String.
     */
    public $classKey = 'ClientSettingsCategory';

    /**
     * @access public.
     * @var Array.
     */
    public $languageTopics = ['clientsettings:default'];

    /**
     * @access public.
     * @var String.
     */
    public $objectType = 'clientsettings.category';

    /**
     * @access public.
     * @return Mixed.
     */
    public function initialize()
    {
        $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path') . 'components/clientsettings/') . 'model/clientsettings/');

        if ($this->getProperty('active') === null) {
            $this->setProperty('active', 0);
        }

        return parent::initialize();
    }

    /**
     * @access public.
     * @return Mixed.
     */
    public function beforeSave()
    {
        $this->object->set('menuindex', $this->object->getMenuIndex());

        return parent::beforeSave();
    }
}

return 'ClientSettingsCategoryCreateProcessor';
