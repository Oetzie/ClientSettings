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

        $this->setProperty('key', strtolower(str_replace([' ', '-'], '_', $this->getProperty('key'))));

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
            $extra = [];

            switch($xtype) {
                case 'datefield':
                    $extra = [
                        'minDateValue'      => $this->getProperty('minDateValue'),
                        'maxDateValue'      => $this->getProperty('maxDateValue')
                    ];

                    break;
                case 'timefield':
                    $extra = [
                        'minTimeValue'      => $this->getProperty('minTimeValue'),
                        'maxTimeValue'      => $this->getProperty('maxTimeValue')
                    ];

                    break;
                case 'datetimefield':
                    $extra = [
                        'minDateValue'      => $this->getProperty('minDateValue'),
                        'maxDateValue'      => $this->getProperty('maxDateValue'),
                        'minTimeValue'      => $this->getProperty('minTimeValue'),
                        'maxTimeValue'      => $this->getProperty('maxTimeValue')
                    ];

                    break;
                case 'combo':
                case 'checkboxgroup':
                case 'radiogroup':
                    $extra = [
                        'values'            => json_decode($this->getProperty('values'), true),
                        'bindedValues'      => $this->getProperty('bindedValues')
                    ];

                    break;
                case 'browser':
                    $extra = [
                        'source'            => $this->getProperty('source'),
                        'openTo'            => $this->getProperty('openTo'),
                        'allowedFileTypes'  => $this->getProperty('allowedFileTypes')
                    ];

                    break;
                case 'tinymce':
                    $extra = [
                        'tinymceConfig'     => $this->getProperty('tinymceConfig')
                    ];

                    break;
                case 'clientgrid':
                    $extra = [
                        'gridConfig'        => $this->getProperty('gridConfig')
                    ];

                    break;
            }

            $this->object->set('extra', json_encode($extra));
        }

        return parent::beforeSave();
    }
}

return 'ClientSettingsSettingUpdateProcessor';
