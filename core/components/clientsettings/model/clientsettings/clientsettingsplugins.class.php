<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */

require_once __DIR__ . '/clientsettings.class.php';

class ClientSettingsPlugins extends ClientSettings
{
    /**
     * @access public.
     */
    public function onLoadWebDocument()
    {
        if (!in_array($this->modx->context->get('key'), $this->getOption('exclude_contexts'), true)) {
            $settings = $this->getSettings();

            if (count($settings) >= 1) {
                $this->modx->setPlaceholders($settings, '+');

                foreach ($settings as $key => $value) {
                    $this->modx->setOption($key, $value);
                }
            }
        }
    }

    /**
     * @access public.
     * @return Array.
     */
    public function getSettings()
    {
        $settings = [];

        $criteria = $this->modx->newQuery('ClientSettingsValue');

        $criteria->setClassAlias('Value');

        $criteria->select($this->modx->getSelectColumns('ClientSettingsValue', 'Value'));
        $criteria->select($this->modx->getSelectColumns('ClientSettingsSetting', 'Setting', 'setting_', ['key', 'xtype', 'extra']));

        $criteria->innerJoin('ClientSettingsSetting', 'Setting');

        $criteria->where([
            'Setting.active'    => 1,
            'Value.context'     => $this->modx->context->get('key')
        ]);

        foreach ($this->modx->getCollection('ClientSettingsValue', $criteria) as $setting) {
            if ($setting->get('key') === 'value') {
                $value = unserialize($setting->get('value'));

                if (is_array($value)) {
                    $value = implode(',', $value);
                }

                $settings[$setting->get('setting_key')] = $this->formatValue($setting->get('setting_xtype'), json_decode($setting->get('setting_extra'), true), $value);
            }
        }

        return $settings;
    }

    /**
     * @access public.
     * @param String $type.
     * @param Array $properties.
     * @param String $value.
     * @return String.
     */
    protected function formatValue($type, array $properties = [], $value = '')
    {
        if (!empty($value) && $type === 'browser') {
            if (isset($properties['source'])) {
                $source = $this->modx->getObject('modMediaSource', [
                    'id' => $properties['source']
                ]);

                if ($source) {
                    $value = trim($source->getProperties()['baseUrl']['value'], '/') . '/' . $value;
                }
            }
        }

        return $value;
    }
}
