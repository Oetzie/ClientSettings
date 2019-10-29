<?php

/**
 * Client Settings
 *
 * Copyright 2019 by Oene Tjeerd de Bruin <modx@oetzie.nl>
 */

$_lang['clientsettings']                                        = 'Settings';
$_lang['clientsettings.desc']                                   = 'Change or manage system settings.';

$_lang['area_clientsettings']                                   = 'Settings';

$_lang['setting_clientsettings.branding_url']                   = 'Branding';
$_lang['setting_clientsettings.branding_url_desc']              = 'The URL of the branding button, if the URL is empty the branding button won\'t be shown.';
$_lang['setting_clientsettings.branding_url_help']              = 'Branding (help)';
$_lang['setting_clientsettings.branding_url_help_desc']         = 'The URL of the branding help button, if the URL is empty the branding help button won\'t be shown.';
$_lang['setting_clientsettings.exclude_contexts']               = 'Exclude contexts';
$_lang['setting_clientsettings.exclude_contexts_desc']          = 'The contexts to exclude from \'Settings\', separate multiple contexts with a comma.';
$_lang['setting_clientsettings.vtabs']                          = 'Vertical tabs';
$_lang['setting_clientsettings.vtabs_desc']                     = 'If "Yes" display the settings in vertical tabs. Defaults is "No".';

$_lang['clientsettings.category']                               = 'Area';
$_lang['clientsettings.categories']                             = 'Areas';
$_lang['clientsettings.categories_desc']                        = 'Here you can manage all the areas for the settings.';
$_lang['clientsettings.category_create']                        = 'Create new area';
$_lang['clientsettings.category_update']                        = 'Update area';
$_lang['clientsettings.category_remove']                        = 'Delete area';
$_lang['clientsettings.category_remove_confirm']                = 'Are you sure you want to delete this area, this will also remove the child settings?';

$_lang['clientsettings.label_category_name']                    = 'Name';
$_lang['clientsettings.label_category_name_desc']               = 'The name of the area.';
$_lang['clientsettings.label_category_description']             = 'Description';
$_lang['clientsettings.label_category_description_desc']        = 'The description of the area, this will be shown above settings.';
$_lang['clientsettings.label_category_settings']                = 'Settings';
$_lang['clientsettings.label_category_settings_desc']           = '';
$_lang['clientsettings.label_category_active']                  = 'Active';
$_lang['clientsettings.label_category_active_desc']             = '';
$_lang['clientsettings.label_category_exclude']                 = 'Exclude context(s)';
$_lang['clientsettings.label_category_exclude_desc']            = 'Exclude the area for context(s). Use a comma to separate contexts.';

$_lang['clientsettings.setting']                                = 'Setting';
$_lang['clientsettings.settings']                               = 'Settings';
$_lang['clientsettings.settings_desc']                          = 'here you can manage all the settings of your site. The settings can be used on the website by the [[++key]] tags';
$_lang['clientsettings.setting_create']                         = 'Create new setting';
$_lang['clientsettings.setting_update']                         = 'Update setting';
$_lang['clientsettings.setting_remove']                         = 'Delete setting';
$_lang['clientsettings.setting_remove_confirm']                 = 'Are you sure you want to delete this setting?';
$_lang['clientsettings.setting_duplicate']                      = 'Duplicate setting';

