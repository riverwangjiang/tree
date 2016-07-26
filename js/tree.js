var treeObj={
		init : function(json){//初始化树
			var html=[];
		    for(var i in json){
		        var $li = $('<li></li>');
		        var $ul = $('<ul class="hide file"></ul>');
		        if(json[i].children){
		        $li.append('<p class="files-title"><i class="icon-angle-right"></i></p><i class="icon-folder-close"></i><span>'+json[i].title+'</span>');
		        $li.addClass('files');
		        $ul.append(this.init(json[i].children));
		        $li.append($ul);
		   
		        }else{
		          $li.append('<i class="icon-folder-close"></i><span>'+json[i].title+'</span>');  
		       
		        } 
		        html.push($li);
		    }
		    return html;
		},
		createTree : function (rootId,data) {
			rootId.html(this.init(data));
			this._on(rootId);
			toolBar._on();
			console.log('test');
		},
		openAll : function() {//全部展开
			treeNode.open($('.icon-angle-right').parent('p').parent('li'));
		},
		closeAll : function(){//全部关闭
			treeNode.close($('.icon-angle-down').parent('p').parent('li'));
		},
		_on : function(rootId){//树事件绑定
			rootId.on('click', 'span', function(event) {
				if (!(treeNode.currentNode==null)) {
					$(treeNode.currentNode).children('span').removeClass('height-light');
				}
				treeNode.currentNode = treeNode.getCurrentNode(event.currentTarget);
				treeNode.heightLight(treeNode.currentNode);
            	toolBar.enable($('#add'));
            	toolBar.enable($('#addChild'));
            	toolBar.enable($('#copy'));
            	toolBar.enable($('#cut'));
            	toolBar.enable($('#delete'));
            	toolBar.enable($('#up'));
            	treeNode.move(treeNode.currentNode);
            	if (!(pasteBar.copyNode=='')) {
            	    	toolBar.enable($('#paste,#pasteChild'));
            	    }    
			});
			rootId.on('click', '.icon-angle-right', function(event) {
				if (!(treeNode.currentNode==null)) {
					$(treeNode.currentNode).children('span').removeClass('height-light');
				}
				treeNode.currentNode = treeNode.getCurrentNode($(event.currentTarget).parent('p'));
				treeNode.heightLight(treeNode.currentNode);
				treeNode.open(treeNode.currentNode);
				treeNode.move(treeNode.currentNode);
			});
			rootId.on('click', '.icon-angle-down', function(event) {
				if (!(treeNode.currentNode==null)) {
					$(treeNode.currentNode).children('span').removeClass('height-light');
				}
				treeNode.currentNode = treeNode.getCurrentNode($(event.currentTarget).parent('p'));
				treeNode.heightLight(treeNode.currentNode);
				treeNode.close(treeNode.currentNode);
				treeNode.move(treeNode.currentNode);
			});
		}
	}
