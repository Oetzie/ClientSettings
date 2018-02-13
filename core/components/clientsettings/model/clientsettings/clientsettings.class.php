<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettings {
        /**
         * @access public.
         * @var Object.
         */
        public $modx;
    
        /**
         * @access public.
         * @var Array.
         */
        public $config = [];
		
        /**
         * @access public.
         * @param Object $modx.
         * @param Array $config.
         */
        public function __construct(modX &$modx, array $config = []) {
            $this->modx =& $modx;
            
            $corePath       = $this->modx->getOption('clientsettings.core_path', $config, $this->modx->getOption('core_path').'components/clientsettings/');
            $assetsUrl      = $this->modx->getOption('clientsettings.assets_url', $config, $this->modx->getOption('assets_url').'components/clientsettings/');
            $assetsPath     = $this->modx->getOption('clientsettings.assets_path', $config, $this->modx->getOption('assets_path').'components/clientsettings/');
            
            $this->config = array_merge([
                'namespace'         => $this->modx->getOption('namespace', $config, 'clientsettings'),
                'lexicons'          => ['clientsettings:default', 'clientsettings:settings', 'site:default', 'site:settings'],
                'base_path'         => $corePath,
                'core_path'         => $corePath,
                'model_path'        => $corePath.'model/',
                'processors_path'   => $corePath.'processors/',
                'elements_path'     => $corePath.'elements/',
                'chunks_path'       => $corePath.'elements/chunks/',
                'plugins_path'      => $corePath.'elements/plugins/',
                'snippets_path'     => $corePath.'elements/snippets/',
                'templates_path'    => $corePath.'templates/',
                'assets_path'       => $assetsPath,
                'js_url'            => $assetsUrl.'js/',
                'css_url'           => $assetsUrl.'css/',
                'assets_url'        => $assetsUrl,
                'connector_url'     => $assetsUrl.'connector.php',
                'version'           => '1.1.2',
                'branding_url'      => $this->modx->getOption('clientsettings.branding_url', null, ''),
                'branding_help_url' => $this->modx->getOption('clientsettings.branding_url_help', null, ''),
                'has_permission'    => $this->hasPermission(),
                'context'           => $this->getContexts('boolean')
            ], $config);
            
            $this->modx->addPackage('clientsettings', $this->config['model_path']);
            
            if (is_array($this->config['lexicons'])) {
                foreach ($this->config['lexicons'] as $lexicon) {
                    $this->modx->lexicon->load($lexicon);
                }
            } else {
                $this->modx->lexicon->load($this->config['lexicons']);
            }
        }
		
        /**
         * @access public.
         * @return String|Boolean.
         */
        public function getHelpUrl() {
            if (!empty($this->config['branding_help_url'])) {
                return $this->config['branding_help_url'].'?v=' . $this->config['version'];
            }
            
            return false;
        }
        
        /**
         * @access public.
         * @return String|Boolean.
         */
        public function getBrandingUrl() {
            if (!empty($this->config['branding_url'])) {
                return $this->config['branding_url'];
            }
            
            return false;
        }
		
        /**
         * @access public.
         * @return Boolean.
         */
        public function hasPermission() {
            return $this->modx->hasPermission('clientsettings_admin');
        }
		
        /**
         * @access private.
         * @param string $return.
         * @return Boolean.
         */
        public function getContexts($return = 'array') {
            $contexts = [];
            
            $c = [
                'key:!=' => 'mgr'
            ];
            
            foreach ($this->modx->getCollection('modContext', $c) as $context) {
                $contexts[] = $context->toArray();
            }
            
            if ('boolean' == $return) {
                return 1 >= count($contexts);
            }
            
            return $contexts;
        }
		
        /**
         * @access protected.
         * @return Array.
         */
        public function getCategories() {
            $output = [
                'categories'    => [],
                'values'        => []
            ];
        
            $c = $this->modx->newQuery('ClientSettingsCategories');
            
            $c->where([
                'active' => 1
            ]);
            
            $c->sortby('menuindex', 'ASC');
        
            foreach ($this->modx->getCollection('ClientSettingsCategories', $c) as $category) {				
                $categoryArray = array_merge($category->toArray(), [
                    'name_formatted'        => $category->get('name'),
                    'description_formatted' => $category->get('formatted'),
                    'settings'              => []
                ]);
                
                $translationKey = 'category_clientsettings.'.$category->get('name');
                
                if ($translationKey !== ($translation = $this->modx->lexicon($translationKey))) {
                    $categoryArray['name_formatted'] = $translation;
                }
                
                $translationKey = 'category_clientsettings.'.$category->get('description').'_desc';
                
                if ($translationKey !== ($translation = $this->modx->lexicon($translationKey))) {
                    $categoryArray['description_formatted'] = $translation;
                }
            
                $c = $this->modx->newQuery('ClientSettingsSettings');
                
                $c->where([
                    'category_id'   => $category->get('id'),
                    'active'        => 1
                ]);
                
                $c->sortby('menuindex', 'ASC');
        
                foreach ($category->getMany('Settings', $c) as $setting) {
                    $settingArray = array_merge($setting->toArray(), [
                        'label_formatted'       => $setting->get('label'),
                        'description_formatted' => $setting->get('description'),
                        'extra'	                => $this->modx->fromJSON($setting->get('extra'))	
                    ]);
   
                    $translationKey = 'setting_clientsettings.'.$setting->get('label');
                    
                    if ($translationKey !== ($translation = $this->modx->lexicon($translationKey))) {
                        $settingArray['label_formatted'] = $translation;
                    }
                    
                    $translationKey = 'setting_clientsettings.'.$setting->get('description').'_desc';
                    
                    if ($translationKey !== ($translation = $this->modx->lexicon($translationKey))) {
                        $settingArray['description_formatted'] = $translation;
                    }
                    
                    $categoryArray['settings'][] = $settingArray;
                }
            
                $output['categories'][] = $categoryArray;
            }

            foreach ($this->modx->getCollection('ClientSettingsValues') as $key => $value) {
                $key        = $value->get('context').':'.$value->get('setting_id');
                $savedValue = isset($output['values'][$key]) ? $output['values'][$key] : [];
                
                if ('replace' == $value->get('key')) {
                    $output['values'][$key] = array_merge($savedValue, [
                        'replace'   => unserialize($value->get('value'))
                    ]);
                } else {
                    $output['values'][$key] = array_merge($savedValue, $value->toArray(), [
                        'value'     => unserialize($value->get('value')),
                        'replace'   => ''
                    ]);
                }
            }

            return $output;
        }
		
        /**
         * @access public.
         * @return Array.
         */
        public function getSettings() {
            $settings = [];
            
            $c = $this->modx->newQuery('ClientSettingsValues');
            
            $c->setClassAlias('Values');
            
            $c->select($this->modx->getSelectColumns('ClientSettingsValues', 'Values'));
            $c->select($this->modx->getSelectColumns('ClientSettingsSettings', 'Setting', '', ['key']));
            
            $c->innerjoin('ClientSettingsSettings', 'Setting');
            
            $c->where([
                'Setting.active'    => 1,
                'Values.context'    => $this->modx->context->key
            ]);
        
            foreach ($this->modx->getCollection('ClientSettingsValues', $c) as $setting) {
                if (!preg_match('/-replace$/si', $setting->get('key'))) {
                    $value = unserialize($setting->get('value'));
                    
                    if (is_array($value)) {
                        $value = implode(',', $value);
                    }
                    
                    $settings[$setting->get('key')] = $value;
                }
            }
            
            return $settings;
        }
		
        /**
         * @access public.
         */
        public function onLoadWebDocument() {
            $settings = $this->getSettings();

            if (0 < count($settings)) {
                $this->modx->setPlaceholders($settings, '+');
            
                foreach ($settings as $key => $value) {
                    $this->modx->setOption($key, $value);
                }
            }
        }
	}
	
?>