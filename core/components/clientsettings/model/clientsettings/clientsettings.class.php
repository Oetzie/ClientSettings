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

        $corePath       = $this->modx->getOption('clientsettings.core_path', $config, $this->modx->getOption('core_path') . 'components/clientsettings/');
        $assetsUrl      = $this->modx->getOption('clientsettings.assets_url', $config, $this->modx->getOption('assets_url') . 'components/clientsettings/');
        $assetsPath     = $this->modx->getOption('clientsettings.assets_path', $config, $this->modx->getOption('assets_path') . 'components/clientsettings/');

        $this->config = array_merge([
            'namespace'         => $this->modx->getOption('namespace', $config, 'clientsettings'),
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
            'version'           => '1.2.0',
            'branding_url'      => $this->modx->getOption('clientsettings.branding_url', null, ''),
            'branding_help_url' => $this->modx->getOption('clientsettings.branding_url_help', null, ''),
            'has_permission'    => $this->hasPermission(),
            'context'           => (bool) $this->getContexts(),
            'exclude_contexts'  => array_merge(['mgr'], explode(',', $this->modx->getOption('clientsettings.exclude_contexts', null, ''))),
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
     * @access public.
     * @return Boolean.
     */
    public function hasPermission()
    {
        return $this->modx->hasPermission('clientsettings_admin');
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
}