var	treeNode={
			currentNode : null,
			getCurrentNode : function(target){//获取选中节点
					return $(target).parent('li');
			},
			open : function(node){//打开节点
				$(node).children('p').children('.icon-angle-right').attr('class', 'icon-angle-down');
	    		$(node).children('.icon-folder-close').attr('class', 'icon-folder-open');
	    		$(node).children('.file').slideDown('500');
	    		toolBar.enable($('#close'));
			},
			close : function(node){//关闭节点
				$(node).children('p').children('.icon-angle-down').attr('class', 'icon-angle-right');
	    		$(node).children('.icon-folder-open').attr('class', 'icon-folder-close');
	    		$(node).children('.file').slideUp('500');
	    		toolBar.enable($('#open'));
			},
			heightLight : function(node){//高亮选中节点
				$(node).children('span').addClass('height-light');
			},
			add : function(node) {//给选中节点添加同级节点
				$(node).parent().append('<li class="new"><i class="icon-folder-close"></i><span >'+$('#input').val()+'</span></li>');
				this.heightLight($(node).parent().find('.new'));
				treeNode.currentNode = $(node).parent().find('.new');
			},
			addChild : function(node){//给选中节点添加子节点
				if($(node).hasClass('files')){
					$(node).children('ul').append('<li class="new"><i class="icon-folder-close"></i><span >'+$('#input').val()+'</span></li>');
					console.log(1);
				}else{
					$(node).addClass('files');
					$(node).prepend('<p class="files-title"><i class="icon-angle-right "></i></p>');
					$(node).append('<ul class="hide file" ><li class="new"><i class="icon-folder-close"></i><span >'+$('#input').val() +'</span></li></ul>');
					console.log(2);
				}
				this.open(node);
				this.heightLight($(node).find('.new'));
				treeNode.currentNode = $(node).find('.new');
			},
			del : function(node){//删除选中节点
				$(node).remove();
				toolBar.disable($('#add'));
				toolBar.disable($('#addChild'));
				toolBar.disable($('#cut'));
				toolBar.disable($('#copy'));
				toolBar.disable($('#up'));
				toolBar.disable($('#down'));
				toolBar.disable($('#delete'));
				toolBar.disable($('#paste'));
				toolBar.disable($('#pasteChild'));
			},
			parentNode : function() {//获取选中节点的父级数组
				var childrenNode  = $('li');
				var parentNode = [];
				var l = 0;
				childrenNode.each(function (index) {
					if ($(this).children('span').hasClass('height-light')) {
						l = $(this).parents('ul').length;
						if(l>1){
							childrenNode.each(function() {
								if ($(this).parents('ul').length===(l-1)) {
								parentNode.push(this);
								}
							});
						}else{
							parentNode.push($('#tree'));
						}
					}		
				});
				return parentNode;

			},
			move : function(node) {//判断选中节点是否可以移动
				var m = 0;
				var c = 0;
				var parentsNode = $(node).parents('ul');
				var l =parentsNode.length;
				if ($(node).prev().is('li')) {
					toolBar.enable($('.up'));
				}else{
					toolBar.disable($('.up'));
					for (var i = 0; i < l; i++) {
						if($(parentsNode[i]).parent().prev().is('li')){
							m = i;
							c = $(parentsNode[i]).parent().prev().children('li').last()
							.find('ul').length;
							if (Math.abs(m-c)<=1) {
								toolBar.enable($('.up'));
							}else{
								toolBar.disable($('.up'));
							}
							break;
						}
					}
				}
				if ($(node).next().is('li')) {
					toolBar.enable($('.down'));
				}else{
					toolBar.disable($('.down'));
					for (var j = 0; j < l; j++) {
						if($(parentsNode[j]).parent().next().is('li')){
							m = j;
							c = $(parentsNode[j]).parent().next().first().children('li').first()
							.find('ul').length;
							if (Math.abs(m-c)<=1) {
								toolBar.enable($('.down'));
							}else{
								toolBar.disable($('.down'));
							}
							break;
						}
					}
				}			
			},
			up : function(parentNode){//上移选中节点
				for( var x = 0;x<parentNode.length;x++) {
					if ($(parentNode[x]).find('span').hasClass('height-light')) {
						if ($(parentNode[x]).children().is('ul')) {
							var childrenNode = $(parentNode[x]).children('ul').children('li');
						}else{
							var childrenNode = $(parentNode[x]).children('li');
						}
				 		childrenNode.each(function(index) {
				 			var $this = $(this);
				 			if($this.children('span').hasClass('height-light')){
				 				treeNode.move($this);
				 				if (x===1&&($(parentNode[x-1]).find('li').length===0)&&index<=1) {
									toolBar.disable($('.up'));
								}
								if (index>0) {
									$this.insertBefore(childrenNode[index-1]);
								}else{	
									if (x>0) {
										if(!$(parentNode[x-1]).children().is('ul')){
											$(parentNode[x-1]).addClass('files').prepend('<p class="files-title"><i class="icon-angle-right "></i></p>').append('<ul class="hide file" ></ul>');	
										}
										$this.appendTo($(parentNode[x-1]).children('ul'));
										treeNode.open(parentNode[x-1]);
										treeNode.open($(parentNode[x-1]).parents('li'));
									}
									
									if (!$(parentNode[x]).children().children().is('li')) {
										treeNode.close(parentNode[x]);
										$(parentNode[x]).removeClass('files').children('ul').remove();
										$(parentNode[x]).children('p').remove();
									}
									
								}
								if (x===0&&index<=1) {
									toolBar.disable($('.up'));
								}
				 			}
				 		});
				 		toolBar.enable($('.down'));
				 		return false;
					}
				}
			},
			down : function(parentNode) {//下移选中节点
				for( var x = 0;x<parentNode.length;x++) {
					if ($(parentNode[x]).find('span').hasClass('height-light')) {
					 	if ($(parentNode[x]).children().is('ul')) {
							var childrenNode = $(parentNode[x]).children('ul').children('li')
						}else{
							var childrenNode = $(parentNode[x]).children('li');
						}
				 		childrenNode.each(function(index) {
				 			var $this = $(this);
				 			if($this.children('span').hasClass('height-light')){
				 				treeNode.move($this);	
				 				if (x===(parentNode.length-2)&&($(parentNode[x+1]).find('li').length===0)&&index==(childrenNode.length-1)) {
									toolBar.disable($('.down'));
								}		
								if (index<(childrenNode.length-1)) {
									$this.insertAfter(childrenNode[index+1]);
								}else{	
									if (x<(parentNode.length-1)) {
										if(!$(parentNode[x+1]).children().is('ul')){
											$(parentNode[x+1]).addClass('files').prepend('<p class="files-title"><i class="icon-angle-right "></i></p>').append('<ul class="hide file" ></ul>');	
										}
										$this.prependTo($(parentNode[x+1]).children('ul'));
										treeNode.open(parentNode[x+1]);
										treeNode.open($(parentNode[x+1]).parents('li'));
									}
									if (!$(parentNode[x]).children().children().is('li')) {
										treeNode.close(parentNode[x]);
										$(parentNode[x]).removeClass('files').children('ul').remove();
										$(parentNode[x]).children('p').remove();
									}
								}
								if (x===(parentNode.length-1)&&index>=(childrenNode.length-2)) {
									toolBar.disable($('.down'));
								}
								
				 			}
				 		});

				 		this.enable($('.up'));
				 		return false;
					}

				}
			}		
	}
