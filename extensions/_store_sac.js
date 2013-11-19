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

			}, //renderFormats
////////////////////////////////////   UTIL [u]   \\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\

		u : {
			}, //u [utilities]

		e : {
			} //e [app Events]
		} //r object.
	return r;
	}