<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsCategoriesRemoveProcessor extends modObjectRemoveProcessor {
        /**
         * @access public.
         * @var String.
         */
        public $classKey = 'ClientSettingsCategories';
    
        /**
         * @access public.
         * @var Array.
         */
        public $languageTopics = array('clientsettings:default');
    
        /**
         * @access public.
         * @var String.
         */
        public $objectType = 'clientsettings.categories';
    
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
         * @acces public.
         * @return Mixed.
         */
        public function afterRemove() {
            foreach ($this->object->getMany('Settings') as $setting) {
                $this->modx->removeCollection('ClientSettingsValues', [
                    'setting_id' => $setting->id
                ]);
            
                $setting->remove();
            }
            
            return parent::afterRemove();
        }
    }
    
    return 'ClientSettingsCategoriesRemoveProcessor';
	
?>