var	toolBar={
			flag : false,
			add : treeNode.add,
			addChild : treeNode.addChild,
			del : treeNode.del,
			up : treeNode.up,
			down : treeNode.down,
			enable : function(btn){//启用按钮
				$(btn).removeAttr('disabled');
			},
			disable : function(btn){//禁用按钮
				$(btn).attr('disabled', 'true');
			},
			fade : function() {//显示输入框
					 $('#addDiv').fadeIn("slow");
		             $('#input').focus();
			},
			_on : function(){//工具栏的事件绑定
				var tool=$('#tool');
				tool.on('click', '#add', function(event) {
					toolBar.fade();
					toolBar.flag = true;
				});
				tool.on('click', '#addChild', function(event) {
					toolBar.fade();
					toolBar.flag = false;
				});
				tool.on('click', '#delete', function(event) {
					toolBar.del(treeNode.currentNode);
				});
				tool.on('click', '#up', function(event) {
					toolBar.up(treeNode.parentNode());
				});
				tool.on('click', '#down', function(event) {
					toolBar.down(treeNode.parentNode());
				});
				tool.on('click', '#copy', function(event) {
					pasteBar.copy(treeNode.currentNode);
				});
				tool.on('click', '#cut', function(event) {
					pasteBar.cut(treeNode.currentNode);
				});
				tool.on('click', '#paste', function(event) {
					pasteBar.paste(treeNode.currentNode);
				});
				tool.on('click', '#pasteChild', function(event) {
					pasteBar.pasteChild(treeNode.currentNode);
				});
				tool.on('click', '#open', function(event) {
					treeObj.openAll();
					toolBar.disable(event.currentTarget);
				});
				tool.on('click', '#close', function(event) {
					treeObj.closeAll();
					toolBar.disable(event.currentTarget);
				});
				tool.on('click', '#true', function(event) {
					if ($('li').hasClass('new')) {
						$('li').removeClass('new');
						console.log('test');
						}
					$(treeNode.currentNode).children('span').removeClass('height-light');
					if (toolBar.flag) {
						treeNode.add(treeNode.currentNode);
					}else{
						treeNode.addChild(treeNode.currentNode);
					}
					$('#input').val('');
					$('#addDiv').fadeOut("fast");
					toolBar.disable($('#true'));
				});
				tool.on('keyup', '#input', function(event) {
					if ($(this).val()!='') {
						toolBar.enable($('#true'));
					}else{
						toolBar.disable($('#true'));
					}
				});
			}
	}
var	pasteBar={
		copyNode: '',
		copy : function(node) {//复制选中节点
			pasteBar.copyNode ='<li>'+$(node).html()+'</li>';
			toolBar.enable($('#paste,#pasteChild'));
		},
		cut : function(node) {//剪切选中节点
			this.copy(node);
			toolBar.del(node);
		},
		paste : function(node) {//把复制的节点粘贴在选中节点的同级
			$(node).parent().append(pasteBar.copyNode);
			$(node).children('span').removeClass('height-light');
			treeNode.currentNode = treeNode.getCurrentNode($('.height-light'));
			pasteBar.reset();
		},
		pasteChild : function(node) {//把复制的节点粘贴到选中节点的子级
			if($(node).hasClass('files')){
				$(node).children('ul').append(pasteBar.copyNode);
			}else{
				$(node).addClass('files');
				$(node).prepend('<p class="files-title"><i class="icon-angle-right "></i></p>');
				$(node).append('<ul class="hide file" >'+pasteBar.copyNode+'</ul>');	
			}
			treeNode.open(node);
			$(node).children('span').removeClass('height-light');
			treeNode.currentNode = treeNode.getCurrentNode($('.height-light'));
			pasteBar.reset();
		},
		reset : function(){//重置粘贴板
			pasteBar.copyNode='';
			toolBar.disable($('#paste,#pasteChild'));
		}
	}

