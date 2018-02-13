<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    class ClientSettingsSettingsGetListProcessor extends modObjectGetListProcessor {
        /**
         * @access public.
         * @var String.
         */
        public $classKey = 'ClientSettingsSettings';
        
        /**
         * @access public.
         * @var Array.
         */
        public $languageTopics =  ['clientsettings:default', 'clientsettings:settings', 'site:default'];
        
        /**
         * @access public.
         * @var String.
         */
        public $defaultSortField = 'Settings.menuindex';
        
        /**
         * @access public.
         * @var String.
         */
        public $defaultSortDirection = 'ASC';
        
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
         * @acces public.
         * @return Mixed.
         */
        public function initialize() {
            $this->clientsettings = $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path').'components/clientsettings/').'model/clientsettings/');
            
            $this->setDefaultProperties([
                'dateFormat' => $this->modx->getOption('manager_date_format').', '. $this->modx->getOption('manager_time_format')
            ]);
            
            return parent::initialize();
        }
        
        /**
         * @acces public.
         * @param Object $c.
         * @return Object.
         */
        public function prepareQueryBeforeCount(xPDOQuery $c) {
            $c->setClassAlias('Settings');
            
            $c->select($this->modx->getSelectColumns('ClientSettingsSettings', 'Settings'));
            $c->select($this->modx->getSelectColumns('ClientSettingsCategories', 'Category', 'category_', ['name', 'menuindex']));
            
            $c->leftJoin('ClientSettingsCategories', 'Category');
            
            $category = $this->getProperty('category');
            
            if (!empty($category)) {
                $c->where([
                    'Settings.category_id' => $category
                ]);
            }
            
            $query = $this->getProperty('query');
            
            if (!empty($query)) {
                $c->where([
                    'Settings.key:LIKE' => '%'.$query.'%'
                ]);
            }
            
            return $c;
        }
        
        /**
        * @acces public.
        * @param Object $object.
        * @return Array.
        */
        public function prepareRow(xPDOObject $object) {
            $array = array_merge($object->toArray(), [
                'extra'                     => $this->modx->fromJSON($object->extra),
                'label_formatted'           => $object->get('label'),
                'description_formatted'     => $object->get('description'),
                'category_name_formatted'   => $object->get('category_name')
            ]);
            
            $translationKey = 'setting_clientsettings.'.$object->get('label');
            
            if ($translationKey !== ($translation = $this->modx->lexicon($translationKey))) {
                $array['label_formatted'] = $translation;
            }
            
            $translationKey = 'setting_clientsettings.'.$object->get('description').'_desc';
            
            if ($translationKey !== ($translation = $this->modx->lexicon($translationKey))) {
                $array['description_formatted'] = $translation;
            }
            
            $translationKey = 'category_clientsettings.'.$object->get('category_name');
            
            if ($translationKey !== ($translation = $this->modx->lexicon($translationKey))) {
                $array['category_name_formatted'] = $translation;
            }
            
            if (in_array($array['editedon'], ['-001-11-30 00:00:00', '-1-11-30 00:00:00', '0000-00-00 00:00:00', null])) {
                $array['editedon'] = '';
            } else {
                $array['editedon'] = date($this->getProperty('dateFormat'), strtotime($array['editedon']));
            }
            
            return $array;	
        }
    }
    
    return 'ClientSettingsSettingsGetListProcessor';
	
?>