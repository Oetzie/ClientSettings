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
        public $classKey = 'ClientSettingsCategory';
    
        /**
         * @access public.
         * @var Array.
         */
        public $languageTopics = array('clientsettings:default');
    
        /**
         * @access public.
         * @var String.
         */
        public $objectType = 'clientsettings.category';
    
        /**
         * @access public.
         * @return Mixed.
         */
        public function initialize() {
            $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path') . 'components/clientsettings/') . 'model/clientsettings/');
            
            return parent::initialize();
        }
    
        /**
         * @acces public.
         * @return Mixed.
         */
        public function afterRemove() {
            foreach ($this->object->getSettings() as $setting) {
                $this->modx->removeCollection('ClientSettingsValue', [
                    'setting_id' => $setting->get('id')
                ]);
            
                $setting->remove();
            }
            
            return parent::afterRemove();
        }
    }
    
    return 'ClientSettingsCategoriesRemoveProcessor';
	
?>