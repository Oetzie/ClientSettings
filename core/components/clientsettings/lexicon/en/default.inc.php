<?php

	/**
	 * Client Settings
	 *
	 * Copyright 2017 by Oene Tjeerd de Bruin <modx@oetzie.nl>
	 *
	 * Client Settings is free software; you can redistribute it and/or modify it under
	 * the terms of the GNU General Public License as published by the Free Software
	 * Foundation; either version 2 of the License, or (at your option) any later
	 * version.
	 *
	 * Client Settings is distributed in the hope that it will be useful, but WITHOUT ANY
	 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
	 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License along with
	 * Client Settings; if not, write to the Free Software Foundation, Inc., 59 Temple Place,
	 * Suite 330, Boston, MA 02111-1307 USA
	 */

	$_lang['clientsettings'] 										= 'Settings';
	$_lang['clientsettings.desc'] 									= 'Change or manage system settings.';
	
	$_lang['area_clientsettings']									= 'Settings';
	
	$_lang['clientsettings.category'] 								= 'Area';
	$_lang['clientsettings.categories'] 							= 'Areas';
	$_lang['clientsettings.categories_desc'] 						= 'Here you can manage all the areas for the settings of your site.';
	$_lang['clientsettings.category_create']						= 'Create new area';
	$_lang['clientsettings.category_update']						= 'Update area';
	$_lang['clientsettings.category_remove']						= 'Delete area';
	$_lang['clientsettings.category_remove_confirm']				= 'Are you sure you want to delete this area, this will also remove the child settings? This might break your installation.';
	
	$_lang['clientsettings.setting'] 								= 'Setting';
	$_lang['clientsettings.settings'] 								= 'Settings';
	$_lang['clientsettings.settings_desc'] 							= 'here you can manage all the settings of your site. The settings can be used on the website by the [[++key]] tags';
	$_lang['clientsettings.setting_create']							= 'Create new setting';
	$_lang['clientsettings.setting_update']							= 'Update setting';
	$_lang['clientsettings.setting_remove']							= 'Delete setting';
	$_lang['clientsettings.setting_duplicate'] 						= 'Duplicate setting';
	$_lang['clientsettings.setting_remove_confirm']					= 'Are you sure you want to delete this setting? This might break your MODX installation.';
	
	$_lang['clientsettings.label_category_name']					= 'Name';
	$_lang['clientsettings.label_category_name_desc']				= 'The name of the area, this can be a lexicon key.';
	$_lang['clientsettings.label_category_description']				= 'Description';
	$_lang['clientsettings.label_category_description_desc']		= 'The description of the area, this will be shown above settings. This can be a lexicon key.';
	$_lang['clientsettings.label_category_settings']				= 'Settings';
	$_lang['clientsettings.label_category_settings_desc']			= '';
	$_lang['clientsettings.label_category_active']					= 'Active';
	$_lang['clientsettings.label_category_active_desc']				= '';
	$_lang['clientsettings.label_category_exclude']					= 'Exclude context(s)';
	$_lang['clientsettings.label_category_exclude_desc']			= 'Exclude the area for context(s). Use a comma to separate contexts.';
	
	$_lang['clientsettings.label_setting_key']						= 'Key';
	$_lang['clientsettings.label_setting_key_desc']					= 'The key of the setting. the setting will be available by the [[+key]] tags.';
	$_lang['clientsettings.label_setting_label']					= 'Label';
	$_lang['clientsettings.label_setting_label_desc']				= 'The label of the setting, this can be a lexicon key.';
	$_lang['clientsettings.label_setting_value']					= 'Value';
	$_lang['clientsettings.label_setting_value_desc']				= 'The value of the setting.';
	$_lang['clientsettings.label_setting_description']				= 'Description';
	$_lang['clientsettings.label_setting_description_desc']			= 'The description of the setting, this can be a lexicon key.';
	$_lang['clientsettings.label_setting_category']					= 'Area';
	$_lang['clientsettings.label_setting_category_desc']			= 'The area of the setting.';
	$_lang['clientsettings.label_setting_active']					= 'Active';
	$_lang['clientsettings.label_setting_active_desc']				= '';
	$_lang['clientsettings.label_setting_xtype']					= 'Type';
	$_lang['clientsettings.label_setting_xtype_desc']				= 'The type of the of the setting, this can be textfield, textarea, or listbox for example.';
	$_lang['clientsettings.label_setting_exclude']					= 'Exclude context(s)';
	$_lang['clientsettings.label_setting_exclude_desc']				= 'Exclude the setting for context(s). Use a comma to separate contexts.';
	$_lang['clientsettings.label_setting_mindate']					= 'Minimal date';
	$_lang['clientsettings.label_setting_mindate_desc']				= 'The minimal date that needs to be selected.';
	$_lang['clientsettings.label_setting_maxdate']					= 'Maximum date';
	$_lang['clientsettings.label_setting_maxdate_desc']				= 'The maximum date that can be selected.';
	$_lang['clientsettings.label_setting_mintime']					= 'Minimal time';
	$_lang['clientsettings.label_setting_mintime_desc']				= 'The minimal time that needs to be selected.';
	$_lang['clientsettings.label_setting_maxtime']					= 'Maximum time';
	$_lang['clientsettings.label_setting_maxtime_desc']				= 'The maximum date that can be selected.';
	$_lang['clientsettings.label_setting_source']					= 'Media source';
	$_lang['clientsettings.label_setting_source_desc']				= 'The media source for the media browser.';
	$_lang['clientsettings.label_setting_opento']					= 'Media source default map';
	$_lang['clientsettings.label_setting_opento_desc']				= 'The default map for the media browser.';
	$_lang['clientsettings.label_setting_filetypes']				= 'Allowed media browser extensions';
	$_lang['clientsettings.label_setting_filetypes_desc'] 			= 'The allowed extensions, to separate extensions use a comma.';
	$_lang['clientsettings.label_setting_toolbar1']					= 'Toolbar 1';
	$_lang['clientsettings.label_setting_toolbar1_desc']			= 'The buttons for the first toolbar in the WYSIWYG editor.';
	$_lang['clientsettings.label_setting_toolbar2']					= 'Toolbar 2';
	$_lang['clientsettings.label_setting_toolbar2_desc']			= 'The buttons for the second toolbar in the WYSIWYG editor.';
	$_lang['clientsettings.label_setting_toolbar3']					= 'Toolbar 3';
	$_lang['clientsettings.label_setting_toolbar3_desc']			= 'The buttons for the third toolbar in the  WYSIWYG editor.';
	$_lang['clientsettings.label_setting_plugins']					= 'Plugins';
	$_lang['clientsettings.label_setting_plugins_desc']				= 'The plugins which are used in the WYSIWYG editor.';
	
	$_lang['clientsettings.settings_desc']							= 'Here you can edit your site settings.';
	$_lang['clientsettings.no_settings']							= 'No settings';
	$_lang['clientsettings.no_settings_desc']						= 'It seems that there are no settings available.';
	$_lang['clientsettings.extra_settings']							= 'Extra settings';
	$_lang['clientsettings.no_extra_settings']						= 'This setting has no extra settings.';
	$_lang['clientsettings.default_view']							= 'Default view';
	$_lang['clientsettings.admin_view']								= 'Admin view';
	$_lang['clientsettings.filter_context']							= 'Filter at context...';
	$_lang['clientsettings.filter_category']						= 'Filter at area...';
	$_lang['clientsettings.textfield']								= 'Textfield';
	$_lang['clientsettings.datefield']								= 'Textfield (date)';
	$_lang['clientsettings.timefield']								= 'Textfield (time)';
	$_lang['clientsettings.datetimefield']							= 'Textfield (date with time)';
	$_lang['clientsettings.passwordfield']							= 'Textfield (password)';
	$_lang['clientsettings.numberfield']							= 'Textfield (number)';
	$_lang['clientsettings.textarea']								= 'Textarea';
	$_lang['clientsettings.richtext']								= 'WYSIWYG editor';
	$_lang['clientsettings.boolean']								= 'Listbox (yes/no)';
	$_lang['clientsettings.combo']									= 'Listbox (multiple choice)';
	$_lang['clientsettings.checkbox']								= 'Checkbox';
	$_lang['clientsettings.checkboxgroup']							= 'Checkbox (multiple choice)';
	$_lang['clientsettings.radiogroup']								= 'Radio';
	$_lang['clientsettings.resource']								= 'Resource';
	$_lang['clientsettings.browser']								= 'Media';
	$_lang['clientsettings.setting_error_character']				= 'Setting key contains forbidden characters. Please specify another keyname.';
	$_lang['clientsettings.setting_error_exists']					= 'Setting with that key already exists. Please specify another keyname.';
	
?>