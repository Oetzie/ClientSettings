<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    require_once dirname(dirname(__FILE__)).'/index.class.php';
    
    class ClientSettingsHomeManagerController extends ClientSettingsManagerController {
        /**
         * @access public.
         */
        public function loadCustomCssJs() {
            $this->addCSS($this->clientsettings->config['css_url'].'mgr/clientsettings.css');
            
            $this->addJavascript($this->clientsettings->config['js_url'].'mgr/widgets/home.panel.js');
            
            $this->addLastJavascript($this->clientsettings->config['js_url'].'mgr/sections/home.js');
            
            $this->addHtml('<script type="text/javascript">
                Ext.onReady(function() {
                    ClientSettings.config.contexts      = '.$this->modx->toJSON($this->clientsettings->getContexts()).';
                    ClientSettings.config.categories    = '.$this->modx->toJSON($this->clientsettings->getCategories()).';
                });
            </script>');
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
            return $this->clientsettings->config['templates_path'].'home.tpl';
        }
    
        /**
         * @access public.
         * @param Array $scriptProperties.
         */
        public function process(array $scriptProperties = []) {
            if (!$this->getContext()) {
                return $this->failure($this->modx->lexicon('clientsettings.context_not_exists'));
            }
            
            if ($this->modx->getOption('use_editor') && $richtext = $this->modx->getOption('which_editor')) {
                $properties = [
                    'editor'    => $richtext,
                    'elements'  => []
                ];
                
                $onRichTextEditorInit = $this->modx->invokeEvent('OnRichTextEditorInit', $properties);
                
                if (is_array($onRichTextEditorInit)) {
                    $onRichTextEditorInit = implode('', $onRichTextEditorInit);
                }
                
                $this->addHtml($onRichTextEditorInit);
            }
        }
        
        /**
         * @access protected.
         * @return Boolean|Array.
         */
        protected function getContext() {
            $parameters = array_merge([
                'context' => $this->modx->getOption('default_context', null, 'web')
            ], $this->modx->request->getParameters());
            
            $c = [
                'key' => $parameters['context']
            ];
            
            if (null !== ($context = $this->modx->getObject('modContext', $c))) {
                return $context->toArray();
            }

            return false;
        }
    }

?>