/* mlab.appforsale.kernel */
(function (window) {
		
	if (!!window.app)
		return;
	
	window.Appforsale = function ()
	{
		var ua = window.navigator.userAgent.toLowerCase();

		if (ua.indexOf("android") != -1)
			this.platform = "android";
		else
			this.platform = "ios";
		
		this.callbacks = {};
		this.callbackIndex = 0;
	}
		
	window.Appforsale.prototype.exec = function(funcName, params, context)
	{
		var arParams = {};
				
		if (typeof(params) != "undefined")
		{
			arParams = params;
			if (typeof(arParams) == "object")
				arParams = JSON.stringify(arParams);
		}
		else
		{
			arParams = "{}";
		}

		try {
			if (this.platform == "android")
			{
				return exec.postMessage(funcName, arParams);	
			}
			else
			{
				return window.webkit.messageHandlers.exec.postMessage('{"funcName":"' + funcName + '", "params":' + arParams + '}');
			}
		}
		catch(e)
		{
			switch (funcName)
			{
				case "loadPageBlank":
					window.location = params.url;
					break;
				case "loadPageStart":	
					window.location = params.url;
					break;
				case "onCustomEvent":
					/*BX.onGlobalCustomEvent(
						params.eventName,
 						params.params
					);*/
					// LECTORED - remake global event (not defined)
				    if (!!BX.onGlobalCustomEvent)
				    {
						// ok
				    } else {
				        try {
                            BX.onGlobalCustomEvent = function(eventName, arEventParams, bSkipSelf)
                            {
                            	if (!!BX.localStorage.checkBrowser())
                            		BX.localStorage.set('BXGCE', {e:eventName,p:arEventParams}, 1);
                            
                            	if (!bSkipSelf)
                            		BX.onCustomEvent(eventName, arEventParams);
                            };
				        } catch(e) {
				            console.log(e);
				        }
				    
				    }
				    
				    try {
    					BX.onGlobalCustomEvent(
    						params.eventName,
     						params.params
    					);
				    } catch(e) {
				        console.log(e);
				    }
					
					break;
				case "closeController":
					history.back();
					
					break;
				case "reload":
					location.reload();
					break;
				case "showFileChooser":
					BX.nextSibling(context).click()
					break;
			}
		}
	}
	
	var app = new Appforsale();
	window.app = app;
		
	
	app.locationSettings = function(func)
	{
		var callbackIndex = this.RegisterCallBack(func);
		return this.exec("locationSettings", {callback: callbackIndex});
	}
	
	app.enableMenu = function()
	{
		this.exec("enableMenu");
	}
	
	app.closeMenu = function()
	{
		this.exec("closeMenu");
	}

	app.hideProgress = function()
	{
		this.exec("hideProgress");
	}
	
	app.showProgress = function()
	{
		this.exec("showProgress");
	}
	

	
	app.onCustomEvent = function(eventName, params)
	{
		this.exec("onCustomEvent", {eventName: eventName, params: params});
	}
	
	app.loadPageBlank = function(params)
	{
		// LECTORED - Commented by module update
//		if (typeof(BM) != "undefined" && typeof(BM.MobileApp) != "undefined" &&  BM.MobileApp.isDevice())
//		{
//			location.href = params.url;
//			return;
//		}
		
		app.closeMenu();
		
		if (params.url.indexOf('tel:') == 0)
		{
			window.location = params.url;
			return;
		}
		else if (params.url.charAt(0) == '/')
		{
			params.url = window.location.protocol + "//" + window.location.hostname +  params.url;
		}
		else if (params.url.indexOf('http') == 0)
		{
		}
		else
		{
			params.url = window.location.protocol + "//" + window.location.hostname + window.location.pathname +  params.url;
		}

		this.exec("loadPageBlank", params);
	}
	
	app.loadPageStart = function(params)
	{	
		// LECTORED - Commented by module update
//		if (typeof(BM) != "undefined" && typeof(BM.MobileApp) != "undefined" &&  BM.MobileApp.isDevice())
//		{
//			location.href = params.url;
//			return;
//		}
//		
		app.closeMenu();
		
		if (params.url.indexOf('tel:') == 0)
		{
			window.location = params.url;
			return;
		}
		else if (params.url.charAt(0) == '/')
		{
			params.url = window.location.protocol + "//" + window.location.hostname +  params.url;
		}
		else if (params.url.indexOf('http') == 0)
		{
		}
		else
		{
			params.url = window.location.protocol + "//" + window.location.hostname + window.location.pathname +  params.url;
		}
		
		this.exec("loadPageStart", params);
	}
	
	app.closeController = function()
	{
		// LECTORED - Commented by module update
//		if (typeof(BM) != "undefined" && typeof(BM.MobileApp) != "undefined" &&  BM.MobileApp.isDevice())
//		{
//			history.back();
//			return;
//		}
		
		this.exec("closeController");
	}
		
	app.showFileChooser = function (context, func)
	{
		var ua = window.navigator.userAgent.toLowerCase();
		if (ua.indexOf("android 4.4") != -1)
		{
			var callbackIndex = this.RegisterCallBack(func);
			return this.exec("showFileChooser", {callback: callbackIndex}, context);
		}
		else
		{
			BX.nextSibling(context).click()
		}
	}

	
	app.reload = function()
	{
		this.exec("reload");
	}
	
	app.RegisterCallBack = function (func)
	{
		if (typeof(func) == "function")
		{
			this.callbackIndex++;
			this.callbacks["callback" + this.callbackIndex] = func;
			return this.callbackIndex;
		}
		
		return 0;
	}

	app.callBackExecute = function(index, result)
	{
		if (this.callbacks["callback" + index] && (typeof this.callbacks["callback" + index]) === "function")
		{
			this.callbacks["callback" + index](result);
		}
	}
	
	
	app.getToken = function (func)
	{
		var callbackIndex = this.RegisterCallBack(func);
		return this.exec("getToken", {callback: callbackIndex});
	}
	
	app.getQRCode = function (func)
	{
		var callbackIndex = this.RegisterCallBack(func);
		return this.exec("getQRCode", {callback: callbackIndex});
	}

	
	app.setColors = function(params)
	{
		this.exec("setColors", params);
	}
	
	
	app.call = function(login, func)
	{
		var callbackIndex = this.RegisterCallBack(func);
		this.exec("call", {login: login, callback: callbackIndex});
	}
	
	
	app.login = function(login, password, func)
	{
		var callbackIndex = this.RegisterCallBack(func);
		this.exec("login", {login: login, password: password, callback: callbackIndex});
	}


	app.getCurrentPosition = function(success, error, options)
	{
		this.exec("getCurrentPosition", {
			success: this.RegisterCallBack(success),
			error: this.RegisterCallBack(error),
			options: options
		});	
	}
	
	app.watchPosition = function(success, error, options)
	{
		return this.exec("watchPosition", {
			success: this.RegisterCallBack(success),
			error: this.RegisterCallBack(error),
			options: options
		});	
	}
	
	app.clearWatch = function(id)
	{
		this.exec("clearWatch", {
			id: id
		});	
	}
	
})(window);

