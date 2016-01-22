const {PropTypes} = React;

PolyhyComponent = React.createClass({
	render:function(){
		return false;
	}
});

PolyhyComponent.InputAddressWithMap = React.createClass({
	googleMap: null,
	propTypes: {
		width: PropTypes.string.isRequired,
		height: PropTypes.string.isRequired,
		placeholder: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired,
		detail: PropTypes.bool
	},
	componentDidMount: function(){
		var mapView = this.refs.mapView;
		this.googleMap = GoogleMapBuilder(mapView, 37.5506241, 126.9192726, 18);
	},
	findAddress: function(event){
		var googleMap = this.googleMap;
		var inputAddress = this.refs.inputAddress;
		var inputLat = this.refs.inputLat;
		var inputLng = this.refs.inputLng;
		new daum.Postcode({
			oncomplete: function(data) {
				event.target.blur();
				var tempAddress ={
					address: data.address,
					addressEnglish: data.addressEnglish,
					latlng: getLatLng(data.addressEnglish)
				};
				if (tempAddress.latlng){
					inputAddress.value = data.address;
					inputLat.value = tempAddress.latlng.lat;
					inputLng.value = tempAddress.latlng.lng;
					googleMap.drawMap(tempAddress.latlng.lat, tempAddress.latlng.lng, 18, true);
				}else{
					$(this.refs.warning).text("잘못된 주소입니다");
				}
			}
		}).open({ popupName: "postcodePopup"});
	},
	render:function(){
		return (
				<div className="form-group" style={{width:this.props.width}}>
					<label htmlFor={this.props.name}>{this.props.label}</label>
					<input type="text" className="form-control" ref="inputAddress"
								 name={this.props.name}
								 placeholder={this.props.placeholder}
								 onFocus={this.findAddress}/>
					<input type="text" className={"form-control"+(this.props.detail?"":" hide")}
								 name={this.props.name+"-detail"}
								 placeholder="상세주소" style={{marginTop: "6px"}}/>
					<input type="text" className="form-control hide" ref="inputLat"
								 name={this.props.name+"-lat"} disabled/>
					<input type="text" className="form-control hide" ref="inputLng"
								 name={this.props.name+"-lng"} disabled/>
					<div ref="mapView" style={{width:"100%", height:this.props.height}}>
					</div>
					<p className="warn" ref="warning"></p>
				</div>
		)
	}
});

PolyhyComponent.Map = React.createClass({
	propTypes: {
		width: PropTypes.string.isRequired,
		height: PropTypes.string.isRequired,
		lat: PropTypes.number.isRequired,
		lng: PropTypes.number.isRequired,
		zoom: PropTypes.number.isRequired,
		marker: PropTypes.bool.isRequired
	},
	componentDidMount: function(){
		var mapView = this.refs.map;
		const{lat, lng, zoom, marker} = this.props;
		this.googleMap = GoogleMapBuilder(mapView, lat, lng, zoom, marker);
	},
	render: function(){
		return (
				<div ref = "map"
						 style={{width:this.props.width, height:this.props.height}}>
				</div>
		)
	}
});


PolyhyComponent.RatingStar = React.createClass({
	renderStars: function(count){
		return _.range(count).map(
				i=>(
					<span key={"star-"+i}>
						<input type="radio" name="rating" value={count-i}></input><i className="fa fa-star-o"></i>
					</span>
				)
		);
	},
	componentDidMount:function(){
		var inputRatingScore = this.refs.ratingScore;
		var $parent = $(this.refs.rate);
		var $targert = $(this.refs.rate).children("span").children("i");
		$targert.on('click', function(e){
			$parent.children("span.active").removeClass("active");
			$(this).parent("span").addClass("active");
			$(this).prev("input").prop("checked", "true");
			inputRatingScore.value = $(this).prev("input").val();
		});
	},
	render:function(){
		return (
				<div className="form-group">
					<label htmlFor={this.props.name}>{this.props.label}</label>
					<div className="rating-star">
						<fieldset ref="rate">
							{this.renderStars(this.props.starCount)}
						</fieldset>
					</div>
					<input type="text"
								 className="form-control hide"
								 name={this.props.name} ref="ratingScore"
								 disabled/>
				</div>
		);
	}
});


