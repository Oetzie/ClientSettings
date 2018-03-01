<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsSettingsRemoveProcessor extends modObjectRemoveProcessor {
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
        public function initialize() {
            $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path') . 'components/clientsettings/') . 'model/clientsettings/');
            
            return parent::initialize();
        }
        
        /**
         * @access public.
         * @return Mixed.
         */
        public function afterRemove() {
            $this->modx->removeCollection('ClientSettingsValue', [
                'setting_id' => $this->object->get('id')
            ]);
        
            return parent::afterRemove();
        }
    }
    
    return 'ClientSettingsSettingsRemoveProcessor';
	
?>