if (typeof(exec) == "object" || typeof(window.webkit) == "object")
{
	navigator.geolocation.getCurrentPosition = function(success, error, options)
	{
		app.getCurrentPosition(success, error, options);
	};
	
	BX.util.popup = function(e)
    {
		return window.open(e);
    }
	
	// LECTORED 2018-10-13 - Probably need to return this (commented by update)
//	navigator.geolocation.watchPosition = function(success, error, options)
//	{
//		return app.watchPosition(success, error, options);
//	};
//	
//	navigator.geolocation.clearWatch = function(id)
//	{
//		app.clearWatch(id);
//	};
}


var _layerAnim = false;
var layers = {
        sh: (!_layerAnim || browser.msie || browser.iphone) ? function(el, done) {
            BX.show(el);
            if (done)
            	done();
        } : function(el, done) {
            //fadeIn(el, 200, done);
        },
        hd: (!_layerAnim || browser.msie || browser.iphone) ? function(el, done) {
            BX.hide(el);
            if (done)
            	done();
        } : function(el, done) {
           // fadeOut(el, 200, done);
        },
	visible: false,	
	_show: function(el, con, opacity, color) {

//        // that's a dirty hack, unless we migrate to cancelStackPush behaviour for esc
//        var key = 'layers' + (__bq.count() + 1);
//        cancelStackPush(key, function() {});
//        setStyle(el, {
//            opacity: opacity || '',
//            backgroundColor: color || ''
//        });
        if (!layers.visible) {
//            toggleFlash();
//            if (browser.mozilla) {
//                window._oldScroll = htmlNode.scrollTop;
//                pageNode.style.height = (_oldScroll + (window.lastWindowHeight || 0)) + 'px';
//                pageNode.style.marginTop = -_oldScroll + 'px';
//            } else {
        		bodyNode.style.overflow = 'hidden';
//            }
        }
        layers.visible = true;
//        addClass(bodyNode, 'layers_shown');
//        if (con.visibilityHide) {
//            removeClass(con, 'box_layer_hidden');
//        } else {
        	BX.show(con);
//        }
        layers.sh(el);
//        pauseLastInlineVideo();
//        window.updateWndVScroll && updateWndVScroll();
    },
    
    
    _hide: function(el, con) {
    	var done = function() {
//            var key = 'layers' + (__bq.count() + 1);
//            cancelStackFilter(key);
//            if (con && con.visibilityHide) {
//                addClass(con, 'box_layer_hidden');
//            } else {
    		BX.hide(con);
//            }
//            if (!isVisible(layerWrap) && !cur._inLayer && (!isVisible(boxLayerWrap) || boxLayerWrap.visibilityHide)
//            && ((window.mvcur && mvcur.minimized)
//            || !isVisible(window.mvLayerWrap))
//            && !isVisible(window.wkLayerWrap)) {
    			layers.visible = false;
//                removeClass(bodyNode, 'layers_shown');
//                toggleFlash(true);
//                if (browser.mozilla) {
//                    pageNode.style.height = 'auto';
//                    pageNode.style.marginTop = '0px';
//                    if (window._oldScroll) {
//                        htmlNode.scrollTop = _oldScroll;
//                    }
//                } else {
                    bodyNode.style.overflow = 'auto';
//                }
//            }
//            window.updateWndVScroll && updateWndVScroll();
    	}
    	layers.hd(el, done);
    }
	//},
};



