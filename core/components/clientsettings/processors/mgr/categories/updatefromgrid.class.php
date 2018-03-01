<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <info@oetzie.nl>
     */
    
    require_once __DIR__ . '/update.class.php';
    
    class ClientSettingsCategoriesUpdateFromGridProcessor extends ClientSettingsCategoriesUpdateProcessor {
        /**
         * @acces public.
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
            
            $this->setProperties($data);
            
            $this->unsetProperty('data');
            
            return parent::initialize();
        }
    }
    
    return 'ClientSettingsCategoriesUpdateFromGridProcessor';
	
?>