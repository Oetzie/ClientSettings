<?php

    /**
     * Client Settings
     *
     * Copyright 2017 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsCategoriesSortProcessor extends modObjectProcessor {
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
            
            return parent::initialize();
        }
        
        /**
         * @access public
         * @return Mixed.
         */
        public function process() {
            if (null !== ($sort = $this->modx->fromJSON($this->getProperty('sort')))) {
                foreach ($sort as $key => $id) {
                    if (null !== ($object = $this->modx->getObject('ClientSettingsCategories', $id))) {
                        $object->fromArray([
                            'menuindex' => $key
                        ]);
                    
                        $object->save();
                    }
                }
            }
            
            return $this->success();
        }
    }
    
    return 'ClientSettingsCategoriesSortProcessor';
	
?>