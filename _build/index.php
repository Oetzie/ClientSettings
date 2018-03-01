<?php
    
    /**
     * Package Builder
     *
     * Copyright 2017 by Oene Tjeerd de Bruin <modx@oetzie.nl>
     *
     * Package Builder is free software; you can redistribute it and/or modify it under
     * the terms of the GNU General Public License as published by the Free Software
     * Foundation; either version 2 of the License, or (at your option) any later
     * version.
     *
     * Package Builder is distributed in the hope that it will be useful, but WITHOUT ANY
     * WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
     * A PARTICULAR PURPOSE. See the GNU General Public License for more details.
     *
     * You should have received a copy of the GNU General Public License along with
     * Package Builder; if not, write to the Free Software Foundation, Inc., 59 Temple Place,
     * Suite 330, Boston, MA 02111-1307 USA
     */
     
    require_once dirname(__FILE__).'/packagebuilder.class.php';
    
    $package = new PackageBuilder();
    
    $package->createPackageZip();

	
?>