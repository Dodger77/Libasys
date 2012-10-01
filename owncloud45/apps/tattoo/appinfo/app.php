<?php

/**
* ownCloud - Tattoo
*
* @author Arthur Schiwon
* @copyright 2012 Arthur Schiwon blizzz@owncloud.com
*
* This library is free software; you can redistribute it and/or
* modify it under the terms of the GNU AFFERO GENERAL PUBLIC LICENSE
* License as published by the Free Software Foundation; either
* version 3 of the License, or any later version.
*
* This library is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU AFFERO GENERAL PUBLIC LICENSE for more details.
*
* You should have received a copy of the GNU Affero General Public
* License along with this library.  If not, see <http://www.gnu.org/licenses/>.
*
*/

OC_APP::registerPersonal('tattoo','settings');

$wallpaper=OC_Preferences::getValue(OC_User::getUser(),'tattoo','wallpaper','none');
if($wallpaper != 'none') {
	OC_Util::addStyle('tattoo', 'tattoo');
	OC_Util::addScript('tattoo', 'tattoo');
}
