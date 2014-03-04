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




var store_routing = function(_app) {
	var theseTemplates = new Array('');
	var r = {


////////////////////////////////////   CALLBACKS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\



	callbacks : {
		init : {
			onSuccess : function()	{
				var r = false; 
				
				dump('here');
				_app.vars._ignoreHashChange = true;
				$('body').on('click.hashchange', 'a[href^="#!"]', function(e){
					dump($(this).attr('href'));
					var routeObj = _app.router._getRouteObj($(this).attr('href').substr(2),'hash');
					if(routeObj){
						_app.router._executeCallback(routeObj);
					}
				});
				
				_app.router.addAlias('homepage', 	function(routeObj){showContent('homepage',	routeObj.params);});
				_app.router.addAlias('category', 	function(routeObj){showContent('category',	routeObj.params);});
				_app.router.addAlias('product', 	function(routeObj){showContent('product',	routeObj.params);});
				_app.router.addAlias('company', 	function(routeObj){dump('company'); showContent('company',	routeObj.params);});
				_app.router.addAlias('customer', 	function(routeObj){showContent('customer',	routeObj.params);});
				_app.router.addAlias('checkout', 	function(routeObj){showContent('checkout',	routeObj.params);});
				_app.router.addAlias('cart', 		function(routeObj){showContent('cart',		routeObj.params);});
				_app.router.addAlias('search', 		function(routeObj){showContent('search',	routeObj.params);});
				
				_app.router.appendHash({'type':'exact','route':'/','callback':'homepage'});
				_app.router.appendHash({'type':'exact','route':'','callback':'homepage'});
				_app.router.appendHash({'type':'match','route':'/category/{{navcat}}/*','callback':'category'});
				_app.router.appendHash({'type':'match','route':'/product/{{pid}}/*','callback':'product'});
				_app.router.appendHash({'type':'match','route':'/company/{{show}}/','callback':'company'});
				_app.router.appendHash({'type':'match','route':'/customer/{{show}}/','callback':'customer'});
				_app.router.appendHash({'type':'exact','route':'/checkout/','callback':'checkout'});
				_app.router.appendHash({'type':'exact','route':'/cart/','callback':'cart'});
				_app.router.appendHash({'type':'match','route':'/search/{{KEYWORDS}}/','callback':'search'});
				
				r = true;

				return r;
				},
			onError : function()	{
				_app.u.dump('BEGIN store_routing.callbacks.init.onError');
				}
			},
		attachEventHandlers : {
			onSuccess : function(){
				_app.templates.homepageTemplate.on('complete.routing', function(event, $context, infoObj){_app.ext.store_routing.u.setHash("#!/");});
				
				_app.templates.categoryTemplate.on('complete.routing', function(event, $context, infoObj){
					var hash = "";
					var $routeEle = $('[data-routing-hash]',$context)
					if($routeEle.length){
						hash = $routeEle.attr('data-routing-hash');
						}
					else {
						hash = "#!/category/"+infoObj.navcat+"/";
					}
					_app.ext.store_routing.u.setHash(hash);
					});
					
				_app.templates.categoryTemplateFilteredSearch.on('complete.routing', function(event, $context, infoObj){
					var hash = "";
					var $routeEle = $('[data-routing-hash]',$context)
					if($routeEle.length){
						hash = $routeEle.attr('data-routing-hash');
						}
					else {
						hash = "#!/category/"+infoObj.navcat+"/";
					}
					_app.ext.store_routing.u.setHash(hash);
					});
					
				_app.templates.productTemplate.on('complete.routing', function(event, $context, infoObj){
					var hash = "";
					var $routeEle = $('[data-routing-hash]',$context)
					if($routeEle.length){
						hash = $routeEle.attr('data-routing-hash');
						}
					else {
						hash = "#!/product/"+infoObj.pid+"/";
					}
					dump(hash);
					_app.ext.store_routing.u.setHash(hash);
					});
				
				_app.templates.companyTemplate.on('complete.routing', function(event, $context, infoObj){_app.ext.store_routing.u.setHash("#!/company/"+infoObj.show+"/");});
				_app.templates.customerTemplate.on('complete.routing', function(event, $context, infoObj){_app.ext.store_routing.u.setHash("#!/customer/"+infoObj.show+"/");});
				_app.templates.searchTemplate.on('complete.routing', function(event, $context, infoObj){_app.ext.store_routing.u.setHash("#!/search/"+encodeURI(infoObj.KEYWORDS)+"/");});
				_app.templates.cartTemplate.on('complete.routing', function(event, $context, infoObj){if(infoObj.show == "inline"){_app.ext.store_routing.u.setHash("#!/cart/");}});
				//_app.templates.checkoutTemplate.on('complete.routing', function(event, $context, infoObj){_app.ext.store_routing.u.setHash("#!/checkout/");});
				},
			onError : function(){}
			}
		}, //callbacks



////////////////////////////////////   ACTION    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		a : {

			}, //Actions

////////////////////////////////////   RENDERFORMATS    \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\
		
		tlcFormats : {
			productlink : function(data, thisTLC){
				var args = thisTLC.args2obj(data.command.args, data.globals);
				if(args.pid && args.seo){
					data.globals.binds[data.globals.focusBind] =  _app.ext.store_routing.u.productLink(args.pid, args.seo);
					dump(data.globals.binds[data.globals.focusBind]);
					return true;
					} 
				else {
					dump('-> store_routing productlink tlcformat: The PID or SEO content was not provided in the tlc.');
					//stop execution of the commands.  throw a tantrum.
					return false;
					}
				},
			categorylink : function(data,thisTLC){
				var args = thisTLC.args2obj(data.command.args, data.globals);
				if(args.navcat && args.seo){
					data.globals.binds[data.globals.focusBind] =  _app.ext.store_routing.u.categoryLink(args.navcat, args.seo);
					return true;
					} 
				else {
					dump('-> store_routing categorylink tlcformat: The navcat or SEO content was not provided in the tlc.');
					//stop execution of the commands.  throw a tantrum.
					return false;
					}
				}
		},
		
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		u : {
			setHash : function(hash){
				window.location.href = window.location.href.split("#")[0]+hash;
				},
			productLink : function(pid, seo){
				seo = seo || "";
				var href="#!/product/"+pid+"/"+encodeURI(seo);
				return href;
				},
			categoryLink : function(navcat, seo){
				seo = seo || "";
				var href="#!/category/"+navcat+"/"+encodeURI(seo);
				return href;
				}
			}, //u [utilities]

		e : {
			} //e [app Events]
		} //r object.
	return r;
	}