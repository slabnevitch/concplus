(function(window) {
	if (!!window.JCLeftMenu)
		return;
	
	window.JCLeftMenu = function(arParams)
	{
		this.signedParamsString = '';
		this.obItems = null;
		this.test = 'Test';
		this.isContractor = false;
		this.closeMenu = 'Y';
		this.switchShow = 'N';
		this.switchLeftName = '';
		this.switchLeftLink = '';
		this.switchLeftTitle = '';
		this.switchRightName = '';
		this.switchRightLink = '';
		this.switchRightTitle = '';
		
		this.obSwitchLeft = null;
		this.obSwitchRight = null;
		

		
		this.templateFolder = null;
		this.AJAX = false;
		this.ASIDE_BG = '#FFFFFF';
		this.ASIDE_LOGIN_BG = 'default';

		this.LEFT = 'N';
		this.menuBlockId = 1;
		
		if ('object' === typeof arParams)
		{
			this.signedParamsString = arParams.signedParamsString;
			this.isContractor = arParams.isContractor;
			this.closeMenu = arParams.closeMenu;

			this.switchShow = arParams.switchShow;
			this.switchLeftName = arParams.switchLeftName;
			this.switchLeftLink = arParams.switchLeftLink;
			this.switchLeftTitle = arParams.switchLeftTitle;
			this.switchRightName = arParams.switchRightName;
			this.switchRightLink = arParams.switchRightLink;
			this.switchRightTitle = arParams.switchRightTitle;
			
			this.templateFolder = arParams.templateFolder;
			this.AJAX = arParams.AJAX;
			this.LEFT = arParams.LEFT;
			this.ASIDE_BG = arParams.ASIDE_BG;
			this.ASIDE_LOGIN_BG = arParams.ASIDE_LOGIN_BG;
		}
		
		BX.ready(BX.delegate(this.Init, this));
	}
	
	window.JCLeftMenu.prototype.Init = function()
	{
		if (this.ASIDE_LOGIN_BG == 'default')
		{
			BX.addClass(BX("afs-aside-header"), "afs-color");
		}
		else
		{
			BX("afs-aside-header").style.background = this.ASIDE_LOGIN_BG;
		}
				
		this.resizeMenu();
		BX.bind(window, 'resize', BX.proxy(this.resizeMenu, this));
		
		if (this.AJAX == false)
		{
			if (this.LEFT == 'Y')
			{
				BX.addCustomEvent("OnAfterUserRegister", BX.delegate(updateUser, this));
				BX.addCustomEvent("OnAfterUserLogin", BX.delegate(updateUser, this));
				BX.addCustomEvent("OnAfterUserUpdate", BX.delegate(updateUser, this));
				BX.addCustomEvent("OnAfterUserLogout", BX.delegate(updateUser, this));
				BX.addCustomEvent("OnNotificationCount", BX.delegate(function() {
					
					BX.hide(BX('notification_count'));
					
				}, this));
			}
			app.enableMenu(true);
			
			var native = window.getComputedStyle(BX('native'));
			app.setColors({
					background: this.rgb2hex(native.backgroundColor),
					titleText: this.rgb2hex(native.color)
			});		
			
			app.getToken(BX.delegate(this.registerDevice, this));
		}
	}
	
	window.JCLeftMenu.prototype.OnSwitch = function()
	{
		if (!!this.obSwitchLeft)
			this.obSwitchLeft.setAttribute('disabled', 'disabled');
		
		if (!!this.obSwitchRight)
			this.obSwitchRight.setAttribute('disabled', 'disabled');
		
		var ob = BX.proxy_context;
		
		BX.ajax({
			url: this.templateFolder + '/contractor.php',
			method: 'POST',
			data: {
				signedParamsString: this.signedParamsString,
				contractor: (BX.hasClass(BX.proxy_context, 'contractor') ? 'Y' : 'N')
			},
			onsuccess: BX.delegate(function() {

				app.onCustomEvent("OnAfterUserUpdate");
				
				if (this.closeMenu == 'Y')
					app.closeMenu();
				
				if (ob.href)
				{
					app.loadPageStart({
						url: ob.href,
						title: ob.title,
						closeMenu: false
					});
				}
				
			}, this),
			onfailure: BX.delegate(function() {
				
				if (!!this.obSwitchLeft)
					this.obSwitchLeft.removeAttribute('disabled');
				
				if (!!this.obSwitchRight)
					this.obSwitchRight.removeAttribute('disabled');
				
			}, this)
		});
		
		return BX.PreventDefault();
	}
	
	window.JCLeftMenu.prototype.resizeMenu = function()
	{

		if (BX('menu2').style.display != 'none')
			{
		var menuMobile = document.body.querySelector("[data-role='afs-menu-mobile']");
		var menuMobileButton = document.body.querySelector("[data-role='afs-menu-button-mobile']");
		
		if (document.body.clientWidth <= 1200)
		{
			if (!menuMobile)
			{
				var switchContainer;
				if (this.switchShow == 'Y')
				{
					switchContainer = BX.create('div', {
						props: {
							className: 'afs-aside-footer'
						},
						html: '<div class="col-md-12 text-center"><div class="btn-group"><a class="btn ' + (this.isContractor ? 'btn-default' : 'btn-primary') + '"' + (this.switchLeftLink ? ' href="' + this.switchLeftLink + '"' : '') + ' title="' + this.switchLeftTitle + '">' + this.switchLeftName + '</a><a class="btn ' + (this.isContractor ? 'btn-primary' : 'btn-default') + ' contractor"' + (this.switchRightLink ? ' href="' + this.switchRightLink + '"' : '') + ' title="' + this.switchRightTitle + '">' + this.switchRightName + '</a></div></div>'
					});
					
					switchWrap = BX.firstChild(switchContainer);
					switchGroup = BX.firstChild(switchWrap);
					this.obSwitchLeft = BX.firstChild(switchGroup);
					this.obSwitchRight = BX.nextSibling(this.obSwitchLeft);
					
					BX.bind(this.obSwitchLeft, 'click', BX.proxy(this.OnSwitch, this));
					BX.bind(this.obSwitchRight, 'click', BX.proxy(this.OnSwitch, this));
				}
				
				this.obItems = BX.clone(BX("ul_" + this.menuBlockId));
				BX.bind(this.obItems, 'click', BX.delegate(this.onItemClick, this));
				
				
				menuMobile = BX.create("div", {
					attrs: {
						className: "afs-aside-nav",
						"data-role" : "afs-menu-mobile",
						"style": "background: " + this.ASIDE_BG
					},
					children: [ BX.clone(BX("afs-aside-header")), this.obItems, switchContainer ]
				});
				document.body.insertBefore(menuMobile, document.body.firstChild);
			}
			
			if (!menuMobileButton)
			{
				menuMobileButton = BX.create("div", {
					attrs: {className: "afs-aside-nav-control afs-closed", "data-role" : "afs-menu-button-mobile"},
					children: [
						BX.create("i", {
							attrs: {className: "fa fa-bars"}
						})
					],
					events: {
						"click" : function() {
							if (BX.hasClass(this, "afs-opened"))
							{
								BX.removeClass(this, 'afs-opened');
								BX.removeClass(menuMobile, 'afs-opened');
								BX.addClass(this, 'afs-closed');
								document.body.style.overflow = "";
								BX.removeClass(document.body, 'afs-opened');
							}
							else
							{

								BX.addClass(this, 'afs-opened');
								BX.addClass(menuMobile, 'afs-opened');
								BX.removeClass(this, 'afs-closed');
								document.body.style.overflow = "hidden";
								BX.addClass(document.body, 'afs-opened');
							}
						}
					}
				});

				document.body.insertBefore(menuMobileButton, document.body.firstChild);
				
				if (window.isMobileAppPage != 'Y')
				{
				    $('<div class="top_sosedi_link_wrap"><a href="/">Все Cоседи</a></div>').insertAfter('.afs-aside-nav-control');
				}
				
			}
		}
		else
		{
			BX.removeClass(menuMobile, 'afs-opened');
			BX.removeClass(document.body, 'afs-opened');
			document.body.style.overflow = "";

			if (menuMobileButton)
				BX.removeClass(menuMobileButton, 'afs-opened');
		}
			}
	}
	
	window.JCLeftMenu.prototype.rgb2hex = function(rgb) {
		
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		var r = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		var h = '#' + hex(r[1]) + hex(r[2]) + hex(r[3]);
		return h.toUpperCase();
	}
	
	
	
	window.JCLeftMenu.prototype.registerDevice = function(data)
	{
		BX.ajax({
	        url: this.templateFolder + "/registerDevice.php",
	        data: {
	        	DEVICE_ID: data.DEVICE_ID,
	        	DEVICE_TYPE: data.DEVICE_TYPE,
	        	DEVICE_NAME: data.DEVICE_NAME,
	        	DEVICE_MODEL: data.DEVICE_MODEL,
	        	SYSTEM_VERSION: data.SYSTEM_VERSION,
	        	TOKEN: data.TOKEN
			},
	        method: 'POST'
	    });	
	}
	
	function updateUser(data)
	{
		app.getToken(BX.delegate(this.registerDevice, this));
		
		BX.ajax.Setup(
			{
				denyShowWait: true
			},
			true
		);  
		BX.ajax.insertToNode(
			location.href,
			document.body
		);
	}
	
	window.setLocation = function(lat, lng)
	{
		BX.ajax({
	        url: "/service/api/setLocation.php",
	        data: {
	        	lat: lat,
	        	lng: lng
			},
	        method: 'POST'
	    });	
	}
	
	window.JCLeftMenu.prototype.onItemClick = function(event)
	{
		var target = event.target;
		while (target != this.obItems)
		{
			if (target && target.nodeType && target.nodeType == 1 && target.tagName == 'LI')
			{
				var sel = BX.findChild(this.obItems, {className: 'afs-selected'});
				if (sel)
					BX.removeClass(sel, "afs-selected");
				
				if (!BX.hasClass(target, "afs-selected"))
					BX.addClass(target, "afs-selected");

				return;
			}
			target = target.parentNode;
		}
	}
	
})(window);