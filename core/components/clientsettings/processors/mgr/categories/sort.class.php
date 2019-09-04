<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */
    
class ClientSettingsCategorySortProcessor extends modObjectProcessor
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

        return parent::initialize();
    }

    /**
     * @access public
     * @return Mixed.
     */
    public function process()
    {
        $index = 0;

        foreach ((array) explode(',', $this->getProperty('sort')) as $id) {
            $object = $this->modx->getObject($this->classKey, [
                'id' => $id
            ]);

            if ($object) {
                $object->fromArray([
                    'menuindex' => $index
                ]);

                if ($object->save()) {
                    $index++;
                }
            }
        }

        return $this->success();
    }
}

return 'ClientSettingsCategorySortProcessor';
