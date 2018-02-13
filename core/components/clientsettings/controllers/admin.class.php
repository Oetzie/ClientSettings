<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
     
    require_once dirname(dirname(__FILE__)).'/index.class.php';
    
    class ClientSettingsAdminManagerController extends ClientSettingsManagerController {
        /**
         * @access public.
         */
        public function loadCustomCssJs() {
            $this->addCSS($this->clientsettings->config['css_url'].'mgr/clientsettings.css');
            
            $this->addJavascript($this->clientsettings->config['js_url'].'mgr/widgets/admin.panel.js');
            
            $this->addJavascript($this->clientsettings->config['js_url'].'mgr/widgets/categories.grid.js');
            $this->addJavascript($this->clientsettings->config['js_url'].'mgr/widgets/settings.grid.js');
            
            $this->addLastJavascript($this->clientsettings->config['js_url'].'mgr/sections/admin.js');
        }
        
        /**
         * @access public.
         * @return String.
         */
        public function getPageTitle() {
            return $this->modx->lexicon('clientsettings');
        }
        
        /**
         * @access public.
         * @return String.
         */
        public function getTemplateFile() {
            return $this->clientsettings->config['templates_path'].'admin.tpl';
        }
        
        /**
         * @access public.
         * @param Array $scriptProperties.
         */
        public function process(array $scriptProperties = []) {
            if (!$this->modx->hasPermission('clientsettings_admin')) {
                $this->modx->sendRedirect($this->modx->getOption('manager_url').'?a=home&namespace='.$this->clientsettings->config['namespace']);
            }
        }
    }

?>