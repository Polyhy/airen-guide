isMobileDevice = function(){
	var mobileKeyWords =[	'Android', 'iPhone', 'iPod', 'BlackBerry', 'Windows CE',
										'SAMSUNG', 'LG', 'MOT', 'SonyEricsson'];
	var userAgent = navigator.userAgent;
	var isMobile = false;
	for (var i in mobileKeyWords){
		if(userAgent.match(mobileKeyWords[i])){
			isMobile = true;
			break;
		}
	}
	return isMobile;
};