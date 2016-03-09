/**********************************************
* start of \common\confirm.js
**************************************************/
/**********************************************
*\common\confirm.js
**************************************************/
/*
*弹出框js
*created by yangzhi on 2015.12.10
*/
$(function(){
	$('.cancel-btn,.close-btn').click(function(){
		$('.pop-confirm').fadeOut(200);
		$('.overlayer').fadeOut(200);
		return false;
	});
	window.fh_confirm = function(msg,callback,domClass,isOkHide){
		var panel=domClass?$('.'+domClass):$('.pop-confirm');
		if(msg){
			panel.find('.pop-content').html(msg);
		}
		panel.show();
		$('.overlayer').fadeIn(200);
		$('.ok-btn').unbind();
		panel.find('.ok-btn').click(function(){
			if(typeof callback=='function'){
				callback();
			}
			if(!isOkHide){
				panel.fadeOut(200);
				$('.overlayer').fadeOut(200);
			}
			return false;
		});
	};
});/**********************************************
*\common\confirm.js
**************************************************/

/**********************************************
* end of \common\confirm.js
**************************************************/
$t.define('applyReturn',function($t,deps,$){
	var data = {
		orderId: '',
		productId: [],
		trEle: [],
		choiceVal: '',
		picSrc:[],
		textareaVal: '',
		causeVal: ''
	};
	var logic = {
		eventBind: function(){
			$('body').delegate('.apply-return-list-nums input','change',function(){
				var val = $(this).val();
				val=val.replace(/\D/g,'');
				if(val == ''){
					val = 1;
				}
				$(this).val(val);
			});
			//当输入数量大于库存时
			$('body').delegate('.apply-return-list-nums input','blur',function(){
				var $inventoryNum = parseInt($(this).parent("div").next("span").children("i").text());
				var val = $(this).val();
				console.log('参数' +　$inventoryNum + ' ' + val);
				if(val > $inventoryNum){
					$(this).val($inventoryNum);
				}
			});
			//数量减少
			$('body').delegate('.apply-return-sub-nums','click',function(){
				var num = parseInt($(this).next("input").val());
				if(num > 1){
					num--;
					$(this).next('input').val(num);
				}
				if(num == 1){
					$(this).css('background','#f7f6f4');
				}
			});
			//数量增加
			$('body').delegate('.apply-return-list-add','click',function(){
				var $num=parseInt($(this).prev("input").val());
				var $inventoryNum = parseInt($(this).parent("div").next("span").children("i").text());
				if($num < $inventoryNum){
					$num++;
					$(this).prev('input').val($num);
				}else{
					window.fh_confirm('没有更多的库存',function(){});
				}
				if($num > 0){
					$(this).prev('input').prev('div').css('background','#fff');
				}		
			});
			//删除订单
			$('body').delegate('.apply-return-cancel-btn','click',function(){
				var $cancelOrder = $(this).parent("td").parent("tr");
				if($(".user-order-tr").length > 1){
					window.fh_confirm('你确定要删除该订单吗？',function(){
						$cancelOrder.remove();
						logic.countAjax();
					});	
				}else{
					window.fh_confirm('不能删除',function(){});
				}
			});
			//点击图片
			$('.apply-return-local-pic').hover(function(){
				if($(this).children().length == 2){
					$(this).children("a").css("display","inline-block");
					$(this).addClass("apply-return-current");
					$(this).css('cursor','pointer');
				}
			},function(){
				$(this).children("a").css("display","none");
				$(this).removeClass("apply-return-current");
				$(this).css('cursor','not-allowed');
			});
			//删除图片
			$('body').delegate('.apply-return-fail','click',function(){
				$(this).prev("img").remove();
				$(this).parent('.apply-return-local-pic').removeClass('apply-return-current');
				$(this).hide();
				$('.apply-return-pics').append($(this).parent());
			});
			//选择服务类型
			$('body').delegate('.apply-return-back-btn','click',function(){
				$(this).addClass("apply-return-choice-current");
				$('.apply-return-alteration-btn').removeClass('apply-return-choice-current');
			});
			$('body').delegate('.apply-return-alteration-btn','click',function(){
				$(this).addClass("apply-return-choice-current");
				$('.apply-return-back-btn').removeClass('apply-return-choice-current');
			});
			//选择原因
			$('body').delegate('.js-apply-cause li','click',function(){
				$('.apply-return-select span').text($(this).text());
				$(this).parent('.js-apply-cause').hide();
				$(this).parents('.apply-return-select').attr('value',$(this).attr('value'));
				data.causeVal = $(this).parents('.apply-return-select').attr('value');
				console.log(data.causeVal);
			});
			$('.apply-return-select').hover(function(){
				$(this).children('.js-apply-cause').show();
			},function(){
				$(this).children('.js-apply-cause').hide();
			});
			//计算退款总金额
			$('body').delegate('.apply-count','click',function(){
				logic.countAjax();
			});
			$('body').delegate('.apply-return-list-nums input','change',function(){
				logic.countAjax();
			});
			//提交退货申请
			$('body').delegate('#js-sub-btn','click',function($dataId){
				//订单ID
				data.orderId = [];
				data.productId = [];
				data.trEle = [];
				data.picSrc = [];
				var productEle = [];
				$('.apply-return-box').each(function(index){
					data.orderId = $(this).attr('order-id');
				});
				//商品ID
				$('.user-order-tr').each(function(index){
					var proId = $(this).attr('product-id');
					var inputVal = $(this).find('input').val();
					productEle.push(proId+"@"+inputVal);
				});
				data.trEle=productEle;
				//服务类型
				$('.apply-return-choice-btns').each(function(){
					if($(this).hasClass('apply-return-choice-current')){
						data.choiceVal = $(this).attr('_val')
					}
				});
				//图片地址
				$('.apply-return-local-pic img').each(function(){
					data.picSrc.push($(this).attr('name'));
				});
				//问题描述
				data.textareaVal = $('textarea').val();
				console.log(data.textareaVal)
				//退货原因
				data.causeVal = $('.apply-return-select').attr('value');
				console.log('退货原因'+ ' ' + data.causeVal);
				$.ajax({
					url:'/salesReturn/return',
					type: 'POST',
					dataType:'json',
					data : {
						orderId: data.orderId,
						type: data.choiceVal,
						imgs: data.picSrc,
						prodValues: data.trEle,
						reasonDesc: data.textareaVal,
						reasonCodes: data.causeVal
					},
					success : function(response){
						alert("申请成功，等待卖家审核!");
						location.href="/buyerRefundOrder/list?orderCreateTimeKey=3";
					},
					error: function(response){
						alert("系统繁忙请稍后重试")
					}
				});
			});
			//上传图片
			$("#js-upload-btn").fileupload({
			    url:"/upload/image/",
			    formData:{'module':'order'},
			    done:function(e,data){
			    	var result = data.result;
			    	if(result.success){
			    		if($('.apply-return-pics').find('img').length < 5){
			    			var html = [];
							html.push($t.using('template')($('#js-template-local-pic').html(),result.imgOrginal));
							$('.apply-return-local-pic').each(function(){
								if($(this).children().length != 2){
									$(this).append(html.join(''));
									return flase;
								}
								
							});
			    		}else{
			    			window.fh_confirm('最多只能上传5张图片',function(){});
			    		}
			    	}else{
			    		alert(data.msg);
			    	}
			    }
			});
		},
		countAjax: function(){
			data.orderId = [];
			data.trEle = [];
			var productEle = [];
			$('.apply-return-box').each(function(index){
				data.orderId = $(this).attr('order-id');
			});
			$('.user-order-tr').each(function(index){
				var proId = $(this).attr('product-id');
				var inputVal = $(this).find('input').val();
				productEle.push(proId+"@"+inputVal);
			});
			data.trEle=productEle;
			console.log(data.orderId + '  ' + data.trEle);
			$.ajax({
					url:'/salesReturn/countPrice',
					type: 'POST',
					dataType:'json',
					data : {
						orderId: data.orderId,
						prodValues: data.trEle,
					},
					success : function(response){
						if (response != null) {
							var html = [];
							var $this = this;
							html.push($t.using('template')($('#js-template-count-nums').html(),response));
							$('.count-nums').html('');
	                        $('.count-nums').append(html.join(''));
						}else{
							alert('当前无此项商品')
						}
					},
					error: function(response){
						alert("系统繁忙请稍后重试")
					}
				});
		},
		init: function(){
			logic.eventBind();
			logic.countAjax();
		}
	};
	logic.init();
	return {
		initialApply: function(){
			//初始化退货原因			
			$.ajax({
				url:'/salesReturn/reasonCodes',
				type:'get',
				dataType:'json',
				success:function(response){
					if(response != null){
						var html = [];
						$.each(response.data,function(){
							html.push($t.using('template')($('#js-template-cause-module').html(),this));
						});
						$('.js-cause').remove();
						$('.js-apply-cause').append(html.join(''));
					}else{
						alert('当前数据加载失败');
					}
				},
				error:function(){
					alert('退货原因加载失败')
				}
			});
		}
	}
});
$t.using('applyReturn').initialApply(function(){});
/**********************************************
* start of \module\util.template.js
**************************************************/
/**********************************************
*\module\util.template.js
**************************************************/
/*
* js模板方法
* template: 需要格式化的模板: <div>用户:[[t:name]], 年龄:[[t:age]]</div>, 格式化模板格式: [[t:对象属性]]
* valueObjs: 模板对应的值的对象 {name: "Troy", age: 18} 对象的属性名需要和模板中的一致,否则将无法替换
*/
$t.define("template", function ($t, deps, $) {
    return function (template, valueObjs) {
        //首先将模板中的转义符号转换为html
        template = template.replace(/&lt;|&gt;/g, function (MatchStr) {
            return MatchStr == "&lt;" ? "<" : MatchStr == "&gt;" ? ">" : "";
        });

        //检查对象
        if (valueObjs) {
            //替换对象
            template = template.replace(/\[\[t:(\w+)\]\]/g, function (regStr, regItem) {
                return (valueObjs[regItem]===null||valueObjs[regItem]===undefined)?'':valueObjs[regItem]
            });

        }
        return template;
    };
});/**********************************************
*\module\util.template.js
**************************************************/

/**********************************************
* end of \module\util.template.js
**************************************************/