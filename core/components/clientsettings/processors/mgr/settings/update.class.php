<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */
    
class ClientSettingsSettingUpdateProcessor extends modObjectUpdateProcessor
{
    /**
     * @access public.
     * @var String.
     */
    public $classKey = 'ClientSettingsSetting';

    /**
     * @access public.
     * @var Array.
     */
    public $languageTopics = ['clientsettings:default'];

    /**
     * @access public.
     * @var String.
     */
    public $objectType = 'clientsettings.setting';

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
    public function beforeSet()
    {
        $this->setProperty('key', strtolower(str_replace([' ', '-'], '_', $this->getProperty('key'))));

        return parent::beforeSet();
    }

    /**
     * @access public.
     * @return Mixed.
     */
    public function beforeSave()
    {
        $criteria = [
            'id:!=' => $this->object->get('id'),
            'key'   => $this->object->get('key')
        ];

        if (!preg_match('/^([a-zA-Z0-9\_\-]+)$/i', $this->getProperty('key'))) {
            $this->addFieldError('key', $this->modx->lexicon('clientsettings.setting_error_character'));
        } else if ($this->doesAlreadyExist($criteria)) {
            $this->addFieldError('key', $this->modx->lexicon('clientsettings.setting_error_exists'));
        }

        $xtype = $this->getProperty('xtype');

        if ($xtype) {
            $extra      = [];
            $properties = $this->getProperty('extra');

            switch($xtype) {
                case 'datefield':
                    $extra = [
                        'min_date_value'                => $properties['min_date_value'] ?: '',
                        'max_date_value'                => $properties['max_date_value'] ?: ''
                    ];

                    break;
                case 'timefield':
                    $extra = [
                        'min_time_value'                => $properties['min_time_value'] ?: '',
                        'max_time_value'                => $properties['max_time_value'] ?: ''
                    ];

                    break;
                case 'datetimefield':
                    $extra = [
                        'min_date_value'                => $properties['min_date_value'] ?: '',
                        'max_date_value'                => $properties['max_date_value'] ?: '',
                        'min_time_value'                => $properties['min_time_value'] ?: '',
                        'max_time_value'                => $properties['max_time_value'] ?: ''
                    ];

                    break;
                case 'combo':
                case 'checkboxgroup':
                case 'radiogroup':
                    $extra = [
                        'values'                        => json_decode($properties['values'] ?: '{}', true),
                        'binded_values'                 => $properties['binded_values'] ?: ''
                    ];

                    break;
                case 'browser':
                    $extra = [
                        'browser_source'                => $properties['browser_source'] ?: '',
                        'browser_open_to'               => $properties['browser_open_to'] ?: '',
                        'browser_allowed_file_types'    => $properties['browser_allowed_file_types'] ?: ''
                    ];

                    break;
                default:
                    foreach ((array) $properties as $key => $property) {
                        if (strpos($key, $xtype . '_') !== false) {
                            $extra[$key] = $property;
                        }
                    }

                    break;
            }

            $this->object->set('extra', json_encode($extra));
        }

        return parent::beforeSave();
    }
}

return 'ClientSettingsSettingUpdateProcessor';
