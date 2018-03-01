<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsSettingsSortProcessor extends modObjectProcessor {
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
        * @acces public
        * @return Mixed.
        */
        public function process() {
            if (null !== ($sort = $this->modx->fromJSON($this->getProperty('sort')))) {
                foreach ($sort as $key => $value) {
                    if (null !== ($object = $this->modx->getObject('ClientSettingsSetting', $value['id']))) {
                        $object->fromArray([
                            'category_id'   => $value['category_id'],
                            'menuindex'     => $key
                        ]);
                        
                        $object->save();
                    }
                }
            }
            
            return $this->success();
        }
    }
    
    return 'ClientSettingsSettingsSortProcessor';
	
?>