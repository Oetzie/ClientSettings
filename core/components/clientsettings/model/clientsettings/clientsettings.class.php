<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */
    
class ClientSettings
{
    /**
     * @access public.
     * @var modX.
     */
    public $modx;

    /**
     * @access public.
     * @var Array.
     */
    public $config = [];

    /**
     * @access public.
     * @param modX $modx.
     * @param Array $config.
     */
    public function __construct(modX &$modx, array $config = [])
    {
        $this->modx =& $modx;

        $corePath   = $this->modx->getOption('clientsettings.core_path', $config, $this->modx->getOption('core_path') . 'components/clientsettings/');
        $assetsUrl  = $this->modx->getOption('clientsettings.assets_url', $config, $this->modx->getOption('assets_url') . 'components/clientsettings/');
        $assetsPath = $this->modx->getOption('clientsettings.assets_path', $config, $this->modx->getOption('assets_path') . 'components/clientsettings/');

        $this->config = array_merge([
            'namespace'         => 'clientsettings',
            'lexicons'          => ['clientsettings:default', 'clientsettings:settings', 'base:default', 'site:default'],
            'base_path'         => $corePath,
            'core_path'         => $corePath,
            'model_path'        => $corePath . 'model/',
            'processors_path'   => $corePath . 'processors/',
            'elements_path'     => $corePath . 'elements/',
            'chunks_path'       => $corePath . 'elements/chunks/',
            'plugins_path'      => $corePath . 'elements/plugins/',
            'snippets_path'     => $corePath . 'elements/snippets/',
            'templates_path'    => $corePath . 'templates/',
            'assets_path'       => $assetsPath,
            'js_url'            => $assetsUrl . 'js/',
            'css_url'           => $assetsUrl . 'css/',
            'assets_url'        => $assetsUrl,
            'connector_url'     => $assetsUrl . 'connector.php',
            'version'           => '1.3.0',
            'branding_url'      => $this->modx->getOption('clientsettings.branding_url', null, ''),
            'branding_help_url' => $this->modx->getOption('clientsettings.branding_url_help', null, ''),
            'has_permission'    => (bool) $this->modx->hasPermission('clientsettings_admin'),
            'context'           => (bool) $this->getContexts(),
            'exclude_contexts'  => array_merge(['mgr'], explode(',', $this->modx->getOption('clientsettings.exclude_contexts', null, ''))),
            'vtabs'             => (bool) $this->modx->getOption('clientsettings.vtabs', null, false)
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
    public function getHelpUrl()
    {
        if (!empty($this->config['branding_help_url'])) {
            return $this->config['branding_help_url'] . '?v=' . $this->config['version'];
        }

        return false;
    }

    /**
     * @access public.
     * @return String|Boolean.
     */
    public function getBrandingUrl()
    {
        if (!empty($this->config['branding_url'])) {
            return $this->config['branding_url'];
        }

        return false;
    }

    /**
     * @access public.
     * @param String $key.
     * @param Array $options.
     * @param Mixed $default.
     * @return Mixed.
     */
    public function getOption($key, array $options = [], $default = null)
    {
        if (isset($options[$key])) {
            return $options[$key];
        }

        if (isset($this->config[$key])) {
            return $this->config[$key];
        }

        return $this->modx->getOption($this->config['namespace'] . '.' . $key, $options, $default);
    }

    /**
     * @access private.
     * @return Boolean.
     */
    private function getContexts()
    {
        return $this->modx->getCount('modContext', [
            'key:NOT IN' => array_merge(['mgr'], explode(',', $this->modx->getOption('clientsettings.exclude_contexts', null, '')))
        ]) === 1;
    }

    /**
     * @access public.
     * @return Array.
     */
    public function getXTypes()
    {
        $xtypes = [
            'textfield'     => $this->modx->lexicon('clientsettings.xtype_textfield'),
            'datefield'     => $this->modx->lexicon('clientsettings.xtype_datefield'),
            'timefield'     => $this->modx->lexicon('clientsettings.xtype_timefield'),
            'datetimefield' => $this->modx->lexicon('clientsettings.xtype_datetimefield'),
            'passwordfield' => $this->modx->lexicon('clientsettings.xtype_passwordfield'),
            'numberfield'   => $this->modx->lexicon('clientsettings.xtype_numberfield'),
            'textarea'      => $this->modx->lexicon('clientsettings.xtype_textarea'),
            'richtext'      => $this->modx->lexicon('clientsettings.xtype_richtext'),
            'boolean'       => $this->modx->lexicon('clientsettings.xtype_boolean'),
            'combo'         => $this->modx->lexicon('clientsettings.xtype_combo'),
            'checkbox'      => $this->modx->lexicon('clientsettings.xtype_checkbox'),
            'checkboxgroup' => $this->modx->lexicon('clientsettings.xtype_checkboxgroup'),
            'radiogroup'    => $this->modx->lexicon('clientsettings.xtype_radiogroup'),
            'resource'      => $this->modx->lexicon('clientsettings.xtype_resource'),
            'browser'       => $this->modx->lexicon('clientsettings.xtype_browser')
        ];

        if ($this->modx->getObject('modNamespace', ['name' => 'tinymce'])) {
            $xtypes['tinymce'] = $this->modx->lexicon('clientsettings.xtype_tinymce');
        }

        if ($this->modx->getObject('modNamespace', ['name' => 'clientgrid'])) {
            $xtypes['clientgrid'] = $this->modx->lexicon('clientsettings.xtype_clientgrid');
        }

        return $xtypes;
    }

    /**
     * @access public.
     * @param String $context.
     * @return Array.
     */
    public function getSettingsValues($context)
    {
        $settings = [];

        $criteria = $this->modx->newQuery('ClientSettingsValue');

        $criteria->setClassAlias('Value');

        $criteria->select($this->modx->getSelectColumns('ClientSettingsValue', 'Value'));
        $criteria->select($this->modx->getSelectColumns('ClientSettingsSetting', 'Setting', 'setting_', ['key', 'xtype', 'extra']));

        $criteria->innerJoin('ClientSettingsSetting', 'Setting');

        $criteria->where([
            'Setting.active'    => 1,
            'Value.context'     => $context
        ]);

        foreach ($this->modx->getCollection('ClientSettingsValue', $criteria) as $setting) {
            if ($setting->get('key') === 'value') {
                $value = unserialize($setting->get('value'));

                if (is_array($value)) {
                    $value = implode(',', $value);
                }

                $settings[$setting->get('setting_key')] = $this->formatValue($setting->get('setting_xtype'), json_decode($setting->get('setting_extra'), true), $value);
            }
        }

        return $settings;
    }

    /**
     * @access public.
     * @param String $type.
     * @param Array $properties.
     * @param String $value.
     * @return String.
     */
    protected function formatValue($type, array $properties = [], $value = '')
    {
        if (!empty($value) && $type === 'browser') {
            if (isset($properties['source'])) {
                $source = $this->modx->getObject('modMediaSource', [
                    'id' => $properties['source']
                ]);

                if ($source) {
                    $value = trim($source->getProperties()['baseUrl']['value'], '/') . '/' . $value;
                }
            }
        }

        return $value;
    }
}
