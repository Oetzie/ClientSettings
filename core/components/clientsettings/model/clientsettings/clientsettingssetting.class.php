<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */
    
class ClientSettingsSetting extends xPDOSimpleObject
{
    /**
     * @access public.
     * @return Integer.
     */
    public function getMenuIndex()
    {
        $criteria = $this->xpdo->newQuery('ClientSettingsSetting', [
            'category_id' => $this->get('category_id')
        ]);

        $criteria->sortby('menuindex', 'DESC');
        $criteria->limit(1);

        $object = $this->xpdo->getObject('ClientSettingsSetting', $criteria);

        if ($object) {
            return (int) $object->get('menuindex') + 1;
        }

        return 0;
    }

    /**
     * @access public.
     * @return Array.
     */
    public function getExtraValues()
    {
        $extras = json_decode($this->get('extra'), true);

        if (in_array($this->get('xtype'), ['combo', 'checkboxgroup', 'radiogroup'], true)) {
            $data = [];

            if (isset($extras['values'])) {
                foreach ((array) $extras['values'] as $key => $value) {
                    if (!empty($value['label'])) {
                        $data[] = $value;
                    }
                }
            }

            if (isset($extras['bindedValues'])) {
                $context = $this->xpdo->getOption('default_context');

                if (isset($_GET['context'])) {
                    $context = $_GET['context'];
                } else if (isset($_GET['context_key'])) {
                    $context = $_GET['context_key'];
                }

                if (!empty($extras['bindedValues'])) {
                    if (preg_match('/^@SELECT\s/i', $extras['bindedValues'])) {
                        $query = ltrim($extras['query'], '@');

                        $placeholders = [
                            'user'              => $this->xpdo->placeholders['modx.user.id'],
                            'db_name'           => $this->xpdo->placeholders['+dbname'],
                            'db_table_prefix'   => $this->xpdo->placeholders['+table_prefix'],
                            'db_charset'        => $this->xpdo->placeholders['+charset'],
                            'host'              => $this->xpdo->placeholders['+host'],
                            'context'           => $context
                        ];

                        foreach ($placeholders as $key => $value) {
                            $query = str_replace('{' . $key . '}', $value, $query);
                        }

                        $result = $this->xpdo->query($query);

                        if ($result) {
                            while ($value = $result->fetch(PDO::FETCH_ASSOC)) {
                                if (isset($value['value'], $value['label'])) {
                                    $data[] = [
                                        'value' => $value['value'],
                                        'label' => $value['label']
                                    ];
                                }
                            }
                        }
                    } else if (preg_match('/^@SNIPPET\s/i', $extras['bindedValues'])) {
                        $snippet = ltrim($extras['bindedValues'], '@SNIPPET');

                        $result = $this->xpdo->runSnippet($snippet, [
                            'id'        => $this->get('id'),
                            'key'       => $this->get('key'),
                            'context'   => $context
                        ]);

                        if ($result) {
                            foreach ((array) $result as $value) {
                                $data[] = [
                                    'value' => $value['value'],
                                    'label' => $value['label']
                                ];
                            }
                        }
                    }
                }
            }

            $extras['values'] = $data;
        }

        return $extras;
    }
}