PolyhyComponent.InputText = React.createClass({
	propTypes: {
		name: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		placeholder: PropTypes.string,
		pass: PropTypes.bool
	},
	render:function(){
		return(
				<div className="form-group">
					<label htmlFor={this.props.name}>{this.props.label}</label>
					<input type={this.props.pass ? "password" : "text"}
								 className="form-control"
								 name={this.props.name}
								 placeholder={this.props.placeholder}
								 defaultValue={this.props.value? this.props.value: ""}/>
				</div>
		)
	}
});

PolyhyComponent.TextArea = React.createClass({
	propTypes: {
		name: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired
	},
	render:function(){
		return(
				<div className="form-group">
					<label htmlFor={this.props.name}>{this.props.label}</label>
					<textarea type={this.props.pass ? "password" : "text"}
										className="form-control"
										name={this.props.name}
										style={{height: "72px"}}/>
				</div>
		)
	}
});

PolyhyComponent.UploadPhoto = React.createClass({
	propTypes: {
		name: PropTypes.string.isRequired,
		label: PropTypes.string.isRequired,
		count: PropTypes.number.isRequired,
		images: PropTypes.array.isRequired
	},
	readImage: function(event){
		if (event.target.files && event.target.files[0]) {
			var arrImages = this.props.images;
			var $uploadedImages = $(this.refs.uploaded);
			var tempImageCount = arrImages.length;

			for (var i=0; i<event.target.files.length; i++){
				if(this.props.count==-1 || tempImageCount < this.props.count){
					tempImageCount++;
					$(this.refs.warning).text("");
					var reader = new FileReader();
					reader.onload = function(e) {
						var tag = "<div class='appended-image'><img src='#'/><span><i class='fa fa-times'></i></span></div>";
						arrImages.push(e.target.result);
						$uploadedImages.append(tag);
						$uploadedImages.find('img').last().attr('src', e.target.result);
						$uploadedImages.find('span').on('click', function(e){
							var $image = $(this).parent();
							var index = $uploadedImages.children().index($image);
							if (index>-1){
								$image.remove();
								arrImages.splice(index, 1);
							}
						});
					};
					reader.readAsDataURL(event.target.files[i]);
				} else{
					$(this.refs.warning).text("사진은 "+this.props.count+"장 까지 업로드 할 수 있습니다");
					break;
				}
			}
		}
	},
	render:function(){
		return(
				<div className="form-group polyhy--add-photo">
					<label htmlFor={this.props.name}>{this.props.label}</label>
					<input type="file" ref="inputTag" accept="image/*"
								 className="" name={this.props.name}
								 onChange={this.readImage} multiple="true"/>
					<div className="btn-file-upload"
							 onClick={(event)=>{$(this.refs.inputTag).trigger('click')}}>
						<i className="fa fa-plus-circle"></i>
					</div>
					<div className="file-upload-images" ref="uploaded"/>
					<p className="warn" ref="warning"></p>
				</div>
		)
	}
});

PolyhyComponent.ImageGallery = React.createClass({
	propTypes: {
		imageURLs: PropTypes.arrayOf(PropTypes.string).isRequired,
		imageSize: PropTypes.number.isRequired
	},
	renderImages: function(imageURLs){
		return imageURLs.map(
				imageURL =>(
						<div className="image-gallery" key={imageURL}
								 style={{	backgroundImage: "url("+imageURL+")",
								 					width: this.props.imageSize+"px", height: this.props.imageSize+"px",
								 					display: "inline-block"}}/>
				)
		);
	},
	render: function(){
		return (
				<div className="image-gallery">
					{this.renderImages(this.props.imageURLs)}
				</div>
		);
	}
});

