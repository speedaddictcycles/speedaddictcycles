/* **************************************************************

   Copyright 2013 Zoovy, Inc.

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

     http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

************************************************************** */


var store_sac = function() {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
		init : {
			onSuccess : function()	{
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				
				app.rq.push(['script',0,'carouFredSel-6.2.1/jquery.carouFredSel-6.2.1-packed.js']);
				app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj){
					var $slideshow = $('#homepageSlideshow');
					if($slideshow.hasClass('slideshowRendered')){
						//already rendered, do nothing.
						}
					else {
						$slideshow.addClass('slideshowRendered').cycle({
							"slides" : "> a",
							"timeout" : "5000",
							"pager" : "> .pager",
							"pagerTemplate" : "<span class='pointer pagerSpan'><img src='{{children.0.src}}' alt='{{slideNum}}' height='60'/></span>"
							});
						}
					}]);
				app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj){
					var $context = $(app.u.jqSelector('#',infoObj.parentID));
					var $carousel = $('[data-sac=carousel]',$context);
					if($carousel.hasClass('carouselRendered')){
						//already rendered
						}
					else {
						$carousel.addClass('carouselRendered')
						setTimeout(function(){
							$carousel.carouFredSel({
								"responsive":true,
								"width":200,
								"height":"auto",
								"auto" : { "play" : false },
								"items" : { "visible" : 3},
								"prev" : { "button" : $('#homepageFeaturesCarouselPrev') },
								"next" : { "button" : $('#homepageFeaturesCarouselNext') }
								},{"debug" : true});
							},1000);
						}
					
					}]);
				
				$('body').on('click','a[data-onClick], area[data-onClick]', function(e){
					switch($(this).attr('data-onClick')){
						case 'appLink':
							app.u.dump($(this).attr('href'));
							var infoObj = app.ext.myRIA.u.detectRelevantInfoToPage($(this).attr('href'));
							app.u.dump(infoObj);
							showContent('',infoObj);
							break;
						}
					e.preventDefault();
					});
				
				r = true;

				return r;
				},
			onError : function()	{
				app.u.dump('BEGIN store_sac.callbacks.init.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		a : {

			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		renderFormats : {
			prodChildOption: function($tag, data){
				$tag.val(data.value.pid);
				if(data.value['%attribs']['amz:grp_varvalue']){
					$tag.text(data.value['%attribs']['amz:grp_varvalue']);
					}
				else{
					$tag.text(data.value['%attribs']['zoovy:prod_name']);
					}
				}
			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		u : {
			makeBanner : function(bannerJSON, w, h, b){
				var $img = $(app.u.makeImage({
					tag : true,
					w : w,
					h : h,
					b : b,
					name : bannerJSON.src,
					alt : bannerJSON.alt,
					title : bannerJSON.title
					}));
				if(bannerJSON.prodLink){
					$img.addClass('pointer').data('pid', bannerJSON.prodLink).click(function(){
						showContent('product',{'pid':$(this).data('pid')});
						});
					}
				else if(bannerJSON.catLink){
					$img.addClass('pointer').data('navcat', bannerJSON.catLink).click(function(){
						showContent('category',{'navcat':$(this).data('navcat')});
						});
					}
				else if(bannerJSON.searchLink){
					$img.addClass('pointer').data('elasticsearch', bannerJSON.searchLink).click(function(){
						app.u.dump($(this).data('elasticsearch'));
						showContent('search',$(this).data('elasticsearch'));
						});
					}
				else {
					//just a banner!
					}
				return $img;
				},
				
			addItemToCart : function($form,obj){
				var $childSelect = $('.prodChildren.active select', $form);
				if($childSelect.length > 0){
					if($childSelect.val()){
						app.calls.cartItemAppend.init({"sku":$childSelect.val(), "qty":$('input[name=qty]',$form).val()},{},'immutable');
						app.model.destroy('cartDetail');
						app.calls.cartDetail.init({'callback':function(rd){
							if(obj.action === "modal"){
								showContent('cart',obj);
								}
							}},'immutable');
						app.model.dispatchThis('immutable');
						}
					else {
						$form.anymessage(app.u.errMsgObject("You must select an option"));
						}
					}
				else {
					app.ext.myRIA.u.addItemToCart($form, obj);
					}
				}
			}, //u [utilities]

		e : {
			} //e [app Events]
		} //r object.
	return r;
	}