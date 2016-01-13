var CookieHelper = (function(){

	var constructor = function (){};
	constructor.prototype.setCookie = function (key, value, expire){
		var cookie = key + '=' + escape(value) + '; path=/ ';
		var _expire;
		if(expire != undefined && expire.constructor == Date) _expire = expire;
		else {
			_expire = new Date();
			if (expire != undefined  && typeof expire === "number")
				_expire.setDate(_expire.getDate() + expire );
			else
				_expire.setDate(_expire.getDate() + 3650 );
		}
		cookie += ';expires=' + _expire.toGMTString() + ';';
		document.cookie = cookie;
	};

	constructor.prototype.getCookie = function(key){
		var _key = key + '=';
		var cookieData = document.cookie;
		var start = cookieData.indexOf(_key);
		if(start > -1){
			start += _key.length;
			var end = cookieData.indexOf(';', start);
			if(end == -1)end = cookieData.length;
			return unescape(cookieData.substring(start, end));
		}
		else return null;
	};

	constructor.prototype.deleteCookie = function(key){
		var temp = this.getCookie(key);
		var t = new Date();
		var cookie = key + '=' + escape("") + '; path=/ ';
		cookie += ';expires=' + t.toGMTString() + ';';
		document.cookie = cookie;
		return temp;
	};

	constructor.prototype.clearCookie = function(){
		var cookies = document.cookie.split("; ");
		for (var i in cookies){
			var key = cookies[i].split("=")[0];
			this.deleteCookie(key);
		}
	};

	var _instance;
	return function(){
		if (_instance === undefined) _instance = new constructor();
		return _instance;
	};

})();

cookieHelper = new CookieHelper();