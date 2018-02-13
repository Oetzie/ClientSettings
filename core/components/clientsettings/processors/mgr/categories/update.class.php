<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsCategoriesUpdateProcessor extends modObjectUpdateProcessor {
        /**
         * @access public.
         * @var String.
         */
        public $classKey = 'ClientSettingsCategories';
        
        /**
         * @access public.
         * @var Array.
         */
        public $languageTopics = ['clientsettings:default'];
        
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
            
            if (null === $this->getProperty('active')) {
                $this->setProperty('active', 0);
            }
            
            if ('' == $this->getProperty('description')) {
                $this->setProperty('description', $this->getProperty('name'));
            }
            
            return parent::initialize();
        }
    }
    
    return 'ClientSettingsCategoriesUpdateProcessor';
	
?>