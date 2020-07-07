<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */

$package = 'ClientSettings';

$events = [[
    'name'          => 'OnClientSettingsSave',
    'service'       => 6,
    'groupname'     => 'clientsettings'
], [
    'name'          => 'OnClientSettingsRegisterSettings',
    'service'       => 6,
    'groupname'     => 'clientsettings'
]];

$success = false;

if ($object->xpdo) {
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            $modx =& $object->xpdo;

            foreach ($events as $event) {
                if (isset($event['name'])) {
                    $object = $modx->getObject('modEvent', [
                        'name' => $event['name']
                    ]);

                    if (!$object) {
                        $object = $modx->newObject('modEvent');
                    }

                    if ($object) {
                        $object->set('name', $event['name']);

                        $object->fromArray($event);

                        $object->save();
                    }
                }
            }

            $success = true;

            break;
        case xPDOTransport::ACTION_UNINSTALL:
            $success = true;

            break;
    }
}

return $success;
