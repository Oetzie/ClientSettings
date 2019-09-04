<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */
    
class ClientSettingsSaveProcessor extends modObjectProcessor
{
    /**
     * @access public.
     * @var String.
     */
    public $classKey = 'ClientSettingsValue';

    /**
     * @access public.
     * @var Array.
     */
    public $languageTopics = ['clientsettings:default'];

    /**
     * @access public.
     * @var String.
     */
    public $objectType = 'clientsettings.value';

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
        $this->modx->cacheManager->clearCache();

        foreach ($this->getProperties() as $key => $value) {
            if (strpos($key, ':') !== false) {
                list($context, $setting)    = explode(':', $key);
                list($setting, $key)        = explode('-', $setting);

                if ($key === null) {
                    $key = 'value';
                }

                $object = $this->modx->getObject('ClientSettingsValue', [
                    'setting_id'    => $setting,
                    'context'       => $context,
                    'key'           => $key
                ]);

                if (!$object) {
                    $object = $this->modx->newObject('ClientSettingsValue');
                }

                $object->fromArray([
                    'setting_id'    => $setting,
                    'context'       => $context,
                    'key'           => $key,
                    'value'         => serialize($value)
                ]);

                $object->save();
            }
        }

        $this->modx->invokeEvent('onClientSettingsSave');

        return $this->success();
    }
}

return 'ClientSettingsSaveProcessor';
