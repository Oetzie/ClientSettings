<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */

require_once dirname(__DIR__) . '/index.class.php';

class ClientSettingsAdminManagerController extends ClientSettingsManagerController
{
    /**
     * @access public.
     */
    public function loadCustomCssJs()
    {
        $this->addJavascript($this->modx->clientsettings->config['js_url'] . 'mgr/widgets/admin.panel.js');

        $this->addJavascript($this->modx->clientsettings->config['js_url'] . 'mgr/widgets/categories.grid.js');
        $this->addJavascript($this->modx->clientsettings->config['js_url'] . 'mgr/widgets/settings.grid.js');

        $this->addLastJavascript($this->modx->clientsettings->config['js_url'] . 'mgr/sections/admin.js');
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
        return $this->modx->clientsettings->config['templates_path'] . 'admin.tpl';
    }

    /**
     * @access public.
     * @returns Boolean.
     */
    public function checkPermissions()
    {
        return $this->modx->hasPermission('clientsettings_admin');
    }
}
