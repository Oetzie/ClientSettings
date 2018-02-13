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
        public $classKey = 'ClientSettingsSettings';
        
        /**
         * @access public.
         * @var Array.
         */
        public $languageTopics = ['clientsettings:default'];
        
        /**
         * @access public.
         * @var String.
         */
        public $objectType = 'clientsettings.settings';
        
        /**
         * @access public.
         * @var Object.
         */
        public $clientsettings;
        
        /**
         * @access public.
         * @return Mixed.
         */
        public function initialize() {
            $this->clientsettings = $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path').'components/clientsettings/').'model/clientsettings/');
            
            return parent::initialize();
        }
        
        /**
         * @access public.
         * @return Mixed.
         */
        public function afterRemove() {
            $this->modx->removeCollection('ClientSettingsValues', [
                'setting_id' => $this->getProperty('id')
            ]);
        
            return parent::afterRemove();
        }
    }
    
    return 'ClientSettingsSettingsRemoveProcessor';
	
?>