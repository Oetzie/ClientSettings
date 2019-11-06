<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */

require_once dirname(__DIR__) . '/index.class.php';

class ClientSettingsHomeManagerController extends ClientSettingsManagerController
{
    /**
     * @access public.
     */
    public function loadCustomCssJs()
    {
        $this->addJavascript($this->modx->clientsettings->config['js_url'] . 'mgr/widgets/home.panel.js');

        $this->addLastJavascript($this->modx->clientsettings->config['js_url'] . 'mgr/sections/home.js');

        $this->addHtml('<script type="text/javascript">
            Ext.onReady(function() {
                ClientSettings.config.settings = ' . $this->modx->toJSON($this->getSettings()) . ';
            });
        </script>');
    }

    /**
     * @access public.
     * @return String.
     */
    public function getPageTitle()
    {
        return $this->modx->lexicon('clientsettings');
    }

    /**
     * @access public.
     * @return String.
     */
    public function getTemplateFile()
    {
        return $this->modx->clientsettings->config['templates_path'] . 'home.tpl';
    }

    /**
     * @access public.
     * @param Array $scriptProperties.
     * @return Mixed.
     */
    public function process(array $scriptProperties = [])
    {
        if (!$this->getContext()) {
            return $this->failure($this->modx->lexicon('clientsettings.context_not_exists'));
        }

        $useEditor = $this->modx->getOption('use_editor');
        $whichEditor = $this->modx->getOption('which_editor');

        if ($useEditor && !empty($whichEditor)) {
            $onRichTextEditorInit = $this->modx->invokeEvent('OnRichTextEditorInit', [
                'editor'    => $whichEditor,
                'elements'  => []
            ]);

            if (is_array($onRichTextEditorInit)) {
                $onRichTextEditorInit = implode('', $onRichTextEditorInit);
            }

            $this->setPlaceholder('onRichTextEditorInit', $onRichTextEditorInit);
        }
    }

    /**
     * @access protected.
     * @return Null|Array.
     */
    protected function getContext()
    {
        $context = $this->modx->getOption('default_context', null, 'web');

        if (isset($_GET['context'])) {
            $context = $_GET['context'];
        }

        $context = $this->modx->getObject('modContext', [
            'key' => $context
        ]);

        if ($context) {
            return $context->toArray();
        }

        return null;
    }

    /**
     * @access protected.
     * @return Array.
     */
    protected function getSettings()
    {
        $settings   = [];
        $context    = $this->getContext();

        if ($context) {
            $criteria = $this->modx->newQuery('ClientSettingsCategory', [
                'active' => 1
            ]);

            $criteria->sortby('menuindex', 'ASC');

            foreach ($this->modx->getCollection('ClientSettingsCategory', $criteria) as $category) {
                if (in_array($context['key'], explode(',', $category->get('exclude')), true)) {
                    continue;
                }

                $categoryArray = array_merge($category->toArray(), [
                    'name_formatted'        => $category->get('name'),
                    'description_formatted' => $category->get('description'),
                    'settings'              => []
                ]);

                $key        = 'category_clientsettings.' . strtolower($category->get('name'));
                $lexicon    = $this->modx->lexicon($key);

                if ($key !== $lexicon) {
                    $categoryArray['name_formatted'] = $lexicon;
                } else {
                    $categoryArray['name_formatted'] = $category->get('name');
                }

                if (empty($category->get('description'))) {
                    $key        = 'category_clientsettings.' . strtolower($category->get('name')) . '_desc';
                    $lexicon    = $this->modx->lexicon($key);

                    if ($key !== $lexicon) {
                        $categoryArray['description_formatted'] = $lexicon;
                    }
                }

                $criteria = $this->modx->newQuery('ClientSettingsSetting', [
                    'category_id'   => $category->get('id'),
                    'active'        => 1
                ]);

                $criteria->sortby('menuindex', 'ASC');

                foreach ($this->modx->getCollection('ClientSettingsSetting', $criteria) as $setting) {
                    if (in_array($context['key'], explode(',', $setting->get('exclude')), true)) {
                        continue;
                    }

                    $settingArray = array_merge($setting->toArray(), [
                        'label_formatted'       => $setting->get('label'),
                        'description_formatted' => $setting->get('description'),
                        'extra'                 => $setting->getExtraValues(),
                        'value'                 => []
                    ]);

                    if (empty($setting->get('label'))) {
                        $key        = 'setting_clientsettings.' . strtolower($setting->get('key'));
                        $lexicon    = $this->modx->lexicon($key);

                        if ($key !== $lexicon) {
                            $settingArray['label_formatted'] = $lexicon;
                        } else {
                            $settingArray['label_formatted'] = $setting->get('key');
                        }
                    }

                    if (empty($setting->get('description'))) {
                        $key        = 'setting_clientsettings.' . strtolower($setting->get('key') . '_desc');
                        $lexicon    = $this->modx->lexicon($key);

                        if ($key !== $lexicon) {
                            $settingArray['description_formatted'] = $lexicon;
                        }
                    }

                    $values = $setting->getMany('Value', [
                        'context' => $context['key']
                    ]);

                    foreach ((array) $values as $value) {
                        $settingArray['value'][$value->get('key')] = unserialize($value->get('value'));
                    }

                    $categoryArray['settings'][] = $settingArray;
                }

                $settings[] = $categoryArray;
            }
        }

        return $settings;
    }
}