$_lang['clientsettings.label_setting_key']                      = 'Key';
$_lang['clientsettings.label_setting_key_desc']                 = 'The key of the setting. the setting will be available by the [[+key]] tags.';
$_lang['clientsettings.label_setting_label']                    = 'Label';
$_lang['clientsettings.label_setting_label_desc']               = 'The label of the setting.';
$_lang['clientsettings.label_setting_value']                    = 'Value';
$_lang['clientsettings.label_setting_value_desc']               = 'The value of the setting.';
$_lang['clientsettings.label_setting_description']              = 'Description';
$_lang['clientsettings.label_setting_description_desc']         = 'The description of the setting.';
$_lang['clientsettings.label_setting_category']                 = 'Area';
$_lang['clientsettings.label_setting_category_desc']            = 'The area of the setting.';
$_lang['clientsettings.label_setting_active']                   = 'Active';
$_lang['clientsettings.label_setting_active_desc']              = '';
$_lang['clientsettings.label_setting_xtype']                    = 'Type';
$_lang['clientsettings.label_setting_xtype_desc']               = 'The type of the of the setting, this can be textfield, textarea, or listbox for example.';
$_lang['clientsettings.label_setting_exclude']                  = 'Exclude context(s)';
$_lang['clientsettings.label_setting_exclude_desc']             = 'Exclude the setting for context(s). Use a comma to separate contexts.';
$_lang['clientsettings.label_setting_mindate']                  = 'Minimal date';
$_lang['clientsettings.label_setting_mindate_desc']             = 'The minimal date that needs to be selected.';
$_lang['clientsettings.label_setting_maxdate']                  = 'Maximum date';
$_lang['clientsettings.label_setting_maxdate_desc']             = 'The maximum date that can be selected.';
$_lang['clientsettings.label_setting_mintime']                  = 'Minimal time';
$_lang['clientsettings.label_setting_mintime_desc']             = 'The minimal time that needs to be selected.';
$_lang['clientsettings.label_setting_maxtime']                  = 'Maximum time';
$_lang['clientsettings.label_setting_maxtime_desc']             = 'The maximum date that can be selected.';
$_lang['clientsettings.label_setting_source']                   = 'Media source';
$_lang['clientsettings.label_setting_source_desc']              = 'The media source for the media browser.';
$_lang['clientsettings.label_setting_opento']                   = 'Media source default map';
$_lang['clientsettings.label_setting_opento_desc']              = 'The default map for the media browser.';
$_lang['clientsettings.label_setting_filetypes']                = 'Allowed media browser extensions';
$_lang['clientsettings.label_setting_filetypes_desc']           = 'The allowed extensions, to separate extensions use a comma.';
$_lang['clientsettings.label_setting_toolbar1']                 = 'Toolbar 1';
$_lang['clientsettings.label_setting_toolbar1_desc']            = 'The buttons for the first toolbar in the WYSIWYG editor.';
$_lang['clientsettings.label_setting_toolbar2']                 = 'Toolbar 2';
$_lang['clientsettings.label_setting_toolbar2_desc']            = 'The buttons for the second toolbar in the WYSIWYG editor.';
$_lang['clientsettings.label_setting_toolbar3']                 = 'Toolbar 3';
$_lang['clientsettings.label_setting_toolbar3_desc']            = 'The buttons for the third toolbar in the  WYSIWYG editor.';
$_lang['clientsettings.label_setting_plugins']                  = 'Plugins';
$_lang['clientsettings.label_setting_plugins_desc']             = 'The plugins which are used in the WYSIWYG editor.';
$_lang['clientsettings.label_setting_clientgrid']               = 'Grid ID';
$_lang['clientsettings.label_setting_clientgrid_desc']          = 'The ID of the grid for the grid.';
$_lang['clientsettings.label_setting_values']                   = 'Values';
$_lang['clientsettings.label_setting_values_desc']              = '';
$_lang['clientsettings.label_setting_binded_values']            = 'Values statement';
$_lang['clientsettings.label_setting_binded_values_desc']       = 'Values statement to get extra values from a database tabel or snippet. This must start with @SELECT or @SNIPPET. De values needs to be outputed as a "value" and "label". Placeholders that can be used in a database select are "{user}", "{db_name}", "{db_table_prefix}", "{db_charset}" and "{context}". Example <code>@SELECT `id` AS `value`, `pagetitle` AS `label` FROM `{db_table_prefix}site_content` WHERE `context_key` = \'{context}\'</code> or <code>@SNIPPET pdoResources</code>.';

$_lang['clientsettings.settings_desc']                          = 'Here you can edit your site settings.';
$_lang['clientsettings.no_settings']                            = 'No settings';
$_lang['clientsettings.no_settings_desc']                       = 'It seems that there are no settings available.';
$_lang['clientsettings.default_settings']                       = 'Settings';
$_lang['clientsettings.extra_settings']                         = 'Type settings';
$_lang['clientsettings.no_extra_settings']                      = 'This setting has no extra settings.';
$_lang['clientsettings.default_view']                           = 'Default view';
$_lang['clientsettings.admin_view']                             = 'Admin view';
$_lang['clientsettings.filter_context']                         = 'Filter at context...';
$_lang['clientsettings.filter_category']                        = 'Filter at area...';
$_lang['clientsettings.value']                                  = 'Value';
$_lang['clientsettings.label']                                  = 'Label';
$_lang['clientsettings.xtype_textfield']                        = 'Textfield';
$_lang['clientsettings.xtype_datefield']                        = 'Textfield (date)';
$_lang['clientsettings.xtype_timefield']                        = 'Textfield (time)';
$_lang['clientsettings.xtype_datetimefield']                    = 'Textfield (date with time)';
$_lang['clientsettings.xtype_passwordfield']                    = 'Textfield (password)';
$_lang['clientsettings.xtype_numberfield']                      = 'Textfield (number)';
$_lang['clientsettings.xtype_textarea']                         = 'Textarea';
$_lang['clientsettings.xtype_richtext']                         = 'WYSIWYG editor';
$_lang['clientsettings.xtype_boolean']                          = 'Listbox (yes/no)';
$_lang['clientsettings.xtype_combo']                            = 'Listbox (multiple choice)';
$_lang['clientsettings.xtype_checkbox']                         = 'Checkbox';
$_lang['clientsettings.xtype_checkboxgroup']                    = 'Checkbox (multiple choice)';
$_lang['clientsettings.xtype_radiogroup']                       = 'Radio';
$_lang['clientsettings.xtype_resource']                         = 'Resource';
$_lang['clientsettings.xtype_browser']                          = 'Media';
$_lang['clientsettings.xtype_clientgrid']                       = 'Grid';
$_lang['clientsettings.setting_error_character']                = 'Setting key contains forbidden characters. Please specify another keyname.';
$_lang['clientsettings.setting_error_exists']                   = 'Setting with that key already exists. Please specify another keyname.';
$_lang['clientsettings.context_not_exists']                     = 'Context not found.';
