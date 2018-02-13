<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    $xpdo_meta_map['ClientSettingsValues'] = [
        'package'       => 'clientsettings',
        'version'       => '1.0',
        'table'         => 'clientsettings_values',
        'extends'       => 'xPDOSimpleObject',
        'fields'        => [
            'id'            => null,
            'setting_id'    => null,
            'context'       => null,
            'key'           => null,
            'value'         => null,
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
            'setting_id'    => [
                'dbtype'        => 'int',
                'precision'     => '11',
                'phptype'       => 'integer',
                'null'          => false
            ],
            'context'       => [
                'dbtype'        => 'varchar',
                'precision'     => '75',
                'phptype'       => 'string',
                'null'          => false
            ],
            'key'           => [
                'dbtype'        => 'varchar',
                'precision'     => '75',
                'phptype'       => 'string',
                'null'          => false
            ],
            'value'         => [
                'dbtype'        => 'text',
                'phptype'       => 'string',
                'null'          => false
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
                        'null'          => false,
                    ]
                ]
            ]
        ],
        'aggregates'    => [
            'Setting'       => [
                'local'         => 'setting_id',
                'class'         => 'ClientSettingsSettings',
                'foreign'       => 'id',
                'owner'         => 'foreign',
                'cardinality'   => 'one'
            ]
        ]
    ];

?>