<?php
	
    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    require_once __DIR__ . '/update.class.php';
    
    class ClientSettingsSettingsUpdateFromGridProcessor extends ClientSettingsSettingsUpdateProcessor {
        /**
         * @access public.
         * @return Mixed.
         */
        public function initialize() {
            $data = $this->getProperty('data');
            
            if (empty($data)) {
                return $this->modx->lexicon('invalid_data');
            }
            
            $data = $this->modx->fromJSON($data);
            
            if (empty($data)) {
                return $this->modx->lexicon('invalid_data');
            }
            
            if (isset($data['extra'])) {
                $data['extra'] = $this->modx->toJSON($data['extra']);
            }
            
            $this->setProperties($data);
            
            $this->unsetProperty('data');
            
            return parent::initialize();
        }
    }
    
    return 'ClientSettingsSettingsUpdateFromGridProcessor';
	
?>