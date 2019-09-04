<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */

abstract class ClientSettingsManagerController extends modExtraManagerController
{
    /**
     * @access public.
     * @return Mixed.
     */
    public function initialize()
    {
        $this->modx->getService('clientsettings', 'ClientSettings', $this->modx->getOption('clientsettings.core_path', null, $this->modx->getOption('core_path') . 'components/clientsettings/') . 'model/clientsettings/');

        $this->addCss($this->modx->clientsettings->config['css_url'] . 'mgr/clientsettings.css');

        $this->addJavascript($this->modx->clientsettings->config['js_url'] . 'mgr/clientsettings.js');

        $this->addHtml('<script type="text/javascript">
            Ext.onReady(function() {
                MODx.config.help_url = "' . $this->modx->clientsettings->getHelpUrl() . '";
                
                ClientSettings.config = ' . $this->modx->toJSON(array_merge($this->modx->clientsettings->config, [
                    'branding_url'          => $this->modx->clientsettings->getBrandingUrl(),
                    'branding_url_help'     => $this->modx->clientsettings->getHelpUrl()
                ])) . ';
            });
        </script>');

        return parent::initialize();
    }

    /**
     * @access public.
     * @return Array.
     */
    public function getLanguageTopics()
    {
        return $this->modx->clientsettings->config['lexicons'];
    }

    /**
     * @access public.
     * @returns Boolean.
     */
    public function checkPermissions()
    {
        return $this->modx->hasPermission('clientsettings');
    }
}

class IndexManagerController extends ClientSettingsManagerController
{
    /**
     * @access public.
     * @return String.
     */
    public static function getDefaultController()
    {
        return 'home';
    }
}
