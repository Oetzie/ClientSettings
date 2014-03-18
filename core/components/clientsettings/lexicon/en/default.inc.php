<?php

	/**
	 * ClientSettings
	 *
	 * Copyright 2013 by Oene Tjeerd de Bruin <info@oetzie.nl>
	 *
	 * This file is part of ClientSettings, a real estate property listings component
	 * for MODX Revolution.
	 *
	 * ClientSettings is free software; you can redistribute it and/or modify it under
	 * the terms of the GNU General Public License as published by the Free Software
	 * Foundation; either version 2 of the License, or (at your option) any later
	 * version.
	 *
	 * ClientSettings is distributed in the hope that it will be useful, but WITHOUT ANY
	 * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
	 * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
	 *
	 * You should have received a copy of the GNU General Public License along with
	 * ClientSettings; if not, write to the Free Software Foundation, Inc., 59 Temple Place,
	 * Suite 330, Boston, MA 02111-1307 USA
	 */

	$_lang['clientsettings'] 								= 'Settings';
	$_lang['clientsettings.desc'] 							= 'Change or create site-wide system settings.';
	
	$_lang['area_clientsettings']							= 'Settings';
	
	$_lang['setting_clientsettings.admin_groups']			= 'Usergroups';
	$_lang['setting_clientsettings.admin_groups_desc']		= 'The usergroups that are allowed to acces the admin panel of the settings, to separate usergroups use a gebruikersgroepen scheiden met een comma.';
	
	$_lang['clientsettings.admin_area'] 					= 'Area';
	$_lang['clientsettings.admin_areas'] 					= 'Areas';
	$_lang['clientsettings.admin_areas_desc'] 				= 'Here you can set area settings for the MODX site. Double-click on the value column for the area you\'d like to edit to dynamically edit via the grid or right-click on an area for more options.';
	$_lang['clientsettings.admin_area_create']				= 'Create new area';
	$_lang['clientsettings.admin_area_update']				= 'Update area';
	$_lang['clientsettings.admin_area_remove']				= 'Delete area';
	$_lang['clientsettings.admin_area_remove_confirm']		= 'Are you sure you want to delete this area? This might break your MODX installation.';
	
	$_lang['clientsettings.admin_setting'] 					= 'Setting';
	$_lang['clientsettings.admin_settings'] 				= 'Settings';
	$_lang['clientsettings.admin_settings_desc'] 			= 'Here you can set general preferences and configuration settings for the MODX site. Double-click on the value column for the setting you\'d like to edit to dynamically edit via the grid, or right-click on a setting for more options. You can also click the "+" sign for a description of the setting.';
	$_lang['clientsettings.admin_setting_create']			= 'Createn new setting';
	$_lang['clientsettings.admin_setting_update']			= 'Update setting';
	$_lang['clientsettings.admin_setting_remove']			= 'Delete setting';
	$_lang['clientsettings.admin_setting_remove_confirm']	= 'Are you sure you want to delete this setting? This might break your MODX installation.';
	
	$_lang['clientsettings.label_key']						= 'Key';
	$_lang['clientsettings.label_key_desc']					= 'The key of the setting. The setting will be avaible by the [[++key]] tags.';
	$_lang['clientsettings.label_label']					= 'Label';
	$_lang['clientsettings.label_label_desc']				= 'The label for the setting.';
	$_lang['clientsettings.label_name']						= 'Name';
	$_lang['clientsettings.label_name_desc']				= 'The name for the area.';
	$_lang['clientsettings.label_description']				= 'Description';
	$_lang['clientsettings.label_description_desc']			= 'A short description of the setting.';
	$_lang['clientsettings.label_area']						= 'Area';
	$_lang['clientsettings.label_area_desc']				= 'The area of the setting.';
	$_lang['clientsettings.label_xtype']					= 'Type';
	$_lang['clientsettings.label_xtype_desc']				= 'The type of the setting. For example this can be a textfield, textarea, or boolean.';
	$_lang['clientsettings.label_exclude']					= 'Exclude context';
	$_lang['clientsettings.label_exclude_desc']				= 'Exclude setting for context. Separate contexts with a comma.';
	$_lang['clientsettings.label_menuindex']				= 'Menuindex';
	$_lang['clientsettings.label_menuindex_desc']			= '';
	$_lang['clientsettings.label_value']					= 'Value';
	$_lang['clientsettings.label_value_desc']				= '';
	
	
	$_lang['clientsettings.no_settings']					= 'No settings';
	$_lang['clientsettings.no_settings_desc']				= 'It seems that there are no settings available.';
	$_lang['clientsettings.client_view']					= 'Normal view';
	$_lang['clientsettings.admin_view']						= 'Admin view';
	$_lang['clientsettings.number']							= 'Number';
	$_lang['clientsettings.setting_error_character']		= 'Setting key contains forbidden characters. Please specify another keyname.';
	$_lang['clientsettings.setting_error_exists']			= 'Setting with that key already exists. Please specify another keyname.';
	
?>