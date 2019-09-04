<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */
    
class ClientSettingsSettingGetListProcessor extends modObjectGetListProcessor
{
    /**
     * @access public.
     * @var String.
     */
    public $classKey = 'ClientSettingsSetting';

    /**
     * @access public.
     * @var Array.
     */
    public $languageTopics =  ['clientsettings:default', 'clientsettings:settings', 'base:default', 'site:default'];

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
     * @access public.
     * @return Mixed.
     */
    public function initialize()
    {
        $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path') . 'components/clientsettings/') . 'model/clientsettings/');

        $this->setDefaultProperties([
            'dateFormat' => $this->modx->getOption('manager_date_format') . ', ' . $this->modx->getOption('manager_time_format')
        ]);

        return parent::initialize();
    }

    /**
     * @access public.
     * @param xPDOQuery $criteria.
     * @return xPDOQuery.
     */
    public function prepareQueryBeforeCount(xPDOQuery $criteria) {
        $criteria->setClassAlias('Setting');

        $criteria->select($this->modx->getSelectColumns('ClientSettingsSetting', 'Setting'));
        $criteria->select($this->modx->getSelectColumns('ClientSettingsCategory', 'Category', 'category_', ['name', 'menuindex']));

        $criteria->leftJoin('ClientSettingsCategory', 'Category');

        $category = $this->getProperty('category');

        if (!empty($category)) {
            $criteria->where([
                'Setting.category_id' => $category
            ]);
        }

        $query = $this->getProperty('query');

        if (!empty($query)) {
            $criteria->where([
                'Setting.key:LIKE' => '%' . $query . '%'
            ]);
        }

        return $criteria;
    }

    /**
     * @access public.
     * @param xPDOObject $object.
     * @return Array.
     */
    public function prepareRow(xPDOObject $object) {
        $array = array_merge($object->toArray(), [
            'extra'                     => json_decode($object->get('extra'), true),
            'label_formatted'           => $object->get('label'),
            'description_formatted'     => $object->get('description'),
            'category_name_formatted'   => $object->get('category_name')
        ]);

        if (empty($object->get('label'))) {
            $key        = 'setting_clientsettings.' . strtolower($object->get('key'));
            $lexicon    = $this->modx->lexicon($key);

            if ($key !== $lexicon) {
                $array['label_formatted'] = $lexicon;
            } else {
                $array['label_formatted'] = $object->get('key');
            }
        }

        if (empty($object->get('description'))) {
            $key        = 'setting_clientsettings.' . strtolower($object->get('key') . '_desc');
            $lexicon    = $this->modx->lexicon($key);

            if ($key !== $lexicon) {
                $array['description_formatted'] = $lexicon;
            }
        }

        $key        = 'category_clientsettings.' . strtolower($object->get('category_name'));
        $lexicon    = $this->modx->lexicon($key);

        if ($key !== $lexicon) {
            $array['category_name_formatted'] = $lexicon;
        } else {
            $array['category_name_formatted'] = $object->get('category_name');
        }

        if (in_array($object->get('editedon'), ['-001-11-30 00:00:00', '-1-11-30 00:00:00', '0000-00-00 00:00:00', null], true)) {
            $array['editedon'] = '';
        } else {
            $array['editedon'] = date($this->getProperty('dateFormat'), strtotime($object->get('editedon')));
        }

        return $array;
    }
}

return 'ClientSettingsSettingGetListProcessor';
