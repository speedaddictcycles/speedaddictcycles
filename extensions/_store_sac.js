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
				
				
				_app.router.appendHash({'type':'exact','route':'helmets/', 'callback':function(routeObj){
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
				
				_app.router.appendHash({'type':'match','route':'helmets/{{id}}/*','callback':'filter'});
				_app.ext.store_filter.vars.filterPages.push({id:'dirt-bike',path:'filters/helmets/dirt-bike.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'accessories',path:'filters/helmets/helmet-accessories.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'dual-sport',path:'filters/helmets/dual-sport.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'half-shell',path:'filters/helmets/half-shell.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'modular',path:'filters/helmets/modular.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'three-quarter',path:'filters/helmets/three-quarter.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'full-face',path:'filters/helmets/full-face.json'});
				
				_app.router.appendHash({'type':'match','route':'parts/{{id}}/*','callback':'filter'});
				_app.ext.store_filter.vars.filterPages.push({id:'chain-and-sprocket-kits',path:'filters/parts/chain-kits.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'electrical',path:'filters/parts/electrical.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'exhaust',path:'filters/parts/exhaust.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'intake',path:'filters/parts/intake.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'suspension',path:'filters/parts/suspension.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'brakes',path:'filters/parts/brakes.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'chain',path:'filters/parts/chain.json'});
				
				_app.router.appendHash({'type':'match','route':'apparel/{{id}}/*','callback':'filter'});
				_app.ext.store_filter.vars.filterPages.push({id:'gloves',path:'filters/apparel/gloves.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'grips',path:'filters/apparel/grips.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'luggage',path:'filters/apparel/luggage.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'tools',path:'filters/apparel/tools.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'security',path:'filters/apparel/security.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'tank-pads',path:'filters/apparel/tank-pads.json'});
				
				_app.router.appendHash({'type':'match','route':'brands/{{id}}/*','callback':'filter'});
				_app.ext.store_filter.vars.filterPages.push({id:'airoh',path:'filters/brands/airoh.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'ancra',path:'filters/brands/ancra.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'answer',path:'filters/brands/answer.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'arai',path:'filters/brands/arai.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'bmc',path:'filters/brands/bmc.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'factory-racing',path:'filters/brands/factory-racing.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'giant-loop',path:'filters/brands/giant-loop.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'hjc',path:'filters/brands/hjc.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'k-and-n',path:'filters/brands/k-and-n.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'leovince',path:'filters/brands/leovince.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'msr',path:'filters/brands/msr.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'olympia',path:'filters/brands/olympia.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'onguard',path:'filters/brands/onguard.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'progressive',path:'filters/brands/progressive.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'racepro',path:'filters/brands/racepro.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'rk',path:'filters/brands/rk.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'shoei',path:'filters/brands/shoei.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'skid-lid',path:'filters/brands/skid-lid.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'speed-and-strength',path:'filters/brands/speed-and-strength.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'suomy',path:'filters/brands/suomy.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'thh',path:'filters/brands/thh.json'});
				_app.ext.store_filter.vars.filterPages.push({id:'yuasa',path:'filters/brands/yuasa.json'});
				
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
				
				// _app.templates.categoryTemplateFilteredSearch.on('complete.sac',function(event, $context, infoObj){
					// _app.ext.store_sac.u.initFilteredSearch($context, infoObj);
					// });
				// _app.templates.categoryTemplateFilteredSearch.on('depart.sac',function(event, $context, infoObj){
					// _app.ext.store_sac.u.destroyFilteredSearch(infoObj);
					// });
					
				_app.templates.filteredSearchTemplate.on('complete.filter', function(event, $context, infoObj){
					var $fc = $('#filterContainer');
					$('form', $fc).trigger('submit');
					});	
				_app.templates.filteredSearchTemplate.on('depart.filter', function(event, $context, infoObj){
					var $fc = $('#filterContainer');
					$fc.removeClass('expand').removeClass('active');
					});
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
				
				
				$fl.tlc({'dataset':data.value, 'templateid':'filterListTemplate'});
				$('button', $fl).button();
				$fc.addClass('active');
				
				$('form',$fl).data('jqContext',$context);
				$('form', $fl).trigger('submit');
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
				var src = "http://embed.imajize.com/"+data.value;
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
				window.location.hash = "#!/search/"+json.search+"/";
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