<?php

	/**
	 * Client Settings
	 *
	 * Copyright 2016 by Oene Tjeerd de Bruin <info@oetzie.nl>
	 *
	 * This file is part of Client Settings, a real estate property listings component
	 * for MODX Revolution.
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
	$_lang['clientsettings.desc'] 									= 'Change or create site-wide system settings.';
	
	$_lang['area_clientsettings']									= 'Settings';
	
	$_lang['setting_clientsettings_admin_groups']					= 'Usergroups';
	$_lang['setting_clientsettings_admin_groups_desc']				= 'The usergroups that are allowed to acces the admin panel of the settings, to separate usergroups use a comma.';
	
	$_lang['clientsettings.category'] 								= 'Area';
	$_lang['clientsettings.categories'] 							= 'Areas';
	$_lang['clientsettings.categories_desc'] 						= 'Here you can set area settings for the MODX site. Double-click on the value column for the area you\'d like to edit to dynamically edit via the grid or right-click on an area for more options.';
	$_lang['clientsettings.category_create']						= 'Create new area';
	$_lang['clientsettings.category_update']						= 'Update area';
	$_lang['clientsettings.category_remove']						= 'Delete area';
	$_lang['clientsettings.category_remove_confirm']				= 'Are you sure you want to delete this area, this will also remove the child settings? This might break your MODX installation.';
	
	$_lang['clientsettings.setting'] 								= 'Setting';
	$_lang['clientsettings.settings'] 								= 'Settings';
	$_lang['clientsettings.settings_desc'] 							= 'Here you can set general preferences and configuration settings for the MODX site. Double-click on the value column for the setting you\'d like to edit to dynamically edit via the grid, or right-click on a setting for more options. You can also click the "+" sign for a description of the setting.';
	$_lang['clientsettings.setting_create']							= 'Createn new setting';
	$_lang['clientsettings.setting_update']							= 'Update setting';
	$_lang['clientsettings.setting_remove']							= 'Delete setting';
	$_lang['clientsettings.setting_copy'] 							= 'Duplicate setting';
	$_lang['clientsettings.setting_remove_confirm']					= 'Are you sure you want to delete this setting? This might break your MODX installation.';
	
	$_lang['clientsettings.label_active']							= 'Active';
	$_lang['clientsettings.label_active_desc']						= '';
	$_lang['clientsettings.category_label_name']					= 'Name';
	$_lang['clientsettings.category_label_name_desc']				= 'The name of the area';
	$_lang['clientsettings.category_label_description']				= 'Description';
	$_lang['clientsettings.category_label_description_desc']		= 'The description of the area, this will be shown above settings.';
	$_lang['clientsettings.category_label_settings']				= 'Settings';
	$_lang['clientsettings.category_label_settings_desc']			= '';
	$_lang['clientsettings.setting_label_key']						= 'Key';
	$_lang['clientsettings.setting_label_key_desc']					= 'The key of the setting. the setting will be available by the [[+key]] tags.';
	$_lang['clientsettings.setting_label_label']					= 'Label';
	$_lang['clientsettings.setting_label_label_desc']				= 'The label of the setting.';
	$_lang['clientsettings.setting_label_value']					= 'Value';
	$_lang['clientsettings.setting_label_value_desc']				= 'The value of the setting.';
	$_lang['clientsettings.setting_label_description']				= 'Description';
	$_lang['clientsettings.setting_label_description_desc']			= 'The description of the setting.';
	$_lang['clientsettings.setting_label_category']					= 'Area';
	$_lang['clientsettings.setting_label_category_desc']			= 'The area of the setting.';
	$_lang['clientsettings.setting_label_xtype']					= 'Type';
	$_lang['clientsettings.setting_label_xtype_desc']				= 'The type of the of the setting, this can be textfield, textarea, or listbox for example.';
	$_lang['clientsettings.setting_label_exclude']					= 'Exclude context(s)';
	$_lang['clientsettings.setting_label_exclude_desc']				= 'Exclude the setting for the context(s), to separate contexts use a comma.';
	$_lang['clientsettings.setting_label_mindate']					= 'Minimal date';
	$_lang['clientsettings.setting_label_mindate_desc']				= 'The minimal date that needs to be selected.';
	$_lang['clientsettings.setting_label_maxdate']					= 'Maximum date';
	$_lang['clientsettings.setting_label_maxdate_desc']				= 'The maximum date that can be selected.';
	$_lang['clientsettings.setting_label_mintime']					= 'Minimal time';
	$_lang['clientsettings.setting_label_mintime_desc']				= 'The minimal time that needs to be selected.';
	$_lang['clientsettings.setting_label_maxtime']					= 'Maximum time';
	$_lang['clientsettings.setting_label_maxtime_desc']				= 'The maximum date that can be selected.';
	$_lang['clientsettings.setting_label_source']					= 'Media source';
	$_lang['clientsettings.setting_label_source_desc']				= 'The media source for the media browser.';
	$_lang['clientsettings.setting_label_opento']					= 'Media source default map';
	$_lang['clientsettings.setting_label_opento_desc']				= 'The default map for the media browser.';
	$_lang['clientsettings.setting_label_filetypes']				= 'Allowed media browser extensions';
	$_lang['clientsettings.setting_label_filetypes_desc'] 			= 'The allowed extensions, to separate extensions use a comma.';
	$_lang['clientsettings.setting_label_toolbar1']					= 'Toolbar 1';
	$_lang['clientsettings.setting_label_toolbar1_desc']			= 'The buttons for the first toolbar in the WYSIWYG editor.';
	$_lang['clientsettings.setting_label_toolbar2']					= 'Toolbar 2';
	$_lang['clientsettings.setting_label_toolbar2_desc']			= 'The buttons for the second toolbar in the WYSIWYG editor.';
	$_lang['clientsettings.setting_label_toolbar3']					= 'Toolbar 3';
	$_lang['clientsettings.setting_label_toolbar3_desc']			= 'The buttons for the third toolbar in the  WYSIWYG editor.';
	$_lang['clientsettings.setting_label_plugins']					= 'Plugins';
	$_lang['clientsettings.setting_label_plugins_desc']				= 'The plugins which are used in the WYSIWYG editor.';
	
	$_lang['clientsettings.no_settings']							= 'No settings';
	$_lang['clientsettings.no_settings_desc']						= 'It seems that there are no settings available.';
	$_lang['clientsettings.extra_settings']							= 'Extra settings';
	$_lang['clientsettings.no_extra_settings']						= 'This setting has no extra settings.';
	$_lang['clientsettings.client_view']							= 'Normal view';
	$_lang['clientsettings.admin_view']								= 'Admin view';
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