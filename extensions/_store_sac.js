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
			showYoutubeVideo : function(videoid, title){
				var $modal = $('<div id="ytModal"><div class="overlay"></div></div>');
				var $ytContainer = $('<div class="ytContainer"></div>');
				var $btn = $('<button></button>');
				$btn.button({
					icons : {"primary" : "ui-icon-closethick"},
					text : false
					});
				$btn.on('click', function(){$modal.empty().remove();})
				$ytContainer.append($btn);
				$ytContainer.append("<iframe style='z-index:1;' src='https://www.youtube.com/embed/"+videoid+"?autoplay=1&wmode=transparent' frameborder='0' allowfullscreen></iframe>");
				$modal.append($ytContainer);
				
				$('body').append($modal);
				}
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
			assignData : function($tag, data){
				$tag.data(data.bindData.attribute, data.value);
				//app.u.dump($tag.data(data.bindData.attribute));
				},
			showIfShipFree : function($tag, data){
				if($.inArray("IS_SHIPFREE", data.value) >= 0){
					$tag.show();
					}
				},
			youtubeModalLink : function($tag, data){
				app.u.dump(data.value);
				if(data.value['%attribs']['youtube:videoid']){
					$tag.show();
					$tag.on('click',function(){
						app.ext.store_sac.a.showYoutubeVideo(data.value['%attribs']['youtube:videoid'], data.value['%attribs']['zoovy:prod_name']);
						return false;
						});
					}
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
			".motorcycle-apparel" : {
				"base" : {"term" : {"prod_is_general" : "accessory_clothing"}},
				"options" : {}
				},
			".motorcycle-apparel.gloves" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "accessory_clothing"}},{"term" : {"apparel_accessories":"gloves"}}]},
				"options" : {
					"glove_style" : [{"p":"Classic","v":"classic"},{"p":"Dirt","v":"dirt"},{"p":"Sport","v":"sport"},{"p":"Winter","v":"winter"}],
					"primary_color" : [{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-apparel.grips" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "accessory_clothing"}},{"term" : {"apparel_accessories":"grips"}}]},
				"options" : {
					"riding_style" : [{"p":"Cruiser","v":"cruiser"},{"p":"Dirt","v":"dirt"},{"p":"Street","v":"street"}],
					"primary_color" : [{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}],
					"accent_color" : [{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-apparel.luggage" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "accessory_clothing"}},{"term" : {"apparel_accessories":"luggage"}}]},
				"options" : {
					"riding_style" : [{"p":"Cruiser","v":"cruiser"},{"p":"Dirt","v":"dirt"},{"p":"Street","v":"street"}],
					"primary_color" : [{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-apparel.security" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "accessory_clothing"}},{"term" : {"apparel_accessories":"security"}}]},
				"options" : {}
				},
			".motorcycle-apparel.tank-pads" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "accessory_clothing"}},{"term" : {"apparel_accessories":"tank_pads"}}]},
				"options" : {
					"app_brand" : [{"p":"Pro Grip","v":"pro_grip"},{"p":"TechSpec","v":"techspec"}],
					"primary_color" : [{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}],
					"accent_color" : [{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-apparel.tools" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "accessory_clothing"}},{"term" : {"apparel_accessories":"tools"}}]},
				"options" : {}
				},
			".motorcycle-helmets" : {
				"base" : {"term" : {"prod_is_general" : "helmet"}},
				"options" : {
					"helmet_type":[{"p":"Dirt","v":"dirt"},{"p":"Dual Sport","v":"dual_sport"},{"p":"Full Face","v":"full_face"},{"p":"Half Shell","v":"half_shell"},{"p":"Modular","v":"modular"},{"p":"Three Quarter","v":"three_quarter"},{"p":"Helmet Accessories","v":"helmet_accessories"}],
					"app_brand":[{"p":"Airoh","v":"airoh"},{"p":"Answer","v":"answer"},{"p":"Arai","v":"arai"},{"p":"HJC","v":"hjc"},{"p":"Kali","v":"kali"},{"p":"MSR","v":"msr"},{"p":"Shoei","v":"shoei"},{"p":"Skid Lid","v":"skid_lid"},{"p":"Speed and Strength","v":"speed_and_strength"},{"p":"Suomy","v":"suomy"},{"p":"THH","v":"thh"},{"p":"Zox","v":"zox"}],
					"primary_color":[{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-helmets.accessories" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "helmet"}},{"term" : {"helmet_type":"helmet_accessories"}}]},
				"options" : {
					"app_brand":[{"p":"Airoh","v":"airoh"},{"p":"Answer","v":"answer"},{"p":"Arai","v":"arai"},{"p":"HJC","v":"hjc"},{"p":"Kali","v":"kali"},{"p":"MSR","v":"msr"},{"p":"Shoei","v":"shoei"},{"p":"Skid Lid","v":"skid_lid"},{"p":"Speed and Strength","v":"speed_and_strength"},{"p":"Suomy","v":"suomy"},{"p":"THH","v":"thh"},{"p":"Zox","v":"zox"}],
					"primary_color":[{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-helmets.dirt-bike" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "helmet"}},{"term" : {"helmet_type":"dirt"}}]},
				"options" : {
					"app_brand":[{"p":"Airoh","v":"airoh"},{"p":"Answer","v":"answer"},{"p":"Arai","v":"arai"},{"p":"HJC","v":"hjc"},{"p":"Kali","v":"kali"},{"p":"MSR","v":"msr"},{"p":"Shoei","v":"shoei"},{"p":"Skid Lid","v":"skid_lid"},{"p":"Speed and Strength","v":"speed_and_strength"},{"p":"Suomy","v":"suomy"},{"p":"THH","v":"thh"},{"p":"Zox","v":"zox"}],
					"primary_color":[{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-helmets.dual-sport" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "helmet"}},{"term" : {"helmet_type":"dual_sport"}}]},
				"options" : {
					"app_brand":[{"p":"Airoh","v":"airoh"},{"p":"Answer","v":"answer"},{"p":"Arai","v":"arai"},{"p":"HJC","v":"hjc"},{"p":"Kali","v":"kali"},{"p":"MSR","v":"msr"},{"p":"Shoei","v":"shoei"},{"p":"Skid Lid","v":"skid_lid"},{"p":"Speed and Strength","v":"speed_and_strength"},{"p":"Suomy","v":"suomy"},{"p":"THH","v":"thh"},{"p":"Zox","v":"zox"}],
					"primary_color":[{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-helmets.full-face" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "helmet"}},{"term" : {"helmet_type":"full_face"}}]},
				"options" : {
					"app_brand":[{"p":"Airoh","v":"airoh"},{"p":"Answer","v":"answer"},{"p":"Arai","v":"arai"},{"p":"HJC","v":"hjc"},{"p":"Kali","v":"kali"},{"p":"MSR","v":"msr"},{"p":"Shoei","v":"shoei"},{"p":"Skid Lid","v":"skid_lid"},{"p":"Speed and Strength","v":"speed_and_strength"},{"p":"Suomy","v":"suomy"},{"p":"THH","v":"thh"},{"p":"Zox","v":"zox"}],
					"primary_color":[{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-helmets.half_shell" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "helmet"}},{"term" : {"helmet_type":"half_shell"}}]},
				"options" : {
					"app_brand":[{"p":"Airoh","v":"airoh"},{"p":"Answer","v":"answer"},{"p":"Arai","v":"arai"},{"p":"HJC","v":"hjc"},{"p":"Kali","v":"kali"},{"p":"MSR","v":"msr"},{"p":"Shoei","v":"shoei"},{"p":"Skid Lid","v":"skid_lid"},{"p":"Speed and Strength","v":"speed_and_strength"},{"p":"Suomy","v":"suomy"},{"p":"THH","v":"thh"},{"p":"Zox","v":"zox"}],
					"primary_color":[{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-helmets.modular" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "helmet"}},{"term" : {"helmet_type":"modular"}}]},
				"options" : {
					"app_brand":[{"p":"Airoh","v":"airoh"},{"p":"Answer","v":"answer"},{"p":"Arai","v":"arai"},{"p":"HJC","v":"hjc"},{"p":"Kali","v":"kali"},{"p":"MSR","v":"msr"},{"p":"Shoei","v":"shoei"},{"p":"Skid Lid","v":"skid_lid"},{"p":"Speed and Strength","v":"speed_and_strength"},{"p":"Suomy","v":"suomy"},{"p":"THH","v":"thh"},{"p":"Zox","v":"zox"}],
					"primary_color":[{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-helmets.three-quarter" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "helmet"}},{"term" : {"helmet_type":"three_quarter"}}]},
				"options" : {
					"app_brand":[{"p":"Airoh","v":"airoh"},{"p":"Answer","v":"answer"},{"p":"Arai","v":"arai"},{"p":"HJC","v":"hjc"},{"p":"Kali","v":"kali"},{"p":"MSR","v":"msr"},{"p":"Shoei","v":"shoei"},{"p":"Skid Lid","v":"skid_lid"},{"p":"Speed and Strength","v":"speed_and_strength"},{"p":"Suomy","v":"suomy"},{"p":"THH","v":"thh"},{"p":"Zox","v":"zox"}],
					"primary_color":[{"p":"Black","v":"black"},{"p":"Blue","v":"blue"},{"p":"Brown","v":"brown"},{"p":"Green","v":"green"},{"p":"Grey","v":"grey"},{"p":"Orange","v":"orange"},{"p":"Pink","v":"pink"},{"p":"Purple","v":"purple"},{"p":"Red","v":"red"},{"p":"White","v":"white"},{"p":"Yellow","v":"yellow"},{"p":"Multi","v":"multi"}]
					}
				},
			".motorcycle-parts" : {
				"base" : {"term" : {"prod_is_general" : "part"}},
				"options" : {}
				},
			".motorcycle-parts.brakes" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"brakes"}}]},
				"options" : {}
				},
			".motorcycle-parts.body" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"body"}}]},
				"options" : {
					"make":[{"p":"Aprilia","v":"aprilia"},{"p":"BMW","v":"bmw"},{"p":"Buell","v":"buell"},{"p":"Can-Am","v":"can_am"},{"p":"Ducati","v":"ducati"},{"p":"Harley","v":"harley"},{"p":"Honda","v":"honda"},{"p":"Husqvarna","v":"husqvarna"},{"p":"KTM","v":"ktm"},{"p":"KYMCO","v":"kymco"},{"p":"Kawasaki","v":"kawasaki"},{"p":"MV Agusta","v":"mv_agusta"},{"p":"Moto Guzzi","v":"moto_guzzi"},{"p":"Other","v":"other"},{"p":"Scooters","v":"scooters"},{"p":"Triumph","v":"triumph"},{"p":"Vespa","v":"vespa"},{"p":"Victory","v":"victory"},{"p":"Yamaha","v":"yamaha"}]
					}
				},
			".motorcycle-parts.chain" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"chain"}}]},
				"options" : {
					"chain_pitch":[{"p":"420","v":"420"},{"p":"428","v":"428"},{"p":"428H","v":"428h"},{"p":"520","v":"520"},{"p":"520H","v":"520h"},{"p":"525","v":"525"},{"p":"525H","v":"525h"},{"p":"530","v":"530"},{"p":"530H","v":"530h"},{"p":"532","v":"532"},{"p":"630","v":"630"}],
					"chain_type":[{"p":"Standard","v":"standard"},{"p":"Heavy Duty","v":"heavy_duty"},{"p":"O-Ring","v":"o_ring"},{"p":"RX-Ring","v":"rx_ring"},{"p":"UW-Ring","v":"uw_ring"},{"p":"XW-Ring","v":"xw_ring"}],
					"chain_links":[{"p":"64","v":"64"},{"p":"70","v":"70"},{"p":"82","v":"82"},{"p":"84","v":"84"},{"p":"86","v":"86"},{"p":"88","v":"88"},{"p":"90","v":"90"},{"p":"92","v":"92"},{"p":"94","v":"94"},{"p":"96","v":"96"},{"p":"98","v":"98"},{"p":"100","v":"100"},{"p":"102","v":"102"},{"p":"104","v":"104"},{"p":"106","v":"106"},{"p":"108","v":"108"},{"p":"110","v":"110"},{"p":"112","v":"112"},{"p":"114","v":"114"},{"p":"116","v":"116"},{"p":"118","v":"118"},{"p":"120","v":"120"},{"p":"122","v":"122"},{"p":"124","v":"124"},{"p":"126","v":"126"},{"p":"128","v":"128"},{"p":"130","v":"130"},{"p":"132","v":"132"},{"p":"134","v":"134"},{"p":"136","v":"136"},{"p":"138","v":"138"},{"p":"140","v":"140"},{"p":"150","v":"150"},{"p":"160","v":"160"},{"p":"170","v":"170"}],
					"chain_color":[{"p":"Black","v":"black"},{"p":"Gold","v":"gold"}]
					}
				},
			".motorcycle-parts.chain-and-sprocket-kits" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"chain_kits"}}]},
				"options" : {
					"make":[{"p":"Aprilia","v":"aprilia"},{"p":"BMW","v":"bmw"},{"p":"Buell","v":"buell"},{"p":"Can-Am","v":"can_am"},{"p":"Ducati","v":"ducati"},{"p":"Harley","v":"harley"},{"p":"Honda","v":"honda"},{"p":"Husqvarna","v":"husqvarna"},{"p":"KTM","v":"ktm"},{"p":"KYMCO","v":"kymco"},{"p":"Kawasaki","v":"kawasaki"},{"p":"MV Agusta","v":"mv_agusta"},{"p":"Moto Guzzi","v":"moto_guzzi"},{"p":"Other","v":"other"},{"p":"Scooters","v":"scooters"},{"p":"Triumph","v":"triumph"},{"p":"Vespa","v":"vespa"},{"p":"Victory","v":"victory"},{"p":"Yamaha","v":"yamaha"}],
					"chain_kit_gearing":[{"p":"Quick Acceleration","v":"quick_acceleration"},{"p":"Stock","v":"stock"}],
					"chain_kit_rearsprocket":[{"p":"Steel Silver","v":"steelsilver"},{"p":"Aluminium Silver","v":"alumsilver"},{"p":"Aluminium Black","v":"alumblack"}],
					"chain_color":[{"p":"Black","v":"black"},{"p":"Gold","v":"gold"}]
					}
				},
			".motorcycle-parts.controls" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"controls"}}]},
				"options" : {
					"make":[{"p":"Aprilia","v":"aprilia"},{"p":"BMW","v":"bmw"},{"p":"Buell","v":"buell"},{"p":"Can-Am","v":"can_am"},{"p":"Ducati","v":"ducati"},{"p":"Harley","v":"harley"},{"p":"Honda","v":"honda"},{"p":"Husqvarna","v":"husqvarna"},{"p":"KTM","v":"ktm"},{"p":"KYMCO","v":"kymco"},{"p":"Kawasaki","v":"kawasaki"},{"p":"MV Agusta","v":"mv_agusta"},{"p":"Moto Guzzi","v":"moto_guzzi"},{"p":"Other","v":"other"},{"p":"Scooters","v":"scooters"},{"p":"Triumph","v":"triumph"},{"p":"Vespa","v":"vespa"},{"p":"Victory","v":"victory"},{"p":"Yamaha","v":"yamaha"}]
					}
				},
			".motorcycle-parts.electrical" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"electrical"}}]},
				"options" : {}
				},
			".motorcycle-parts.exhaust" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"exhaust"}}]},
				"options" : {
					"make":[{"p":"Aprilia","v":"aprilia"},{"p":"BMW","v":"bmw"},{"p":"Buell","v":"buell"},{"p":"Can-Am","v":"can_am"},{"p":"Ducati","v":"ducati"},{"p":"Harley","v":"harley"},{"p":"Honda","v":"honda"},{"p":"Husqvarna","v":"husqvarna"},{"p":"KTM","v":"ktm"},{"p":"KYMCO","v":"kymco"},{"p":"Kawasaki","v":"kawasaki"},{"p":"MV Agusta","v":"mv_agusta"},{"p":"Moto Guzzi","v":"moto_guzzi"},{"p":"Other","v":"other"},{"p":"Scooters","v":"scooters"},{"p":"Triumph","v":"triumph"},{"p":"Vespa","v":"vespa"},{"p":"Victory","v":"victory"},{"p":"Yamaha","v":"yamaha"}],
					"app_brand":[{"p":"Jardine","v":"jardine"},{"p":"Leo Vince","v":"leo_vince"}],
					"exhaust_type":[{"p":"Full System","v":"full_system"},{"p":"Slip On","v":"slip_on"},{"p":"Accessory","v":"accessory"}],
					"finish":[{"p":"Aluminium","v":"aluminium"},{"p":"Black","v":"black"},{"p":"Carbon","v":"carbon"},{"p":"Stainless","v":"stainless"},{"p":"Titanium","v":"titanium"}]
					}
				},
			".motorcycle-parts.intake" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"intake"}}]},
				"options" : {
					"make":[{"p":"Aprilia","v":"aprilia"},{"p":"BMW","v":"bmw"},{"p":"Buell","v":"buell"},{"p":"Can-Am","v":"can_am"},{"p":"Ducati","v":"ducati"},{"p":"Harley","v":"harley"},{"p":"Honda","v":"honda"},{"p":"Husqvarna","v":"husqvarna"},{"p":"KTM","v":"ktm"},{"p":"KYMCO","v":"kymco"},{"p":"Kawasaki","v":"kawasaki"},{"p":"MV Agusta","v":"mv_agusta"},{"p":"Moto Guzzi","v":"moto_guzzi"},{"p":"Other","v":"other"},{"p":"Scooters","v":"scooters"},{"p":"Triumph","v":"triumph"},{"p":"Vespa","v":"vespa"},{"p":"Victory","v":"victory"},{"p":"Yamaha","v":"yamaha"}]
					}
				},
			".motorcycle-parts.suspension" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"suspension"}}]},
				"options" : {
					"progressive_model":[{"p":"12-13-14 Series","v":"12-13-14_series"},{"p":"412 Series","v":"412_series"},{"p":"416 Series","v":"416_series"},{"p":"425 Series","v":"425_series"},{"p":"430 Series","v":"430_series"},{"p":"444 Series","v":"444_series"},{"p":"465 Series","v":"465_series"},{"p":"944 Series","v":"944_series"},{"p":"970 Series","v":"970_series"},{"p":"Fork Lowering Kits","v":"fork_lowering_kits"},{"p":"Fork Springs","v":"fork_springs"},{"p":"Monotube Fork Kits","v":"monotube_fork_kits"},{"p":"Tools","v":"tools"},{"p":"Touring Links","v":"touring_links"}],
					"burly_model":[{"p":"Lowered Fork Springs","v":"lowered_fork_springs"},{"p":"Lowered Shocks","v":"lowered_shocks"},{"p":"Lowering Block Kits","v":"lowering_block_kits"},{"p":"Lowering Bolt Kits","v":"lowering_bolt_kits"},{"p":"Slammer Kits","v":"slammer_kits"},{"p":"Stiletto Shocks","v":"stiletto_shocks"}],
					"finish":[{"p":"Black","v":"black"},{"p":"Chrome","v":"chrome"}]
					}
				},
			}
		} //r object.
	return r;
	}