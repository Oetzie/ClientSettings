<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */
    
$xpdo_meta_map['ClientSettingsCategory'] = [
    'package'       => 'clientsettings',
    'version'       => '1.0',
    'table'         => 'clientsettings_category',
    'extends'       => 'xPDOSimpleObject',
    'fields'        => [
        'id'            => null,
        'name'          => null,
        'description'   => null,
        'exclude'       => null,
        'menuindex'     => null,
        'active'        => null,
        'editedon'      => null
    ],
    'fieldMeta'     => [
        'id'            => [
            'dbtype'        => 'int',
            'precision'     => '11',
            'phptype'       => 'integer',
            'null'          => false,
            'index'         => 'pk',
            'generated'     => 'native'
        ],
        'name'          => [
            'dbtype'        => 'varchar',
            'precision'     => '75',
            'phptype'       => 'string',
            'null'          => false
        ],
        'description'   => [
            'dbtype'        => 'text',
            'phptype'       => 'string',
            'null'          => false
        ],
        'exclude'       => [
            'dbtype'        => 'varchar',
            'precision'     => '255',
            'phptype'       => 'string',
            'null'          => false
        ],
        'menuindex'	     => [
            'dbtype'        => 'int',
            'precision'     => '11',
            'phptype'       => 'integer',
            'null'          => false
        ],
        'active'        => [
            'dbtype'        => 'int',
            'precision'     => '1',
            'phptype'       => 'integer',
            'null'          => false,
            'default'       => 1
        ],
        'editedon'      => [
            'dbtype'        => 'timestamp',
            'phptype'       => 'timestamp',
            'attributes'    => 'ON UPDATE CURRENT_TIMESTAMP',
            'null'          => false
        ]
    ],
    'indexes'       => [
        'PRIMARY'       => [
            'alias'         => 'PRIMARY',
            'primary'       => true,
            'unique'        => true,
            'columns'       => [
                'id'            => [
                    'collation'     => 'A',
                    'null'          => false
                ]
            ]
        ]
    ],
    'aggregates'    =>  [
        'Setting'       => [
            'local'         => 'id',
            'class'         => 'ClientSettingsSetting',
            'foreign'       => 'category_id',
            'owner'         => 'local',
            'cardinality'   => 'many'
        ]
    ]
];
