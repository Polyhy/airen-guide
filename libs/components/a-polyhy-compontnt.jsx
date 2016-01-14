const {PropTypes} = React;

PolyhyComponent = React.createClass({
	render:function(){
		return false;
	}
});

PolyhyComponent.InputAddressAndMap = React.createClass({
	googleMap: null,
	propTypes: {
		width: PropTypes.string.isRequired,
		height: PropTypes.string.isRequired,
		placeholder: PropTypes.string.isRequired,
		name: PropTypes.string.isRequired
	},
	componentDidMount: function(){
		var mapView = this.refs.mapView;
		this.googleMap = GoogleMapBuilder(mapView, 37.5506241, 126.9192726, 18);
	},
	findAddress: function(){
		var googleMap = this.googleMap;
		var inputAddress = this.refs.inputAddress;
		new daum.Postcode({
			oncomplete: function(data) {
				var teamAddress ={
					address: data.address,
					addressEnglish: data.addressEnglish,
					latlng: getLatLng(data.addressEnglish)
				};
				if (teamAddress.latlng){
					googleMap.drawMap(teamAddress.latlng.lat, teamAddress.latlng.lng, 18, true);
					inputAddress.value = data.address;
				}
			}
		}).open();
	},
	render:function(){
		return (
				<div className="form-group" style={{width:this.props.width}}>
					<label htmlFor={this.props.name}>{this.props.label}</label>
					<input type="text" className="form-control" ref="inputAddress"
								 name={this.props.name}
								 placeholder={this.props.placeholder}
								 onClick={this.findAddress}/>
					<div ref="mapView" style={{width:"100%", height:this.props.height}}>
					</div>
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
		return _.range(count).map((i)=>{
			return(
					<span key={"star-"+i}>
						<input type="radio" name="rating" value={count-i}></input>
						<i className="fa fa-star-o"></i>
					</span>
			);
		})
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
								 placeholder={this.props.placeholder}/>
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
			if(this.props.count==-1 || this.props.images.length < this.props.count){
				var reader = new FileReader();
				var arrImages = this.props.images;
				var $uploadedImages = $(this.refs.uploaded);
				reader.onload = function(e) {
					var tag = "" +
							"<div class='appended-image'>" +
							"<img src='#'/>" +
							"<span><i class='fa fa-times'></i></span>" +
							"</div>";
					arrImages.push(e.target.result);
					$uploadedImages.append(tag);
					$uploadedImages.find('img:last').attr('src', e.target.result);
					$uploadedImages.find('span').on('click', function(e){
						var $image = $(this).parent();
						var index = $uploadedImages.children().index($image);
						if (index>-1){
							$image.remove();
							arrImages.splice(index, 1);
							console.log(arrImages);
						}
					});
				};
				reader.readAsDataURL(event.target.files[0]);
			}else{
				$(this.refs.warning).text("사진은 "+this.props.count+"장 까지 업로드 할 수 있습니다");
				console.log(this.props.images)
			}
		}
	},
	render:function(){
		return(
				<div className="form-group polyhy--add-photo">
					<label htmlFor={this.props.name}>{this.props.label}</label>
					<input type="file" ref="inputTag" accept="image/*"
								 className="" name={this.props.name}
								 onChange={this.readImage}/>
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


