<?php
    
    $success = false;

    $permissions = [
        [
            'name'          => 'clientsettings',
            'templates'     => ['AdministratorTemplate']
        ],
        [
            'name'          => 'clientsettings_admin',
            'templates'     => ['AdministratorTemplate'],
            'policies'      => ['Administrator']
        ]
    ];
    
    switch ($options[xPDOTransport::PACKAGE_ACTION]) {
        case xPDOTransport::ACTION_INSTALL:
        case xPDOTransport::ACTION_UPGRADE:
            foreach ($object->xpdo->getCollection('modAccessPolicyTemplate') as $templateObject) {
                foreach ($permissions as $permission) {
                    if (!isset($permission['templates']) || in_array($templateObject->get('name'), $permission['templates'])) {
                        $permission = array_merge($permission, [
                            'template'  => $templateObject->get('id'),
                            'value'     => 1
                        ]);
    
                        $c = array(
                            'name'      => $permission['name'],
                            'template'  => $permission['template']
                        );
    
                        if (null === $object->xpdo->getObject('modAccessPermission', $c)) {
                            if (null !== ($permissionObject = $object->xpdo->newObject('modAccessPermission'))) {
                                $permissionObject->fromArray($permission);
                                $permissionObject->save();
                            }
                        }
                    }
                }
            }
    
            foreach ($object->xpdo->getCollection('modAccessPolicy') as $policyObject) {
                $data = $policyObject->get('data');
    
                foreach ($permissions as $permission) {
                    if (isset($permission['policies'])) {
                        if (in_array($policyObject->get('name'), $permission['policies'])) {
                            $data[$permission['name']] = true;
                        } else {
                            $data[$permission['name']] = false;
                        }
                    } else {
                        $data[$permission['name']] = true;
                    }
                }
    
                $policyObject->set('data', $data);
                $policyObject->save();
            }
            
            $success = true;

            break;
        case xPDOTransport::ACTION_UNINSTALL:
            $success = true;
    
            break;
    }
    
    return $success;
    
?>