<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <info@oetzie.nl>
     */
    
    class ClientSettingsValuesSaveProcessor extends modObjectProcessor {
        /**
         * @access public.
         * @var String.
         */
        public $classKey = 'ClientSettingsValues';
        
        /**
         * @access public.
         * @var Array.
         */
        public $languageTopics = array('clientsettings:default');
        
        /**
         * @access public.
         * @var String.
         */
        public $objectType = 'clientsettings.values';
        
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
            $this->modx->cacheManager->clearCache();
            
            foreach ($this->getProperties() as $key => $value) {
                if (false !== strpos($key, ':')) {
                    list($context, $setting) = explode(':', $key);
                
                    if (false !== strpos($setting, '-')) {
                        list($setting, $key) = explode('-', $setting);
                
                        if ('ignore' == $key) {
                            continue;
                        }
                    }
                
                    $setting = [
                        'setting_id'    => $setting,
                        'key'           => $key,
                        'context'       => $context
                    ];
                
                    if (null === ($object = $this->modx->getObject('ClientSettingsValues', $setting))) {
                        $object = $this->modx->newObject('ClientSettingsValues');
                    }
                
                    $object->fromArray(array_merge($setting, [
                        'value' => serialize($value)
                    ]));
                    	
                    $object->save();
                }
            }
            
            $this->modx->invokeEvent('onClientSettingsSave');
            
            return $this->success();
        }
    }
    
    return 'ClientSettingsValuesSaveProcessor';
	
?>