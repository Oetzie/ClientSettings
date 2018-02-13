<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    abstract class ClientSettingsManagerController extends modExtraManagerController {
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
            
            $this->addJavascript($this->clientsettings->config['js_url'].'mgr/clientsettings.js');
            
            $this->addHtml('<script type="text/javascript">
                Ext.onReady(function() {
                    MODx.config.help_url = "'.$this->clientsettings->getHelpUrl().'";
                    
                    ClientSettings.config = '.$this->modx->toJSON(array_merge($this->clientsettings->config, array(
                        'branding_url'          => $this->clientsettings->getBrandingUrl(),
                        'branding_url_help'     => $this->clientsettings->getHelpUrl()
                    ))).';
                });
            </script>');
            
            return parent::initialize();
        }
        
        /**
         * @access public.
         * @return Array.
         */
        public function getLanguageTopics() {
            return $this->clientsettings->config['lexicons'];
        }
        
        /**
         * @access public.
         * @returns Boolean.
         */	    
        public function checkPermissions() {
            return $this->modx->hasPermission('clientsettings');
        }
    }
        
    class IndexManagerController extends ClientSettingsManagerController {
        /**
         * @access public.
         * @return String.
         */
        public static function getDefaultController() {
            return 'home';
        }
    }

?>