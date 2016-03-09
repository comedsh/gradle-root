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
        function getItemVal(obj,itemName){
            var str=eval('obj.'+itemName);
            return str||'';
        }
        //首先将模板中的转义符号转换为html
        template = template.replace(/&lt;|&gt;/g, function (MatchStr) {
            return MatchStr == "&lt;" ? "<" : MatchStr == "&gt;" ? ">" : "";
        });

        //检查对象
        if (valueObjs) {
            //替换对象
            template = template.replace(/\[\[t:([\w|.]+)\]\]/g, function (regStr, regItem) {
                return getItemVal(valueObjs,regItem);
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
/**********************************************
* start of \buyerusercenter.js
**************************************************/
/*
*买家个人中心js
*/
$(function(){
	var data={
		//删除订单Url
		deleteOrderUrl:'aaa',
		//确认收货Url
		confirmReceivingUrl:'bbb'  ,
		orderId:'',
		orderType:''
	};
	var logic={
		eventBind:function(){
			//点击取消订单按钮显示弹窗
			
			$(".js-cancel-order").on("click",function(){
				data.orderId='';
				data.orderType='';
				data.orderId = $(this).parents('.user-order-container').attr('order-id');
				data.orderType = $(this).parents('.user-order-container').attr('order-Type');
				
				$.get("/cancel/cancelReasonList",function(data,ele){
					
					if(data.success){

						var html = '';

						var oneRowHtml = [];

						var towRowHtml = [];

						var threeRowHtml = [];

						$.each(data.data,function(index,value){


							if(index <= 4){

								oneRowHtml.push($t.using('template')($('#js-template-oneRow').html(),this));

							}else if(5 <= index&&index <= 9){

								towRowHtml.push($t.using('template')($('#js-template-towRow').html(),this));

							}else{

								threeRowHtml.push($t.using('template')($('#js-template-threeRow').html(),this));

							}

						});

						html=$t.using('template')($('#js-template-cancel').html(),{

							one:oneRowHtml.join(''),

							two:towRowHtml.join(''),

							three:threeRowHtml.join('')

						});

						$('.cancel-order-causes ul').remove();

						$(".cancel-order-causes").append(html);		

					}

				});

				$("#js-cancel-pop").fadeIn("show");

				$(".overlayer").fadeIn("show");

			});
			//点击取消按钮隐藏弹框

			$("#js-no-btns").on("click",function(){

				$("#js-cancel-pop").fadeOut("show");

				$(".overlayer").fadeOut("show");

			});

			$(".close-btn").on("click",function(){

				$("#js-cancel-pop").fadeOut("show");

			});
			//点击确定发送取消订单原因
			$('body').delegate('#js-ok-btns','click',function(){
				var radioEle = $(this).parents('#js-cancel-pop').find(':radio');
				var item = $(":radio:checked"); 
				var len=item.length; 
				if(len == 0){ 
				  window.fh_alert('请填写原因'); 
				}else if(len == 1){
					
					$.ajax({
						url:'/cancel/cancelOrder',
						type: 'POST',
						dataType:'json',
						data : {
							cancelReason: $(':radio:checked').val(),
							orderid: data.orderId,
							orderType: data.orderType
						},
						success : function(response){
							location.href=location.href;
						},
						error: function(response){
							window.fh_alert("提交取消订单原因失败，请稍后再试。")
						}
					});
				}
			});
			//确认收货
			$(".js-receiving-btn").on("click",function(){
				data.orderId = '';
				data.orderId = $(this).attr('data-id');
				window.fh_simple_confirm('亲，您确定要确认收货吗？',function(){
					$.ajax({
						url:'/buyerOrder/affirmDelivery',
						type: 'POST',
						dataType:'json',
						data : {
							orderId: data.orderId
						},
						success : function(response){
							if(response.success){
								location.href=location.href;
							}else{
								window.fh_alert(response.errorMessage,function(){
									location.href=location.href;
								});
							}
						},
						error: function(response){
							window.fh_alert("确认收货失败，请稍后再试。",function(){
								location.href=location.href;
							})
						}
					});
				});
			});
			//显示更多商品
			$('.js-showMoreProduct-btn').each(function(){
				$(this).toggle(function(){
					/*alert($(this).attr('_val'));*/
					$(this).parents('.user-order-tb-information').find(".user-order-pro-wrap").each(function(index){
						if(index > 2){
							$(this).parents('.user-order-tb-information').find(".user-order-pro-wrap").eq(index).slideDown();
						}
					});
					$(this).find(".js-icon-down").removeClass("icon-arrow_down");
					$(this).find(".js-icon-down").addClass("icon-arrow_up");
					$(this).find(".js-more-product").css("display","inline-block");
					$(this).find(".js-more-product").css("marginLeft",".5em");
					$(this).css('borderTop','1px solid #91ccf8');
					$(this).find('em').html("收起");
			},function(){
				$(this).parents('.user-order-tb-information').find(".user-order-pro-wrap").each(function(index){
					if(index > 2){
						$(this).parents('.user-order-tb-information').find(".user-order-pro-wrap").eq(index).slideUp();
					}
				});
				$(this).find(".js-icon-down").removeClass("icon-arrow_up");
				$(this).find(".js-icon-down").addClass("icon-arrow_down");
				$(this).css('borderTop','none');
				$(this).find('em').html("更多商品");
			});
			});
			//删除订单
			$('.js-delete-order-btn').click(function(){
				var $this=$(this);
				fh_simple_confirm('亲，您确定要删除该订单吗?',function(){
					var orderId=$this.attr('data-orderid');

					$.ajax({
						url:data.deleteOrderUrl,
						type:'GET',
						dataType:'json',
						data:{
							orderid:orderId
						},
						success:function(response){
							var orderBody=$this.parents('.tbody');
							orderBody.fadeOut(500,function(){
								orderBody.remove();
							});
						},
						error:function(){
							var orderBody=$this.parents('.tbody');
							orderBody.fadeOut(500,function(){
								orderBody.remove();
							});
						}
					});
				});
				return false;
			});
			//延期收货
			$(".js-postpone-order").on("click",function(){
				data.orderId = '';
				data.orderId = $(this).attr('data-id');
				window.fh_simple_confirm('亲，您确定要延期收货吗？',function(){
					$.ajax({
						url:'/buyerOrder/postpone',
						type: 'POST',
						dataType:'json',
						data : {
							orderId: data.orderId
						},
						success : function(response){
							if(response.success){
								location.href=location.href;
							}else {
								window.fh_alert(response.errorMessages);
							}
						},
						error: function(response){
							window.fh_alert("求情失败，请稍后再试。")
						}
					});
				});
			});
		},
		initProductListShow:function(){
        	$('.user-order-tb-information').each(function(){
                var childrenAfterThree=$(this).find('.user-order-pro-wrap:gt(2)');
                var lastChild = $(this).find('.user-order-pro-wrap').last();
                lastChild.css('borderBottom','none');
                if(childrenAfterThree.length){
                    childrenAfterThree.hide();
                }else{
                    $(this).find('.js-showMoreProduct-btn').remove();
                }
        	});
        },
		init:function(){
			logic.eventBind();
			logic.initProductListShow();
		}
	};
	logic.init();
});
/**********************************************
* end of \buyerusercenter.js
**************************************************/