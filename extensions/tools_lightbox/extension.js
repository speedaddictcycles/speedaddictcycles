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



//	Intended as a free, open source alternative to 3rd party plugins like Magic Zoom Plus.
//	Utilizes the Lightbox 2 jQuery plugin: http://lokeshdhakar.com/projects/lightbox2/

var tools_lightbox = function(_app) {
	var r = {
	callbacks : {
		init : {
			onSuccess : function()	{
				var r = false;
				
				_app.u.loadResourceFile(['script',0,'extensions/tools_lightbox/lightbox/js/lightbox-2.6.min.js']);
				_app.u.loadResourceFile(['css',0,'extensions/tools_lightbox/lightbox/css/lightbox.css','css-lightbox']);
				//_app.u.loadResourceFile(['css',0,'extensions/tools_lightbox/lightbox/css/screen.css','lightbox-screen']);
				
				r = true;

				return r;
				},
			onError : function()	{
				_app.u.dump('BEGIN tools_lightbox.callbacks.init.onError');
				}
			}
		}, //callbacks

		a : {

			}, //a [actions]
		tlcFormats : {
			
		},
		renderFormats : {
			
/****************************************
A renderformat for creating a lightbox link completely agnostic of data-object that is being passed into it.

This renderformat is intended to be on a link tag around a typical img tag bound by imageURL.
ex: 
<a data-bind="useParentData:true; format:lightboxLink; extension:tools_lightbox; hrefattr:%attribs.zoovy:prod_image1;">
	<img src='blank.gif' class='prodBigImage' data-bind='var: product(zoovy:prod_image1); format:imageURL;' width='296' height='296' />
</a>

Do not specify a var, ALWAYS set useParentData to true.

bindData params:
required:
	hrefattr - a dot-notation path for de-referencing the image path from the parent data- ex: "%attribs.zoovy:prod_image1"
optional:
	w - A width to be passed to the _app.u.makeImage call
	h - A height to be passed to the _app.u.makeImage call
	b - A background color to be passed to the _app.u.makeImage call
	
	groupingAttr - a dot-notation path for de-referencing an attribute for grouping- ex: "pid" for a simple bind to a product ID.
	groupingPrefix - a prefix that will be attached to the groupingAttr.  For separating groups by instance- prodlist vs. product page for example
!!!!!!!! NOTE: multiple prodlist entries with the same product (or catList with cats) will repeat prefix- may need to update this later
	
	titleAttr - a dot-notation path for de-referencing an attribute for title- ex: "%attribs.zoovy:prod_name"
****************************************/
			lightboxlink: function($tag,data){
				dump(data);
				if(!data.bindData.hrefattr){
					_app.u.dump("-> tools_lightbox.renderFormats.lightboxLink NO HREFATTR SPECIFIED");
					return false;
					}
				else {
					var hrefattr = data.value;
					var hrefParams = data.bindData.hrefattr.split('.');
					
					for(var index in hrefParams){
						if(hrefattr[hrefParams[index]]){
							hrefattr = hrefattr[hrefParams[index]];
							}
						else {
							hrefattr = false;
							break;
							}
						}
					
					if(!hrefattr){
						_app.u.dump("-> tools_lightbox.renderFormats.lightboxLink HREFATTR["+data.bindData.hrefattr+"] COULD NOT BE INTERPOLATED FROM DATA OBJECT");
						return false;
						}
					else {
						var imgObj = {
							name : hrefattr
							};
						if(data.bindData.w){ imgObj.w = data.bindData.w; }
						if(data.bindData.h){ imgObj.h = data.bindData.h; }
						if(data.bindData.b){ imgObj.b = data.bindData.b; }
						
						var href = _app.u.makeImage(imgObj);
						
						var group= '';
						if(data.bindData.groupingattr){
							var groupingattr = data.value;
							var groupingParams = data.bindData.groupingattr.split('.');
							
							for(var index in groupingParams){
								if(groupingattr[groupingParams[index]]){
									groupingattr = groupingattr[groupingParams[index]];
									}
								else {
									groupingattr = false;
									break;
									}
								}
							if(groupingattr){
								
								if(data.bindData.groupingprefix){
									group += data.bindData.groupingprefix;
									}
								group += groupingattr;
															
								}
						
						
							}
						//If no group is specified, set it to the href so it is unique (hopefully?)
						if(group === ''){ group = href; }
						
						var title = false;
						if(data.bindData.titleattr){
							var titleattr = data.value;
							var titleParams = data.bindData.titleattr.split('.');
							
							for(var index in titleParams){
								if(titleattr[titleParams[index]]){
									titleattr = titleattr[titleParams[index]];
									}
								else {
									titleattr = false;
									break;
									}
								}
							if(titleattr){
								title = titleattr;							
								}
						
						
							}
						
						$tag.attr('href', href);
						$tag.attr('data-lightbox', group);
						if(title){
							$tag.attr('title', title);
							}
						}
					}
				}
			}, //renderFormats

		u : {
			} //u [utilities]

		} //r object.
	return r;
	}