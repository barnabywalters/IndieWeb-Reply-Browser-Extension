kango.Browser=function(){this.superclass.apply(this,arguments);this._ports={};chrome.tabs.onActiveChanged.addListener(kango.lang.bind(this._onTabChanged,this));chrome.tabs.onCreated.addListener(kango.lang.bind(this._onTabCreated,this));chrome.tabs.onRemoved.addListener(kango.lang.bind(this._onTabRemoved,this));chrome.webNavigation.onBeforeNavigate.addListener(kango.lang.bind(this._onBeforeNavigate,this));chrome.webNavigation.onDOMContentLoaded.addListener(kango.lang.bind(this._onDOMContentLoaded,
this))};
kango.Browser.prototype=kango.oop.extend(kango.BrowserBase,{_ports:{},_registerPortForTab:function(a,b,c){this._ports[a]=this._ports[a]||{};this._ports[a][b]=c},_unregisterPortForTab:function(a,b){"undefined"!=typeof this._ports[a]&&(delete this._ports[a][b],0==kango.object.getKeys(this._ports[a]).length&&delete this._ports[a])},_unregisterTabPorts:function(a){delete this._ports[a]},_getPortsForTab:function(a){return this._ports[a]||null},_onBeforeNavigate:function(a){if(0==a.frameId){var b=this;
chrome.tabs.get(a.tabId,function(c){"undefined"!=typeof c&&(c={url:a.url,target:new kango.BrowserTab(c,b._getPortsForTab(c.id))},b.fireEvent(b.event.BEFORE_NAVIGATE,c))})}},_onDOMContentLoaded:function(a){if(0==a.frameId){var b=this;chrome.tabs.get(a.tabId,function(c){"undefined"!=typeof c&&(c={url:a.url,title:c.title,target:new kango.BrowserTab(c,b._getPortsForTab(c.id))},b.fireEvent(b.event.DOCUMENT_COMPLETE,c))})}},_onTabCreated:function(a){this.fireEvent(this.event.TAB_CREATED,{tabId:a.id,target:new kango.BrowserTab(a,
this._getPortsForTab(a.id))})},_onTabRemoved:function(a){this._unregisterTabPorts(a);this.fireEvent(this.event.TAB_REMOVED,{tabId:a})},_onTabChanged:function(a){var b=this;chrome.tabs.get(a,function(c){"undefined"!=typeof c&&(c={url:c.url,title:c.title,tabId:a,target:new kango.BrowserTab(c,b._getPortsForTab(c.id))},b.fireEvent(b.event.TAB_CHANGED,c))})},getName:function(){return"chrome"},getCookies:function(a,b){chrome.cookies.getAll({url:a},function(a){b(kango.array.map(a,function(a){return{name:a.name,
value:a.value,domain:a.domain,hostOnly:a.hostOnly,path:a.path,secure:a.secure,httpOnly:a.httpOnly,session:a.session,expires:a.expirationDate}}))})},getCookie:function(a,b,c){chrome.cookies.get({url:a,name:b},function(a){var b=null;null!=a&&(b={name:a.name,value:a.value,domain:a.domain,hostOnly:a.hostOnly,path:a.path,secure:a.secure,httpOnly:a.httpOnly,session:a.session,expires:a.expirationDate});c(b)})},setCookie:function(a,b){var c={url:a,name:b.name,value:b.value};void 0!=typeof b.expires&&(c.expirationDate=
b.expires);chrome.cookies.set(c)},windows:{getAll:function(a){chrome.windows.getAll({populate:!1},function(b){a(kango.array.map(b,function(a){return new kango.BrowserWindow(a)}))})},getCurrent:function(a){chrome.windows.getCurrent(function(b){a(new kango.BrowserWindow(b))})},create:function(a){chrome.windows.create({url:a.url,type:a.type,width:a.width,height:a.height})}},tabs:{getAll:function(a){chrome.tabs.query({windowType:"normal"},function(b){a(kango.array.map(b,function(a){return new kango.BrowserTab(a,
kango.browser._getPortsForTab(a.id))}))})},getCurrent:function(a){chrome.windows.getCurrent(function(b){chrome.tabs.getSelected(b.windowId,function(b){a(new kango.BrowserTab(b,kango.browser._getPortsForTab(b.id)))})})},create:function(a){chrome.tabs.create({url:a.url,active:"undefined"!=typeof a.focused?a.focused:!0})}}});kango.BrowserWindow=function(a){this._window=a};
kango.BrowserWindow.prototype=kango.oop.extend(kango.IBrowserWindow,{_window:null,getTabs:function(a){chrome.tabs.getAllInWindow(this._window.windowId,function(b){a(kango.array.map(b,function(a){return new kango.BrowserTab(a,kango.browser._getPortsForTab(a.id))}))})},getCurrentTab:function(a){chrome.tabs.getSelected(this._window.windowId,function(b){a(new kango.BrowserTab(b,kango.browser._getPortsForTab(b.id)))})},isActive:function(){return this._window.focused}});
kango.BrowserTab=function(a,b){this._tab=a;this._ports=b};
kango.BrowserTab.prototype=kango.oop.extend(kango.IBrowserTab,{_tab:null,_port:null,getId:function(){return this._tab.id},getUrl:function(){return this._tab.url},getTitle:function(){return this._tab.title},getDOMWindow:function(){return null},isActive:function(){return this._tab.active},navigate:function(a){chrome.tabs.update(this._tab.id,{url:a})},dispatchMessage:function(a,b){if(null!=this._ports&&0!=this.getUrl().indexOf("chrome://")){var c={name:a,data:b,origin:"background",target:null,source:null},
d;for(d in this._ports)this._ports.hasOwnProperty(d)&&this._ports[d].postMessage(c);return!0}return!1},close:function(){chrome.tabs.remove(this.getId())}});kango.browser=new kango.Browser;
