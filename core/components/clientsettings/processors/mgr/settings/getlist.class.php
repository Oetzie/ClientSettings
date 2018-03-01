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
        public $classKey = 'ClientSettingsSetting';
        
        /**
         * @access public.
         * @var Array.
         */
        public $languageTopics =  ['clientsettings:default', 'clientsettings:settings', 'site:default'];
        
        /**
         * @access public.
         * @var String.
         */
        public $defaultSortField = 'Setting.menuindex';
        
        /**
         * @access public.
         * @var String.
         */
        public $defaultSortDirection = 'ASC';
        
        /**
         * @access public.
         * @var String.
         */
        public $objectType = 'clientsettings.setting';
        
        /**
         * @acces public.
         * @return Mixed.
         */
        public function initialize() {
            $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path') . 'components/clientsettings/') . 'model/clientsettings/');
            
            $this->setDefaultProperties([
                'dateFormat' => $this->modx->getOption('manager_date_format') . ', ' . $this->modx->getOption('manager_time_format')
            ]);
            
            return parent::initialize();
        }
        
        /**
         * @acces public.
         * @param Object $c.
         * @return Object.
         */
        public function prepareQueryBeforeCount(xPDOQuery $c) {
            $c->setClassAlias('Setting');
            
            $c->select($this->modx->getSelectColumns('ClientSettingsSetting', 'Setting'));
            $c->select($this->modx->getSelectColumns('ClientSettingsCategory', 'Category', 'category_', ['name', 'menuindex']));
            
            $c->leftJoin('ClientSettingsCategory', 'Category');
            
            $category = $this->getProperty('category');
            
            if (!empty($category)) {
                $c->where([
                    'Setting.category_id' => $category
                ]);
            }
            
            $query = $this->getProperty('query');
            
            if (!empty($query)) {
                $c->where([
                    'Setting.key:LIKE' => '%' . $query . '%'
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
            
            $translationKey = 'setting_clientsettings.' . $object->get('label');
            
            if ($translationKey !== ($translation = $this->modx->lexicon($translationKey))) {
                $array['label_formatted'] = $translation;
            }
            
            $translationKey = 'setting_clientsettings.' . $object->get('description').'_desc';
            
            if ($translationKey !== ($translation = $this->modx->lexicon($translationKey))) {
                $array['description_formatted'] = $translation;
            }
            
            $translationKey = 'category_clientsettings.' . $object->get('category_name');
            
            if ($translationKey !== ($translation = $this->modx->lexicon($translationKey))) {
                $array['category_name_formatted'] = $translation;
            }
            
            if (in_array($object->get('editedon'), ['-001-11-30 00:00:00', '0000-00-00 00:00:00'])) {
                $array['editedon'] = '';
            } else {
                $array['editedon'] = date($this->getProperty('dateFormat'), strtotime($object->get('editedon')));
            }
            
            return $array;	
        }
    }
    
    return 'ClientSettingsSettingsGetListProcessor';
	
?>