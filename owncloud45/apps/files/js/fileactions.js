var FileActions={
	actions:{},
	defaults:{},
	icons:{},
	currentFile:null,
	register:function(mime,name,permissions,icon,action){
		if(!FileActions.actions[mime]){
			FileActions.actions[mime]={};
		}
		if (!FileActions.actions[mime][name]) {
			FileActions.actions[mime][name] = {};
		}
		FileActions.actions[mime][name]['action'] = action;
		FileActions.actions[mime][name]['permissions'] = permissions;
		FileActions.icons[name]=icon;
	},
	setDefault:function(mime,name){
		FileActions.defaults[mime]=name;
	},
	get:function(mime,type,permissions){
		var actions={};
		if(FileActions.actions.all){
			actions=$.extend( actions, FileActions.actions.all );
		}
		if(mime){
			if(FileActions.actions[mime]){
				actions=$.extend( actions, FileActions.actions[mime] );
			}
			var mimePart=mime.substr(0,mime.indexOf('/'));
			if(FileActions.actions[mimePart]){
				actions=$.extend( actions, FileActions.actions[mimePart] );
			}
		}
		if(type){//type is 'dir' or 'file'
			if(FileActions.actions[type]){
				actions=$.extend( actions, FileActions.actions[type] );
			}
		}
		var filteredActions = {};
		$.each(actions, function(name, action) {
			if (action.permissions & permissions) {
				filteredActions[name] = action.action;
			}
		});
		return filteredActions;
	},
	getDefault:function(mime,type,permissions){
		if(mime){
			var mimePart=mime.substr(0,mime.indexOf('/'));
		}
		var name=false;
		if(mime && FileActions.defaults[mime]){
			name=FileActions.defaults[mime];
		}else if(mime && FileActions.defaults[mimePart]){
			name=FileActions.defaults[mimePart];
		}else if(type && FileActions.defaults[type]){
			name=FileActions.defaults[type];
		}else{
			name=FileActions.defaults.all;
		}
		var actions=this.get(mime,type,permissions);
		return actions[name];
	},
	display:function(parent){
		FileActions.currentFile=parent;
		$('#fileList span.fileactions, #fileList td.date a.action').remove();
		var actions=FileActions.get(FileActions.getCurrentMimeType(),FileActions.getCurrentType(), FileActions.getCurrentPermissions());
		var file=FileActions.getCurrentFile();
		if($('tr').filterAttr('data-file',file).data('renaming')){
			return;
		}
		parent.children('a.name').append('<span class="fileactions" />');
		var defaultAction=FileActions.getDefault(FileActions.getCurrentMimeType(),FileActions.getCurrentType(), FileActions.getCurrentPermissions());
		for(name in actions){
			// NOTE: Temporary fix to prevent rename action in root of Shared directory
			if (name == 'Rename' && $('#dir').val() == '/Shared') {
				continue;
			}
			if((name=='Download' || actions[name]!=defaultAction) && name!='Delete'){
				var img=FileActions.icons[name];
				if(img.call){
					img=img(file);
				}
				var html='<a href="#" class="action" style="display:none">';
				if(img) { html+='<img src="'+img+'"/> '; }
				html += t('files', name) +'</a>';
				var element=$(html);
				element.data('action',name);
				element.click(function(event){
					event.stopPropagation();
					event.preventDefault();
					var action=actions[$(this).data('action')];
					var currentFile=FileActions.getCurrentFile();
					FileActions.hide();
					action(currentFile);
				});
				element.hide();
				parent.find('a.name>span.fileactions').append(element);
			}
		}
		if(actions['Delete']){
			var img=FileActions.icons['Delete'];
			if(img.call){
				img=img(file);
			}
			// NOTE: Temporary fix to allow unsharing of files in root of Shared folder
			if ($('#dir').val() == '/Shared') {
				var html = '<a href="#" original-title="' + t('files', 'Unshare') + '" class="action delete" style="display:none" />';
			} else {
				var html='<a href="#" original-title="' + t('files', 'Delete') + '" class="action delete" style="display:none" />';
			}
			var element=$(html);
			if(img){
				element.append($('<img src="'+img+'"/>'));
			}
			element.data('action','Delete');
			element.click(function(event){
				event.stopPropagation();
				event.preventDefault();
				var action=actions[$(this).data('action')];
				var currentFile=FileActions.getCurrentFile();
				FileActions.hide();
				action(currentFile);
			});
			element.hide();
			parent.parent().children().last().append(element);
		}
		$('#fileList .action').css('-o-transition-property','none');//temporarly disable
		$('#fileList .action').fadeIn(200,function(){
			$('#fileList .action').css('-o-transition-property','opacity');
		});
		return false;
	},
	hide:function(){
		$('#fileList span.fileactions, #fileList td.date a.action').fadeOut(200,function(){
			$(this).remove();
		});
	},
	getCurrentFile:function(){
		return FileActions.currentFile.parent().attr('data-file');
	},
	getCurrentMimeType:function(){
		return FileActions.currentFile.parent().attr('data-mime');
	},
	getCurrentType:function(){
		return FileActions.currentFile.parent().attr('data-type');
	},
	getCurrentPermissions:function() {
		return FileActions.currentFile.parent().data('permissions');
	}
};

$(document).ready(function(){
	if($('#allowZipDownload').val() == 1){
		var downloadScope = 'all';
	} else {
		var downloadScope = 'file';
	}
	FileActions.register(downloadScope,'Download', OC.PERMISSION_READ, function(){return OC.imagePath('core','actions/download');},function(filename){
		if($('#publicTpl').val()==1){
		//&dir=/admin3/files/pdf&path=/IMG_1136.JPG	
		//window.location=OC.filePath('', '', 'public.php')+'?service=files&download' + encodeURIComponent('&path='+'/'+encodeURIComponent(filename)+'&dir='+encodeURIComponent($('#dir').val()));
         window.location=$('#downloadURL').val()+'/'+encodeURIComponent(filename);
		}else{
		window.location=OC.filePath('files', 'ajax', 'download.php') + encodeURIComponent('?files='+encodeURIComponent(filename)+'&dir='+encodeURIComponent($('#dir').val()));
	 }
	});
});

FileActions.register('all','Delete', OC.PERMISSION_DELETE, function(){return OC.imagePath('core','actions/delete');},function(filename){
	if(Files.cancelUpload(filename)) {
		if(filename.substr){
			filename=[filename];
		}
		$.each(filename,function(index,file){
			var filename = $('tr').filterAttr('data-file',file);
			filename.hide();
			filename.find('input[type="checkbox"]').removeAttr('checked');
			filename.removeClass('selected');
		});
		procesSelection();
	}else{
		FileList.do_delete(filename);
	}
	$('.tipsy').remove();
});

FileActions.register('all','Rename', OC.PERMISSION_UPDATE, function(){return OC.imagePath('core','actions/rename');},function(filename){
	FileList.rename(filename);
});

FileActions.register('dir','Open', OC.PERMISSION_READ, '', function(filename){
	window.location=OC.linkTo('files', 'index.php') + '&dir='+encodeURIComponent($('#dir').val()).replace(/%2F/g, '/')+'/'+encodeURIComponent(filename);
});

FileActions.setDefault('dir','Open');