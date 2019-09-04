<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */
    
class ClientSettingsCategoryGetListProcessor extends modObjectGetListProcessor
{
    /**
     * @access public.
     * @var String.
     */
    public $classKey = 'ClientSettingsCategory';

    /**
     * @access public.
     * @var Array.
     */
    public $languageTopics = ['clientsettings:default', 'clientsettings:settings', 'base:default', 'site:default'];

    /**
     * @access public.
     * @var String.
     */
    public $defaultSortField = 'Category.menuindex';

    /**
     * @access public.
     * @var String.
     */
    public $defaultSortDirection = 'ASC';

    /**
     * @access public.
     * @var String.
     */
    public $objectType = 'clientsettings.category';

    /**
     * @access public.
     * @return Mixed.
     */
    public function initialize()
    {
        $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path') . 'components/clientsettings/') . 'model/clientsettings/');

        $this->setDefaultProperties([
            'dateFormat' => $this->modx->getOption('manager_date_format') . ', ' .  $this->modx->getOption('manager_time_format')
        ]);

        return parent::initialize();
    }

    /**
     * @access public.
     * @param xPDOQuery $criteria.
     * @return xPDOQuery.
     */
    public function prepareQueryBeforeCount(xPDOQuery $criteria)
    {
        $criteria->setClassAlias('Category');

        $criteria->select($this->modx->getSelectColumns('ClientSettingsCategory', 'Category'));
        $criteria->select('COUNT(Setting.id) as settings');

        $criteria->leftJoin('ClientSettingsSetting', 'Setting');

        $query = $this->getProperty('query');

        if (!empty($query)) {
            $criteria->where([
                'Category.name:LIKE'            => '%' . $query . '%',
                'OR:Category.description:LIKE'  => '%' . $query . '%'
            ]);
        }

        $criteria->groupby('Category.id');

        return $criteria;
    }

    /**
     * @access public.
     * @param xPDOObject $object.
     * @return Array.
    */
    public function prepareRow(xPDOObject $object)
    {
        $array = array_merge($object->toArray(), [
            'name_formatted'        => $object->get('name'),
            'description_formatted' => $object->get('description')
        ]);

        $key        = 'category_clientsettings.' . strtolower($object->get('name'));
        $lexicon    = $this->modx->lexicon($key);

        if ($key !== $lexicon) {
            $array['name_formatted'] = $lexicon;
        } else {
            $array['name_formatted'] = $object->get('name');
        }

        if (empty($object->get('description'))) {
            $key        = 'category_clientsettings.' . strtolower($object->get('name')) . '_desc';
            $lexicon    = $this->modx->lexicon($key);

            if ($key !== $lexicon) {
                $array['description_formatted'] = $lexicon;
            }
        }

        if (in_array($object->get('editedon'), ['-001-11-30 00:00:00', '-1-11-30 00:00:00', '0000-00-00 00:00:00', null], true)) {
            $array['editedon'] = '';
        } else {
            $array['editedon'] = date($this->getProperty('dateFormat'), strtotime($object->get('editedon')));
        }

        return $array;
    }
}

return 'ClientSettingsCategoryGetListProcessor';
