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


var store_sac = function(_app) {
	var theseTemplates = new Array('');
	var r = {

	vars : {},
	
////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
	


	callbacks : {
		init : {
			onSuccess : function()	{
				
				var r = false; //return false if extension won't load for some reason (account config, dependencies, etc).
				_app.ext.store_sac.u.loadBanners();
				_app.rq.push(['script',0,'carouFredSel-6.2.1/jquery.carouFredSel-6.2.1-packed.js']);
				
				
				
				
				r = true;

				return r;
				},
			onError : function()	{
				_app.u.dump('BEGIN store_sac.callbacks.init.onError');
				}
			},
			
		attachEventHandlers : {
			onSuccess : function(){
				dump('attaching custom handlers');
				_app.templates.homepageTemplate.on('complete.sac',function(event, $context, infoObj){
					_app.ext.store_sac.u.startHomepageSlideshow();
					
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
					});
					
				var filterComplete = function(event, $context, infoObj){
					var $fc = $('#filterContainer');
					$('form', $fc).data('loadFullList', infoObj.loadFullList).trigger('submit');
					$fc.addClass('active expand');
					var timer = setTimeout(function(){
						$fc.removeClass('expand');
						}, 4000);
					$fc.data('hidetimer', timer);
					$fc.on('mouseenter.sac', function(){
						clearTimeout($fc.data('hidetimer'));
						$fc.off('mouseenter.sac');
						});
					};
				var filterDepart = function(event, $context, infoObj){
					var $fc = $('#filterContainer');
					$fc.removeClass('expand').removeClass('active');
					$fc.off('mouseenter.sac');
					};
					
				_app.templates.filteredSearchTemplate.on('complete.filter', filterComplete);	
				_app.templates.filteredSearchTemplate.on('depart.filter', filterDepart);
				
				//Brand filters don't need filter complete, as they will show the filterContainer after a user selects a model
				_app.templates.filteredSearchTemplateBrand.on('depart.filter', filterDepart);
				
				_app.router.appendHash({'type':'exact','route':'motorcycle-helmets/', 'callback':function(routeObj){
					showContent('static',{'templateID':'helmetsTemplate'});
					}});
				_app.router.appendHash({'type':'exact','route':'parts/', 'callback':function(routeObj){
					showContent('static',{'templateID':'partsTemplate'});
					}});
				_app.router.appendHash({'type':'exact','route':'apparel/', 'callback':function(routeObj){
					showContent('static',{'templateID':'apparelTemplate'});
					}});
				_app.router.appendHash({'type':'exact','route':'brands/', 'callback':function(routeObj){
					showContent('static',{'templateID':'brandsTemplate'});
					}});
				
				//Adds the listener for the url.  The route needs to match the page pushed into robots below
				_app.router.appendHash({'type':'match','route':'motorcycle-helmets/{{id}}/*','callback':'filter'});
				//This is the list of helmet pages.  The ID is part of the URL- change this for SEO reasons- the jsonPath is the file where it loads the options from.  The jsonPath doesn't matter as long as it loads the file
				var helmetPages = [
					{id:'dirt-bike',jsonPath:'filters/helmets/dirt-bike.json'},
					{id:'accessories',jsonPath:'filters/helmets/helmet-accessories.json'},
					{id:'dual-sport',jsonPath:'filters/helmets/dual-sport.json'},
					{id:'half-shell',jsonPath:'filters/helmets/half-shell.json'},
					{id:'modular',jsonPath:'filters/helmets/modular.json'},
					{id:'three-quarter',jsonPath:'filters/helmets/three-quarter.json'},
					{id:'full-face',jsonPath:'filters/helmets/full-face.json'}
					];
				for(var i in helmetPages){	
					_app.ext.store_filter.vars.filterPages.push(helmetPages[i]);
					//this page needs to match the route above
					_app.ext.seo_robots.vars.pages.push("#!motorcycle-helmets/"+helmetPages[i].id+"/");
					}
				
				_app.router.appendHash({'type':'match','route':'parts/{{id}}/*','callback':'filter'});
				var partsPages = [
					{id:'chain-and-sprocket-kits',jsonPath:'filters/parts/chain-kits.json'},
					{id:'electrical',jsonPath:'filters/parts/electrical.json'},
					{id:'exhaust',jsonPath:'filters/parts/exhaust.json'},
					{id:'intake',jsonPath:'filters/parts/intake.json'},
					{id:'suspension',jsonPath:'filters/parts/suspension.json'},
					{id:'brakes',jsonPath:'filters/parts/brakes.json'},
					{id:'controls',jsonPath:'filters/parts/controls.json'},
					{id:'repair-manual',jsonPath:'filters/parts/repair-manual.json'},
					{id:'chain',jsonPath:'filters/parts/chain.json'}
					];
				for(var i in partsPages){	
					_app.ext.store_filter.vars.filterPages.push(partsPages[i]);
					_app.ext.seo_robots.vars.pages.push("#!parts/"+partsPages[i].id+"/");
					}
				
				_app.router.appendHash({'type':'match','route':'apparel/{{id}}/*','callback':'filter'});
				var apparelPages = [
					{id:'gloves',jsonPath:'filters/apparel/gloves.json'},
					{id:'grips',jsonPath:'filters/apparel/grips.json'},
					{id:'luggage',jsonPath:'filters/apparel/luggage.json'},
					{id:'tools',jsonPath:'filters/apparel/tools.json'},
					{id:'security',jsonPath:'filters/apparel/security.json'},
					{id:'tank-pads',jsonPath:'filters/apparel/tank-pads.json'},
					{id:'hitcase',jsonPath:'filters/apparel/hitcase.json'}
					];
				for(var i in apparelPages){	
					_app.ext.store_filter.vars.filterPages.push(apparelPages[i]);
					_app.ext.seo_robots.vars.pages.push("#!apparel/"+apparelPages[i].id+"/");
					}
				
				_app.router.appendHash({'type':'match','route':'brands/{{id}}/*','callback':'filter' /*use brandFilter later*/});
				_app.router.appendHash({'type':'match','route':'brand-feature-reviews/{{id}}/*','callback':'brandFilter'});
				var brandsPages = [
					{id:'airoh',jsonPath:'filters/brands/airoh.json'},
					{id:'ancra',jsonPath:'filters/brands/ancra.json'},
					{id:'answer',jsonPath:'filters/brands/answer.json'},
					{id:'arai',jsonPath:'filters/brands/arai.json'},
					{id:'bmc',jsonPath:'filters/brands/bmc.json'},
					{id:'factory-racing',jsonPath:'filters/brands/factory-racing.json'},
					{id:'giant-loop',jsonPath:'filters/brands/giant-loop.json'},
					{id:'hjc',jsonPath:'filters/brands/hjc.json'},
					{id:'k-and-n',jsonPath:'filters/brands/k-and-n.json'},
					{id:'leovince',jsonPath:'filters/brands/leovince.json'},
					{id:'msr',jsonPath:'filters/brands/msr.json'},
					{id:'olympia',jsonPath:'filters/brands/olympia.json'},
					{id:'onguard',jsonPath:'filters/brands/onguard.json'},
					{id:'progressive',jsonPath:'filters/brands/progressive.json'},
					{id:'racepro',jsonPath:'filters/brands/racepro.json'},
					{id:'rk',jsonPath:'filters/brands/rk.json'},
					{id:'shoei',jsonPath:'filters/brands/shoei.json'},
					{id:'skid-lid',jsonPath:'filters/brands/skid-lid.json'},
					{id:'speed-and-strength',jsonPath:'filters/brands/speed-and-strength.json'},
					{id:'suomy',jsonPath:'filters/brands/suomy.json'},
					{id:'thh',jsonPath:'filters/brands/thh.json'},
					{id:'yuasa',jsonPath:'filters/brands/yuasa.json'}
					];
				for(var i in brandsPages){	
					_app.ext.store_filter.vars.filterPages.push(brandsPages[i]);
					_app.ext.seo_robots.vars.pages.push("#!brands/"+brandsPages[i].id+"/");
					}
				_app.ext.store_search.vars.universalFilters.push({"term":{"showtime":"1"}});
				},
			onError : function(){
				dump('BEGIN store_sac.callbacks.attachEventHandlers.onError');
				}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		a : {
			showYoutubeVideo : function(videoid, title){
				if(videoid){
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
				}
			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
		
		tlcFormats : {
			countrylist : function(data, thisTLC){
				var _tag = {
					callback : function(rd){
						var data = _app.data[rd.datapointer];
						var destinations = data['@destinations'];
						var L = destinations.length
						var cartid = _app.model.fetchCartID();
						var cartData = _app.data['cartDetail|'+cartid];
						for(var i = 0; i < L; i += 1)	{
							r += "<option value='"+destinations[i].ISO+"'>"+destinations[i].Z+"</option>";
							}
						
						rd.jqObj.append(r);
						rd.jqObj.val(_app.u.thisNestedExists("data.cartDetail|"+cartid+".ship.countrycode",_app) ? cartData['ship'].countrycode : 'US');
						},
					jqObj : data.globals.tags[data.globals.focusTag]
					}
				_app.ext.cco.calls.appCheckoutDestinations.init(_app.model.fetchCartID(),_tag,'mutable');
				_app.model.dispatchThis('mutable');
				},
			imageurl : function(data,thisTLC){
				var args = thisTLC.args2obj(data.command.args, data.globals);
				data.globals.binds[data.globals.focusBind] = _app.u.makeImage(args);
				return true;
				},
			filterform : function(data, thisTLC){
				var $context = data.globals.tags[data.globals.focusTag];
				
				var $fc = $('#filterContainer');
				var $fl = $('#filterList', $fc);
				$fl.removeData().empty();
				
				$fl.data('dataset',data.value);
				$fl.tlc({'dataset':data.value, 'templateid':'filterListTemplate'});
				$('button', $fl).button();
				
				$('form',$fl).data('jqContext',$context);
				
				//$('form', $fl).trigger('submit');
				}
			},
		
		renderFormats : {
			filtercheckboxlist : function($tag,data){
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
			assigndata : function($tag, data){
				$tag.data(data.bindData.attribute, data.value);
				//_app.u.dump($tag.data(data.bindData.attribute));
				},
			showifshipfree : function($tag, data){
				if($.inArray("IS_SHIPFREE", data.value) >= 0){
					$tag.show();
					}
				},
			prodchildoption: function($tag, data){
				$tag.val(data.value.pid);
				dump(data.value);
				if(data.value['%attribs']['zoovy:prod_size']){
					$tag.text(data.value['%attribs']['zoovy:prod_size']);
					}
				else{
					$tag.text(data.value['%attribs']['zoovy:prod_name']);
					}
				if(!_app.ext.store_product.u.productIsPurchaseable(data.value.pid)){
					$tag.attr('disabled','disabled');
				}
				},
			imajize : function($tag, data){
				var src = '';
				if(document.location.protocol == "https:"){
					src += "https://s3.amazonaws.com/embed.imajize.com/";
					}
				else {
					src += "http://embed.imajize.com/";
					}
				src += data.value;
				dump(src);
				$tag.attr('src',src);
				},
			imagesrcset : function($tag, data){
				//dump(data);
				var dims = data.bindData.dims.split(" ");
				var srcset = "";
				for(var i = 0; i < dims.length; i++){
					var da = dims[i].split("|");
					
					var param = da[0];
					var w = da[1];
					var h = da[2];
					
					var src = _app.u.makeImage($.extend({},data.bindData,{
						"name" : data.value,
						"w" : w,
						"h" : h,
						"b" : data.bindData.bgColor || "ffffff"
						}));
					//dump(src);
					if(i==0){
						$tag.attr('src',src);
						}
					srcset += src;
					if(i!=dims.length-1){
						srcset += " "+param+",";
						}
					}
				dump(srcset);
				$tag.attr('srcset', srcset);
				}
			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		u : {
			startHomepageSlideshow : function(attempts){
				attempts = attempts || 0;
				if(_app.ext.store_sac.vars.bannerJSON){
					var $slideshow = $('#homepageSlideshow');
					if($slideshow.hasClass('slideshowRendered')){
						dump('slideshow already here');
						//already rendered, do nothing.
						}
					else {
						dump('appending banners');
						for(var i=0; i < _app.ext.store_sac.vars.bannerJSON.slides.length; i++){
							var $banner = _app.ext.store_sac.u.makeBanner(_app.ext.store_sac.vars.bannerJSON.slides[i]);
							$slideshow.append($banner);
							}
						$slideshow.append($(_app.ext.store_sac.vars.bannerJSON.pagerHTML));
						cycleOptions = _app.ext.store_sac.vars.bannerJSON.cycleOptions;
						cycleOptions.log = false;
						$slideshow.addClass('slideshowRendered').cycle(cycleOptions);
						}
					}
				else {
					setTimeout(function(){_app.ext.store_sac.u.startHomepageSlideshow();}, 250);
					}
				},
			loadBanners : function(){
				_app.u.dump("loadbanners");
				$.getJSON("_banners.json?_v="+(new Date()).getTime(), function(json){
					_app.ext.store_sac.vars.bannerJSON = json;
					}).fail(function(a,b,c){
						_app.ext.store_sac.vars.bannerJSON = {};
						_app.u.dump("BANNERS FAILED TO LOAD");
						});
				},
			makeBanner : function(bannerJSON){
				var $banner = $('<a></a>');
				
				var $img = $('<img />');
				/*
				var srcset = "";
				for(var i=0; i < dims.length; i++){
					var src = _app.u.makeImage({
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
				*/
				$img.attr('src',_app.u.makeImage(bannerJSON));
				
				$banner.append($img);
				if(bannerJSON.href){
					$banner.attr('href', bannerJSON.href);
					}
				/*if(bannerJSON.prodLink){
					$banner.attr("data-onClick", "appLink").attr("href","#!/"+bannerJSON.prodLink);
					}
				else if(bannerJSON.catLink){
					$banner.attr("data-onClick", "appLink").attr("href","#!/"+bannerJSON.catLink);
					}
				else if(bannerJSON.searchLink){
					$banner.attr("data-onClick", "appLink").attr("href","#!search?KEYWORDS="+bannerJSON.searchLink);
					}
				else {
					//just a banner!
					}
				*/
				return $banner;
				},
			initFilteredSearch : function($context, infoObj){
				var $fc = $('#filterContainer');
				var $fl = $('#filterList', $fc);
				var timer = $fc.data('filter-list-clear-timer');
				if(timer){
					clearTimeout(timer);
					$fl.removeData().empty();
					$fc.removeData('filter-list-clear-timer');
				}
				
				$fl.data('jqContext',$context);
				$fl.data('navcat',infoObj.navcat);
				$fl.data('filters',_app.ext.store_sac.filters[infoObj.navcat]);
				
				$fl.tlc({'dataset':_app.ext.store_sac.filters[infoObj.navcat], 'templateid':'filterListTemplate'});
				$('button', $fl).button();
				$fc.addClass('active');
				_app.ext.store_sac.u.sendFilteredSearch();
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
				_app.u.dump($('#filterList [data-sac=filterBase]').length);
				_app.u.dump($('#filterList [data-sac=filterBase]').data('filter-base'));
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
				
				_app.u.dump(elasticsearch);
				var es = _app.ext.store_search.u.buildElasticRaw(elasticsearch);
				es.size = 60;
				_app.ext.store_search.u.updateDataOnListElement($('[data-sac=output]', $context),es,1);
				_app.ext.store_search.calls.appPublicSearch.init(es, {'callback':'handleElasticResults', 'datapointer':'appFilteredSearch','extension':'store_search','templateID':'productListTemplateResults','list':$('[data-sac=output]', $context)});
				_app.model.dispatchThis();
				
				//_app.u.dump(es);
				},
			destroyFilteredSearch : function(infoObj){
				var $fc = $('#filterContainer');
				$fc.removeClass('expand').removeClass('active');
				
				var timer = setTimeout(function(){
					$('#filterList', $fc).removeData().empty();
					$fc.removeData('filter-list-clear-timer');
				}, 750);
				
				$fc.data('filter-list-clear-timer', timer);
				}
			}, //u [utilities]

		e : {
			cartCountryChange : function($ele, p){
				p.preventDefault();
				var country = $ele.val();
				
				_app.ext.cco.calls.cartSet.init({'ship/postal':'', 'ship/region':'', 'ship/countrycode':country,'_cartid': $ele.closest("[data-template-role='cart']").data('cartid')},{},'immutable');
				$ele.closest("[data-template-role='cart']").trigger('fetch',{'Q':'immutable'});
				$ele.closest("[data-app-role='cartTemplateShippingContainer']").find("input[name='ship/postal']").val('');
				_app.model.dispatchThis('immutable');
				},
			selectBrandModel : function($ele, p){
				var $fc = $('#filterContainer');
				$('input[name="'+$ele.attr('data-brand-model')+'"]', $fc).prop('checked',true);
				
				//Essentially the same as arriving on a filter page the first time
				//$('form', $fc).data('loadFullList', infoObj.loadFullList).trigger('submit');
				$('form', $fc).trigger('submit');
				$fc.addClass('active expand');
				var timer = setTimeout(function(){
					$fc.removeClass('expand');
					}, 4000);
				$fc.data('hidetimer', timer);
				$fc.on('mouseenter.sac', function(){
					clearTimeout($fc.data('hidetimer'));
					$fc.off('mouseenter.sac');
					});
					
				//Show the list
				var $context = $ele.closest('[data-filter="parent"]')
				$('.defaultContent', $context).hide();
				$('.selectedContent', $context).show();
				
				},
			deselectBrandModel : function($ele, p){
				
				var $fc = $('#filterContainer');
				$fc.removeClass('active expand');
				var $fl = $('#filterList', $fc);
				var dataset = $fl.data('dataset');
				$fl.removeData().empty();
				$fl.data('dataset', dataset);
				$fl.tlc({'dataset':dataset, 'templateid':'filterListTemplate'});
				$('button', $fl).button();
				
				
				var $context = $ele.closest('[data-filter="parent"]')
				$('.defaultContent', $context).show();
				$('.selectedContent', $context).hide();
				
				$('form',$fl).data('jqContext',$context);
				},
			productAdd2Cart : function($form, p){
				p.preventDefault();
				var $childSelect = $('.prodChildren.active select', $form);
				if($childSelect.length > 0){
					var cartObj = {"_cartid":_app.model.fetchCartID(),"sku":$childSelect.val(), "qty":$('input[name=qty]',$form).val()};
					if($childSelect.val()){
						_app.ext.cco.calls.cartItemAppend.init(cartObj,{},'immutable');
						_app.model.destroy('cartDetail|'+cartObj._cartid);
						_app.calls.cartDetail.init(cartObj._cartid,{'callback':function(rd){
							if(_app.model.responseHasErrors(rd)){
								$('#globalMessaging').anymessage({'message':rd});
								}
							else	{
								_app.ext.quickstart.u.showCartInModal({'templateID':'cartTemplate'});
								dump(" ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
								cartMessagePush(cartObj._cartid,'cart.itemAppend',_app.u.getWhitelistedObject(cartObj,['sku','pid','qty','quantity','%variations']));
								}
							}},'immutable');
						_app.model.dispatchThis('immutable');
						}
					else {
						$form.anymessage(_app.u.errMsgObject("You must select an option"));
						}
					}
				else {
					_app.ext.quickstart.e.productAdd2Cart($form, p);
					}
				},
			searchFormSubmit : function($form, p){
				p.preventDefault();
				var json = $form.serializeJSON();
				window.location.hash = "#!search/keywords/"+json.search+"/";
			}
			}, //e [app Events]
			
		// A map of navcats to objects containing their base filters and available filters for filtered search.  
		// It can be assumed that if a navcat is used as a key here, (ie typeof _app.ext.store_sac.filters[navcat] !== "undefined") 
		// then the app should use the filtered search template for it
		filters : {
			".motorcycle-apparel" : {
				"base" : {"term" : {"prod_is_general" : "accessory_clothing"}},
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
			".motorcycle-parts" : {
				"base" : {"term" : {"prod_is_general" : "part"}},
				"options" : {}
				},
			".motorcycle-parts.body" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"body"}}]},
				"options" : {
					"part_sub_type":[{"p":"Mirrors","v":"mirrors"},{"p":"Carbon Fiber","v":"carbon_fiber"},{"p":"Fender Kits","v":"fender_kits"}],
					"make_key":[{"p":"Honda","v":"honda"},{"p":"Kawasaki","v":"kawasaki"},{"p":"Suzuki","v":"suzuki"},{"p":"Yamaha","v":"yamaha"},{"p":"Universal","v":"universal"}],
					"finish":[{"p":"Aluminium","v":"aluminium"},{"p":"Black","v":"black"},{"p":"Carbon","v":"carbon"},{"p":"Chrome","v":"chrome"},{"p":"White","v":"white"},{"p":"Green","v":"green"}]
					}
				},
			".motorcycle-parts.controls" : {
				"base" : {"and" : [{"term" : {"prod_is_general" : "part"}},{"term" : {"part_type":"controls"}}]},
				"options" : {
					"make_key":[{"p":"Aprilia","v":"aprilia"},{"p":"BMW","v":"bmw"},{"p":"Buell","v":"buell"},{"p":"Can-Am","v":"can_am"},{"p":"Ducati","v":"ducati"},{"p":"Harley","v":"harley"},{"p":"Honda","v":"honda"},{"p":"Husqvarna","v":"husqvarna"},{"p":"KTM","v":"ktm"},{"p":"KYMCO","v":"kymco"},{"p":"Kawasaki","v":"kawasaki"},{"p":"MV Agusta","v":"mv_agusta"},{"p":"Moto Guzzi","v":"moto_guzzi"},{"p":"Other","v":"other"},{"p":"Scooters","v":"scooters"},{"p":"Triumph","v":"triumph"},{"p":"Vespa","v":"vespa"},{"p":"Victory","v":"victory"},{"p":"Yamaha","v":"yamaha"}]
					}
				},
			}
		} //r object.
	return r;
	}
