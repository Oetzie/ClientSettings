<?php
/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */

if (in_array($modx->event->name, ['OnLoadWebDocument'], true)) {
    $instance = $modx->getService('clientsettingsplugins', 'ClientSettingsPlugins', $modx->getOption('clientsettings.core_path', null, $modx->getOption('core_path') . 'components/clientsettings/') . 'model/clientsettings/');

    if ($instance instanceof ClientSettingsPlugins) {
        $method = lcfirst($modx->event->name);

        if (method_exists($instance, $method)) {
            $instance->$method($scriptProperties);
        }
    }
}