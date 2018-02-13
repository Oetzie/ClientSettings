<?php

    /**
     * Client Settings
     *
     * Copyright 2018 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     */
    
    $xpdo_meta_map['ClientSettingsSettings'] = [
        'package'       => 'clientsettings',
        'version'       => '1.0',
        'table'         => 'clientsettings_settings',
        'extends'       => 'xPDOSimpleObject',
        'fields'        => [
            'id'            => null,
            'category_id'   => null,
            'key'           => null,
            'label'         => null,
            'description'   => null,
            'xtype'         => null,
            'exclude'       => null,
            'extra'         => null,
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
            'category_id'   => [
                'dbtype'        => 'int',
                'precision'     => '11',
                'phptype'       => 'integer',
                'null'          => false
            ],
            'key'           => [
                'dbtype'        => 'varchar',
                'precision'     => '75',
                'phptype'       => 'string',
                'null'          => false
            ],
            'label'         => [
                'dbtype'        => 'varchar',
                'precision'     => '75',
                'phptype'       => 'string',
                'null'          => false
            ],
            'description'   => [
                'dbtype'        => 'varchar',
                'precision'     => '255',
                'phptype'       => 'string',
                'null'          => false
            ],
            'xtype'         => [
                'dbtype'        => 'varchar',
                'precision'     => '75',
                'phptype'       => 'string',
                'null'          => false
            ],
            'exclude'       => [
                'dbtype'        => 'varchar',
                'precision'     => '255',
                'phptype'       => 'string',
                'null'          => false
            ],
            'extra'         => [
                'dbtype'        => 'text',
                'phptype'       => 'string',
                'null'          => false
            ],
            'menuindex'     => [
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
                        'null'          => false,
                    ]
                ]
            ]
        ],
        'aggregates'    => [
            'Category'      => [
                'local'         => 'category_id',
                'class'         => 'ClientSettingsCategories',
                'foreign'       => 'id',
                'owner'         => 'foreign',
                'cardinality'   => 'one'
            ],
            'Value'         => [
                'local'         => 'id',
                'class'         => 'ClientSettingsValues',
                'foreign'       => 'setting_id',
                'owner'         => 'local',
                'cardinality'   => 'many'
            ]
        ]
    ];

?>