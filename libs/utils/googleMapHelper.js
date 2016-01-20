GoogleMapHelper = function (){
	this.map;
	this.markers = [];
	this.pointMarker = null;
};

GoogleMapHelper.prototype.drawMap = function(lat, lng, zoom, withMarker){
	this.map.setCenter({lat: lat, lng: lng});
	this.map.setZoom(zoom);
	if (withMarker) this.drawPointMarker(lat, lng);
};

GoogleMapHelper.prototype.drawPointMarker = function(lat, lng){
	if (this.pointMarker) this.pointMarker.setMap(null);
	this.pointMarker = new google.maps.Marker({
		map: this.map,
		position: {lat: lat, lng: lng}
	});
};

GoogleMapHelper.prototype.addMarker = function(lat, lng){
	var marker = new google.maps.Marker({
		map: this.map,
		position: {lat: lat, lng: lng}
	});
	this.markers.push(marker);
};

GoogleMapHelper.prototype.getCenter = function(){
	return {
		lat: this.map.getCenter().lat(),
		lng: this.map.getCenter().lng()
	}
};

GoogleMapHelper.prototype.getDirection = function(){

};


getLatLng = function(addressEnglish){
	var baseURL = "https://maps.googleapis.com/maps/api/geocode/json?address=";
	var url = baseURL + addressEnglish;
	//var temp = $.get(url);
	var temp = $.ajax({
		url: encodeURI(url),
		method: "GET",
		dataType: "json",
		async: false
	});
	if (temp.statusText == google.maps.GeocoderStatus.OK){
		return{
			lat: temp.responseJSON.results[0].geometry.location.lat,
			lng: temp.responseJSON.results[0].geometry.location.lng
		}
	}else return null
};


GoogleMapBuilder = function(container, lat, lng, zoom, withMarker){
	var googleMap = new GoogleMapHelper();
	googleMap.map = new google.maps.Map(container,{
		center: {lat: lat, lng: lng},
		zoom: zoom
	});
	if (withMarker) googleMap.drawPointMarker(lat, lng);
	return googleMap;
};