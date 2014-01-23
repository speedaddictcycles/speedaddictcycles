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

	vars : {},
	
////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	


	callbacks : {
		init : {
			onSuccess : function()	{
				
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				app.ext.store_sac.u.loadBanners();
				app.ext.store_sac.u.initDropDowns();
				app.rq.push(['script',0,'carouFredSel-6.2.1/jquery.carouFredSel-6.2.1-packed.js']);
				
				app.rq.push(['templateFunction','homepageTemplate','onCompletes',function(infoObj){
					app.ext.store_sac.u.startHomepageSlideshow();
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
								},{"debug" : false});
							},1000);
						}
					
					}]);
				
				app.rq.push(['templateFunction','categoryTemplateFilteredSearch','onCompletes',function(infoObj){
					app.ext.store_sac.u.initFilteredSearch(infoObj);
					}]);
				app.rq.push(['templateFunction','categoryTemplateFilteredSearch','onDeparts',function(infoObj){
					app.ext.store_sac.u.destroyFilteredSearch(infoObj);
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
			filterCheckboxList : function($tag,data){
				var options = false;
				if(data.bindData.index){
					options = data.value[data.bindData.index];
					}
				
				if(options){
					$tag.attr('data-filter-index', data.bindData.index);
					$tag.attr('data-filter-type','checkboxList');
					for(var i in options){
						var o = options[i];
						var $o = $('<div></div>');
						$o.append('<input type="checkbox" name="'+o.v+'"/>');
						$o.append('<label>'+o.p+'</label>');
						$tag.append($o);
						}
					}
				else {
					$tag.remove();
					}
				},
			// filterSelect : function($tag,data){
				// app.u.dump(data.value);
				// if(data.value){
					// data.bindData.defaultText = data.bindData.defaultText || 'Select a filter';
					// $tag.append('<option value="">'+data.bindData.defaultText+'</option>');
					// for(var i in data.value){
						// var o = data.value[i];
						// $tag.append('<option value="'+o.v+'">'+o.p+'</option>');
					// }
				// } else {
					// $tag.remove();
				// }
			// },
			assignData : function($tag, data){
				$tag.data(data.bindData.attribute, data.value);
				//app.u.dump($tag.data(data.bindData.attribute));
				},
			prodChildOption: function($tag, data){
				$tag.val(data.value.pid);
				if(data.value['%attribs']['amz:grp_varvalue']){
					$tag.text(data.value['%attribs']['amz:grp_varvalue']);
					}
				else{
					$tag.text(data.value['%attribs']['zoovy:prod_name']);
					}
				},
			imajize360 : function($tag, data){
				var src = "http://embed.imajize.com/"+data.value;
				$tag.attr('src',src);
				},
			imageSrcset : function($tag, data){
				//app.u.dump(data.bindData.dims);
				//app.u.dump(data.bindData.dims.split(" "));
				var dims = data.bindData.dims.split(" ");
				var srcset = "";
				for(var i = 0; i < dims.length; i++){
					var da = dims[i].split("|");
					
					var param = da[0];
					var w = da[1];
					var h = da[2];
					
					var src = app.u.makeImage($.extend({},data.bindData,{
						"name" : data.value,
						"w" : w,
						"h" : h,
						"b" : data.bindData.bgColor || "ffffff"
						}));
					if(i==0){
						$tag.attr('src',src);
						}
					srcset += src;
					if(i!=dims.length-1){
						srcset += " "+param+",";
						}
					}
				$tag.attr('srcset', srcset);
				}
			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		u : {
			initDropDowns : function(){
				$('[data-sac="dropdown"]').on('mouseenter.dropdown', function(){
					$('[data-sac="dropdownContent"]', $(this)).addClass('showDropDown');
				});
				$('[data-sac="dropdown"]').on('mouseleave.dropdown', function(){
					$('[data-sac="dropdownContent"]', $(this)).removeClass('showDropDown');
				});
			},
			startHomepageSlideshow : function(attempts){
				attempts = attempts || 0;
				if(app.ext.store_sac.vars.bannerJSON){
					var $slideshow = $('#homepageSlideshow');
					if($slideshow.hasClass('slideshowRendered')){
						//already rendered, do nothing.
						}
					else {
						for(var i=0; i < app.ext.store_sac.vars.bannerJSON.slides.length; i++){
							var $banner = app.ext.store_sac.u.makeBanner(app.ext.store_sac.vars.bannerJSON.slides[i], app.ext.store_sac.vars.bannerJSON.dims, "000000");
							$slideshow.append($banner);
							}
						$slideshow.append($(app.ext.store_sac.vars.bannerJSON.pagerHTML));
						cycleOptions = app.ext.store_sac.vars.bannerJSON.cycleOptions;
						cycleOptions.log = false;
						$slideshow.addClass('slideshowRendered').cycle(cycleOptions);
						}
					}
				else {
					setTimeout(function(){app.ext.store_sac.u.startHomepageSlideshow();}, 250);
					}
				},
			loadBanners : function(){
				app.u.dump("loadbanners");
				$.getJSON("_banners.json?_v="+(new Date()).getTime(), function(json){
					app.ext.store_sac.vars.bannerJSON = json;
					}).fail(function(a,b,c){
						app.ext.store_sac.vars.bannerJSON = {};
						app.u.dump("BANNERS FAILED TO LOAD");
						});
				},
			makeBanner : function(bannerJSON, dims, b){
				var $banner = $('<a></a>');
				
				var $img = $('<img />');
				var srcset = "";
				for(var i=0; i < dims.length; i++){
					var src = app.u.makeImage({
						w : dims[i].w,
						h : dims[i].h,
						b : b,
						name : bannerJSON.src,
						alt : bannerJSON.alt,
						title : bannerJSON.title
						});
					if(i==0){
						$img.attr('src',src);
						}
					
					srcset += src;
					if(i!= dims.length-1){
						srcset +=" "+dims[i].param+",";
						}
					}
				$img.attr('srcset', srcset);
				$banner.append($img);
				
				if(bannerJSON.prodLink){
					$banner.attr("data-onClick", "appLink").attr("href","#!product?pid="+bannerJSON.prodLink);
					}
				else if(bannerJSON.catLink){
					$banner.attr("data-onClick", "appLink").attr("href","#!category?navcat="+bannerJSON.catLink);
					}
				else if(bannerJSON.searchLink){
					$banner.attr("data-onClick", "appLink").attr("href","#!search?KEYWORDS="+bannerJSON.searchLink);
					}
				else {
					//just a banner!
					}
				return $banner;
				},
			initFilteredSearch : function(infoObj){
				var $fc = $('#filterContainer');
				var $fl = $('#filterList', $fc);
				var timer = $fc.data('filter-list-clear-timer');
				if(timer){
					clearTimeout(timer);
					$fl.removeData().empty();
					$fc.removeData('filter-list-clear-timer');
				}
				
				$fl.data('jqContext',$(app.u.jqSelector('#',infoObj.parentID)));
				$fl.data('navcat',infoObj.navcat);
				$fl.data('filters',app.ext.store_sac.filters[infoObj.navcat]);
				
				$fl.anycontent({'data':app.ext.store_sac.filters[infoObj.navcat], 'templateID':'filterListTemplate'});
				$('button', $fl).button();
				$fc.addClass('active');
				app.ext.store_sac.u.sendFilteredSearch();
				//TODO
				//$fc.addClass('expand');
				},
			sendFilteredSearch : function(){
				var $context = $('#filterList').data('jqContext');
				var elasticsearch = {
					"filter" : {
						"and" : []
						}
					}
				app.u.dump($('#filterList [data-sac=filterBase]').length);
				app.u.dump($('#filterList [data-sac=filterBase]').data('filter-base'));
				elasticsearch.filter.and.push($('#filterList [data-sac=filterBase]').data('filter-base'));
				
				$('#filterList [data-filter-type=checkboxList]').each(function(){
					var index = $(this).attr('data-filter-index');
					var filter = {"or" : []};
					$('input', $(this)).each(function(){
						if($(this).is(":checked")){
							var f = {"term" : {}};
							f.term[index] = $(this).attr('name');
							filter.or.push(f);
							}
						});
					if(filter.or.length > 0){
						elasticsearch.filter.and.push(filter);
						}
					});
				
				$('#filterList [data-filter-type=hasAttribute]').each(function(){
					if($(this).is(":checked")){
						elasticsearch.filter.and.push({
							"not" : {
								"missing" : {
									"field" : $(this).attr('data-filter-index')
									}
								}
							});
						}
					});
				
				app.u.dump(elasticsearch);
				var es = app.ext.store_search.u.buildElasticRaw(elasticsearch);
				es.size = 60;
				app.ext.store_search.u.updateDataOnListElement($('[data-sac=output]', $context),es,1);
				app.ext.store_search.calls.appPublicSearch.init(es, {'callback':'handleElasticResults', 'datapointer':'appFilteredSearch','extension':'store_search','templateID':'productListTemplateResults','list':$('[data-sac=output]', $context)});
				app.model.dispatchThis();
				
				//app.u.dump(es);
				},
			destroyFilteredSearch : function(infoObj){
				var $fc = $('#filterContainer');
				$fc.removeClass('expand').removeClass('active');
				
				var timer = setTimeout(function(){
					$('#filterList', $fc).removeData().empty();
					$fc.removeData('filter-list-clear-timer');
				}, 750);
				
				$fc.data('filter-list-clear-timer', timer);
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
			}, //e [app Events]
			
		// A map of navcats to objects containing their base filters and available filters for filtered search.  
		// It can be assumed that if a navcat is used as a key here, (ie typeof app.ext.store_sac.filters[navcat] !== "undefined") 
		// then the app should use the filtered search template for it
		filters : {
			".motorcycle-helmets" : {
				"base" : {
					"term" : {
							"helmet_type" : "full_face"
						}
					},
				"options" : {
					"videoid" : 1,
					"primary_color" : [
							{
								"p" : "Black",
								"v" : "black"
							},
							{
								"p" : "Blue",
								"v" : "blue"
							},
							{
								"p" : "Brown",
								"v" : "brown"
							}
						],
					"accent_color" : [
							{
								"p" : "Black",
								"v" : "black"
							},
							{
								"p" : "Blue",
								"v" : "blue"
							},
							{
								"p" : "Brown",
								"v" : "brown"
							}
						]
					}
				}
			}
		} //r object.
	return r;
	}