function showE(pid, parent_section)
{
	return showBox('/bitrix/tools/appforsale_iblock.php?PID=' + pid + "&PARENT_SECTION=" + parent_section);
}



function showBox(url)
{	
	var box = new MessageBox();
	
	BX.show(boxLayerBG);
	
	BX.ajax({
		url: url,
		onsuccess: BX.delegate(function(html) {
			box.show();
			box.content(html);
		}, this),
		onfailure: BX.delegate(function() {
            box.failed = true;
            setTimeout(box.hide, 0);
		}, this)
	});
	
	return box;
}

var _message_box_guid = 0,
	_message_boxes = [];

var __bq = boxQueue = {
	hideAll: function(force, noLoc) {
		if (force) {
			while (__bq.count()) {
				__bq.hideLast();
			}
			return;
		}
		if (__bq.count()) {
			var box = _message_boxes[__bq._boxes.pop()];
			box._in_queue = false;
			box._hide(false, false, noLoc);
		}
		while (__bq.count()) {
			var box = _message_boxes[__bq._boxes.pop()];
			box._in_queue = false;
		}
	},	    
	hideLast: function(check, e) {		
		if (__bq.count())
		{
			var box = _message_boxes[__bq._boxes[__bq.count() - 1]];
//		            if (check === true && (box.changed || __bq.skip || e && e.target && e.target.tagName && e.target.tagName.toLowerCase() != 'input' && cur.__mdEvent && e.target != cur.__mdEvent.target)) {
//		                __bq.skip = false;
//		                return;
//		            }
			box.hide();
		}
//		if (e && e.type == 'click')
//		{
//				alert('click');
//		}
//		            return cancelEvent(e);

	},
	count: function() {
		return __bq._boxes.length;
	},
	_show: function(guid) {
		var box = _message_boxes[guid];
		if (!box || box._in_queue)
			return;
		if (__bq.count()) {
			_message_boxes[__bq._boxes[__bq.count() - 1]]._hide(true, true);
		} // else if (window.tooltips) {
//		            tooltips.hideAll();
//		        }
		box._in_queue = true;
		var notFirst = __bq.count() ? true : false;
		__bq.curBox = guid;
		box._show(notFirst || __bq.currHiding, notFirst);
		__bq._boxes.push(guid);
	},
	_hide: function(guid) {
		var box = _message_boxes[guid];
		if (!box || !box._in_queue || __bq._boxes[__bq.count() - 1] != guid || !box.isVisible())
			return;
		box._in_queue = false;
		__bq._boxes.pop();
		box._hide(__bq.count() ? true : false);
		if (__bq.count())
		{
			var prev_guid = __bq._boxes[__bq.count() - 1];
			__bq.curBox = prev_guid;
			_message_boxes[prev_guid]._show(true, true, true);
		}
	},	
	_boxes: [],
	curBox: 0	
}

