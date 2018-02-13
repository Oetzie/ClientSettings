<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsSettingsUpdateProcessor extends modObjectUpdateProcessor {
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
            
            if (null !== ($key = $this->getProperty('key'))) {
                $this->setProperty('key', strtolower(str_replace(array(' ', '-'), '_', $key)));	
            }
            
            if (null === $this->getProperty('active')) {
                $this->setProperty('active', 0);
            }
        
            if ('' == $this->getProperty('label')) {
                $this->setProperty('label', $this->getProperty('key'));
            }
        
            if ('' == $this->getProperty('description')) {
                $this->setProperty('description', $this->getProperty('key'));
            }
            
            return parent::initialize();
        }
        
        /**
         * @access public.
         * @return Mixed.
         ß*/
        public function beforeSave() {
            $c = [
                'id:!=' => $this->object->get('id'),
                'key'   => $this->getProperty('key')	
            ];
        
            if (!preg_match('/^([a-zA-Z0-9\_\-]+)$/si', $this->getProperty('key'))) {
                $this->addFieldError('key', $this->modx->lexicon('clientsettings.setting_error_character'));
            } else if ($this->doesAlreadyExist($c)) {
                $this->addFieldError('key', $this->modx->lexicon('clientsettings.setting_error_exists'));
            }

            $this->object->set('menuindex', $this->object->getMenuIndex($this->getProperty('category_id'), false));
            
            if ($xtype = $this->getProperty('xtype')) {
                $extra = [];
                
                switch($xtype) {
                    case 'datefield':
                        $extra = [
                            'minDateValue'  => $this->getProperty('minDateValue'),
                            'maxDateValue'  => $this->getProperty('maxDateValue')
                        ];
                    
                        break;
                    case 'timefield':
                        $extra = [
                            'minTimeValue'  => $this->getProperty('minTimeValue'),
                            'maxTimeValue'  => $this->getProperty('maxTimeValue')
                        ];
                        
                        break;
                    case 'datetimefield':
                        $extra = [
                            'minDateValue'  => $this->getProperty('minDateValue'),
                            'maxDateValue'  => $this->getProperty('maxDateValue'),
                            'minTimeValue'  => $this->getProperty('minTimeValue'),
                            'maxTimeValue'  => $this->getProperty('maxTimeValue')
                        ];
                        
                        break;
                    case 'richtext':
                        $extra = [
                            'toolbar1'      => $this->getProperty('toolbar1'),
                            'toolbar2'      => $this->getProperty('toolbar2'),
                            'toolbar3'      => $this->getProperty('toolbar3'),
                            'plugins'       => $this->getProperty('plugins')
                        ];
                        
                        break;
                    case 'combo':
                    case 'checkboxgroup':
                    case 'radiogroup':
                        $extra = [
                            'values' => $this->modx->fromJSON($this->getProperty('values'))
                        ];
                    
                        break;
                    case 'browser':
                        $extra = [
                            'browser'           => $this->getProperty('browser'),
                            'openTo'            => $this->getProperty('openTo'),
                            'allowedFileTypes'	=> $this->getProperty('allowedFileTypes')
                        ];
                    
                        break;
                }

                $this->object->set('extra', $this->modx->toJSON($extra));
            }
            
            return parent::beforeSave();
        }
    }
    
    return 'ClientSettingsSettingsUpdateProcessor';
	
?>