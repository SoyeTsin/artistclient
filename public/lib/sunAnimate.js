/*
	By Sunjay-King
*/
(function(window,document,Math){
	var utils = (function () {
		var me	=	{};
		me.text	=	function(v,t){
			document.getElementById(v).innerHTML=t;
		};
		me.x	=	document.body.clientWidth;
		me.y	=	document.body.clientHeight;
		me.hideDialog	=	function(){
			$('.dialog').fadeOut(300);
		};
		return me;
	})();
	//-----------------------------
	function Sunjay(){
		this.showProfile();
		$('.sideNav').css('height',(utils.y-180)+'px');
		$('.contentBox').css('height',(utils.y-100)+'px');
		$('.content').css('height',(utils.y-180)+'px');
		$('.helpCon').css('height',(utils.y-100)+'px');
		$('.sideNav').css('height','400px');
		
		$('.help').css('right',((utils.x-980)/2+20)+'px');
		$('.helpMain').css('right',((utils.x-980)/2+20)+'px');
		$(".content").niceScroll({  
			cursorcolor:"#ccc",  
			cursoropacitymax:1,  
			touchbehavior:false,  
			cursorwidth:"5px",  
			cursorborder:"0",  
			cursorborderradius:"5px"  
		}); 
		$(".helpCon").niceScroll({  
			cursorcolor:"#ccc",  
			cursoropacitymax:1,  
			touchbehavior:false,  
			cursorwidth:"5px",  
			cursorborder:"0",  
			cursorborderradius:"5px"  
		}); 
	}
	//-----------------------------
	Sunjay.prototype = {
        callback:null,
		dialog:function(a,b,c,cb){
			var _this	=	this;
			$('.dialogOne').fadeOut(0);
			$('.dialogTwo').fadeOut(0);
			utils.text('dialogDes','');
			utils.text('dialogOne','');
			utils.text('dialogTwoa','');
			utils.text('dialogTwob','');
            if(!b){
                b="确认";
            }
            if(!c){
                c="";
            }
            if(!cb){
                cb=null;
            }
			
			
			utils.text('dialogDes',a);
			$('.dialog').fadeIn(300);
			if(c==''){
				utils.text('dialogOne',b);
				$('.dialogOne').fadeIn(0);
				this.callback=cb;
				document.getElementById('dialogOne').onclick=function(){
                    if(_this.callback){
                        _this.callback();
                    }
					utils.hideDialog();
				};
			}else{
				$('.dialogTwo').fadeIn(0);
				utils.text('dialogTwoa',b);
				utils.text('dialogTwob',c);
				this.callback=cb;
				document.getElementById('dialogTwoa').onclick=function(){
					utils.hideDialog();
				};
				document.getElementById('dialogTwob').onclick=function(){
                    if(_this.callback){
                        _this.callback();
                    }
					utils.hideDialog();
				};
			}
		},
		showProfile:function(){
			var proNum;
			$('.profile').mouseover(function(){
				$('.navBox').slideDown(100);
				proNum	=	true;
			});
			$('.navBox').mouseover(function(){
				proNum	=	false;
			});
			$('.profile').mouseout(function(){
				setTimeout(function(){
					if(proNum){
						$('.navBox').slideUp(100);
					}
				},300);
				$('.navBox a').mouseout(function(){
					proNum	=	true;
					setTimeout(function(){
						if(proNum){
							$('.navBox').slideUp(100);
						}
					},100);
				});
			});
		},
		showHelp:function(){
			$('.helpConBox').fadeIn(300);
			$('.helpCon').fadeIn(300);
		},
		showHelps:function(){
			$('.helpConBox').fadeIn(300);
			$('.helpCon').fadeIn(300);
		},
		hideHelp:function(){
			$('.helpConBox').fadeOut(300);
			$('.helpCon').fadeOut(300);
		},
		showQr:function(){
			$('.qrbox').fadeIn(300);
		},
		hideQr:function(){
			$('.qrbox').fadeOut(300);
		},
		showEditPass:function(){
			$('.editPass').fadeIn(300);
		},
		hideEditPass:function(){
			$('.editPass').fadeOut(300);
		},
		showEditQust:function(){
			$('.qustEditBox').fadeIn(300);
		},
		hideEditQust:function(){
			$('.qustEditBox').fadeOut(300);
		},
		showVerOne:function(){
			$('.verifyBoxCheck').fadeIn(100);
		},
		hideVerOne:function(){
			$('.verifyBoxCheck').fadeOut(100);
		},
		showVerDone:function(){
			$('.verifyBoxDone').fadeIn(100);
		},
		hideVerDone:function(){
			$('.verifyBoxDone').fadeOut(100);
		},
		showBindno:function(){
			$('.bindNo').fadeIn(100);
		},
		hideBindno:function(cb){
			$('.bindNo').fadeOut(100);
			this.callback=cb;
		},
		showBindCo:function(){
			$('.bindConfirm').fadeIn(100);
		},
		hideBindCo:function(){
			$('.bindConfirm').fadeOut(100);
		},
		showGuide:function(){
			$('.guide').fadeIn(100);
		},
		hideGuide:function(){
			$('.guide').fadeOut(100);
		},
		showSug:function(){
			$('.sug').fadeIn(100);
		},
		hideSug:function(){
			$('.sug').fadeOut(100);
		},
	}
//===============================================================================
Sunjay.utils = utils;
if(typeof module!='undefined'&&module.exports){module.exports = Sunjay;}else{window.Sunjay = Sunjay;}})(window,document,Math)