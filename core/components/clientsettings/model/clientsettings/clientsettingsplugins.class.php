<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */

require_once __DIR__ . '/clientsettings.class.php';

class ClientSettingsPlugins extends ClientSettings
{
    /**
     * @access public.
     */
    public function onMODXInit()
    {
        $this->onHandleSettings();
    }

    /**
     * @access public.
     */
    public function onHandleRequest()
    {
        $this->onHandleSettings();
    }

    /**
     * @access public.
     */
    public function pdoToolsOnFenomInit()
    {
        $this->onHandleSettings();
    }

    /**
     * @access public.
     */
    private function onHandleSettings()
    {
        if (!in_array($this->modx->context->get('key'), $this->getOption('exclude_contexts'), true)) {
            $settings = $this->getSettingsValues($this->modx->context->get('key'));

            if (count($settings) >= 1) {
                $this->modx->setPlaceholders($settings, '+');

                foreach ($settings as $key => $value) {
                    $this->modx->setOption($key, $value);
                }
            }
        }
    }
}