function MessageBox()
{
	var boxContainer,
		boxLayout;
	var boxTitleWrap,
		boxTitle,
		boxCloseButton,
		boxBody;
	var guid = _message_box_guid++,
		visible = false;

	boxContainer = BX.create('div', {props: {className: 'popup_box_container'}, html: '<div class="box_layout"><div class="box_title_wrap afs-color"><div class="box_x_button"></div><div class="box_title"></div></div><div class="box_body"></div></div>'});
	boxLayout = BX.firstChild(boxContainer);
	boxTitleWrap = BX.firstChild(boxLayout);
	boxCloseButton = BX.firstChild(boxTitleWrap);
	boxTitle = BX.nextSibling(boxCloseButton);
	boxBody = BX.nextSibling(boxTitleWrap);

	BX.append(boxContainer, boxLayer);
	boxContainer.setAttribute('tabindex', 0);
	// BX.focus(boxContainer);
	
	var destroyMe = function() {
//	        if (isFunction(options.onClean))
//	            options.onClean();
//	        if (isFunction(options.onDestroy))
//	            options.onDestroy();
//	        removeButtons();
//	        cleanElems(boxContainer, boxCloseButton, boxTitleWrap, boxControlsWrap);
		BX.remove(boxContainer);
		delete _message_boxes[guid];
	}
	 
    var hideMe = function(showingOther, tempHiding, noLoc)
    {
    	if (!visible)
    		return;
    	visible = false;
//
//        var speed = (showingOther === true) ? 0 : options.animSpeed;
//
//        if (options.hideOnBGClick) {
//            removeEvent(document, 'click', __bq.hideBGClick);
//        }
//
//        if (isFunction(options.onBeforeHide)) {
//            options.onBeforeHide();
//        }
//
//        if (_layerAnim && !showingOther) {
//            layers.boxhide();
//        }
//
        var onHide = function() {
            if (__bq.currHiding == _message_boxes[guid]) {
                __bq.currHiding = false;
            }
    
            if (!_layerAnim && !_message_boxes[guid].shOther && !showingOther) {
                layers.boxhide();
            }
            	if (!tempHiding) {
            	//if (!tempHiding && options.selfDestruct) {
            	
            		destroyMe();
            	}
            	else
            	{
            		BX.hide(boxContainer);
            	}

//            if (isFunction(options.onHide)) {
//                options.onHide(noLoc);
//            }
        }
//        if (speed > 0) {
//            __bq.currHiding = _message_boxes[guid];
//            fadeOut(boxContainer, speed, onHide);
//        } else {
    		onHide();
//        }
    }
    // Show box
    function showMe(noAnim, notFirst, isReturned) {
    	if (visible || !_message_boxes[guid])
    		return;
    	
    	visible = true;
//
//        var speed = (noAnim === true || notFirst) ? 0 : options.animSpeed;
//
//        if (options.hideOnBGClick) {
//            addEvent(document, 'click', __bq.hideBGClick);
//        }
//
//        // Show blocking background
        if (!notFirst) {
    		layers.boxshow();
        }
//
//        if (__bq.currHiding) {
//            __bq.currHiding.shOther = true;
//            var cont = __bq.currHiding.bodyNode.parentNode.parentNode;
//            data(cont, 'tween').stop(true);
//        }
//
//        // Show box
//        if (speed > 0) {
//            fadeIn(boxContainer, speed);
//        } else {
    		BX.show(boxContainer);
//        }
//
//        boxRefreshCoords(boxContainer);
//        if (options.onShow) {
//            options.onShow(isReturned);
//        }
//
    	_message_box_shown = true;
    }
    
//	jsUtils.addEvent(boxCloseButton, 'click', __bq.hideLast);
	boxCloseButton.addEventListener('click', __bq.hideLast);
	
	var retBox = _message_boxes[guid] = {
		guid: guid,
		_show: showMe,
		_hide: hideMe,
		show: function() {
            __bq._show(guid);
            return this;
        },
        hide: function(attemptParam) {
           // if (isFunction(options.onHideAttempt) && !options.onHideAttempt(attemptParam))
             //   return false;
            __bq._hide(guid);
            return true;
        },
        isVisible: function() {
            return visible;
        },
        content: function(html) {
//            if (options.onClean)
//                options.onClean();
        	BX.html(boxBody, html);
//            boxRefreshCoords(boxContainer);
        	BX.focus(boxContainer);
//            refreshBox();
//            updateAriaElements();
            return this;
        },
	};
	
	return retBox;
}

function onBodyResize()
{
	if (!BX.admin)
	{
		var menu = BX('menu2');
		var pageWrap = BX('afs-page-wrap');
		if (!!menu && !!pageWrap)
		{
			pageWrap.style.marginTop = menu.offsetHeight + "px";
		}
	}
}

function domStarted()
{
	onBodyResize();
	
	window.bodyNode = document.getElementsByTagName('body')[0];
    
	var bl = BX('box_layer_bg'),
		blw = BX.nextSibling(bl);
	
	window.boxLayerBG = bl;
	window.boxLayerWrap = blw;
	window.boxLayer = BX.firstChild(blw);
	
	
	layers.boxshow = function() { layers._show(bl, blw); }
	layers.boxhide = function() { layers._hide(bl, blw); }
	
	//BX.extend(layers._show(bl, blw), layers.boxshow);
	//layers.boxshow = layers._show(bl, blw);
	//layers.boxhide = layers._hide(bl, blw);	
}