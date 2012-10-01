/**
* ownCloud - DjazzLab Themes Manager plugin
*
* @author Xavier Beurois
* @copyright 2012 Xavier Beurois www.djazz-lab.net
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
* You should have received a copy of the GNU Lesser General Public 
* License along with this library.  If not, see <http://www.gnu.org/licenses/>.
* 
*/

$(document).ready(function(){
	$('#tm_switcher').bind('change', function(){
		$.ajax({
			type:'POST',
			url:OC.linkTo('themes_manager','ajax/switchTheme.php'),
			data:{t:$(this).val()},
			success:function(s){
				document.location.reload(true);
			}
		});
	});
});
