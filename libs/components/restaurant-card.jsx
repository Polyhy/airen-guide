const {PropTypes} = React;

RestaurantElement = React.createClass({
	render: function(){
		return false;
	}
});

//
//	Page 1
//
RestaurantElement.Page1 = React.createClass({
	getImageURL: function(){
		var imageId = this.props.restaurant.images[0];
		if(RestaurantImages.findOne({_id: imageId}))
			return RestaurantImages.findOne({_id: imageId}).url();
		else
			return null;
	},
	renderTableRow: function() {
		var restaurantInfo = this.props.getRestaurantInfo;
		var count = 0;
		return restaurantInfo.map((i)=>{
			return (
					<tr key={"menu-"+count++}>
						<td className="key">{i[0]}</td>
						<td >:</td>
						<td className="value">{i[1]}</td>
					</tr>
			)
		})
	},
	render: function(){
		return (
				<div>
					<div className="image-wrapper" style={{backgroundImage: "url("+this.getImageURL()+")"}}>
						{/*<img src={this.getImageURL()} />*/}
					</div>
					<table className="info">
						<tbody>
							{this.renderTableRow()}
						</tbody>
					</table>
					{this.props.renderButton? this.props.renderButton(): false}
				</div>
		)
	}
});

//
//	Page 2
//
RestaurantElement.Page2 = React.createClass({
	propTypes: {
		//vote: PropTypes.bool.isRequired
	},
	renderTableRow: function() {
		var restaurantInfo = this.props.getRestaurantInfo;
		var count = 0;
		return restaurantInfo.map((i)=>{
			return (
					<tr key={"menu-"+count++}>
						<td className="key">{i[0]}</td>
						<td >:</td>
						<td className="value" style={{whiteSpace: "normal"}}>{i[1]}</td>
					</tr>
			)
		})
	},
	render: function(){
		var restaurant = this.props.restaurant;
		return (
				<div>
					<div className="map-wrapper">
						<PolyhyComponent.Map width={"100%"} height={"200px"}
																 lat={restaurant.latlng.lat}
																 lng={restaurant.latlng.lng}
																 zoom={18} marker={true}/>
						<table className="info">
							<tbody>
							{this.renderTableRow()}
							</tbody>
						</table>
						{this.props.renderButton? this.props.renderButton(): false}
					</div>
				</div>
		);
	}
});


//
//	Card
//
const {Page1, Page2} = RestaurantElement;
RestaurantCard = React.createClass({
	propTypes: {
		getRestaurantInfo: PropTypes.func.isRequired,
		vote: PropTypes.bool.isRequired
	},
	handelMouseEnter: function(){
		if(!isMobileDevice())$(this.refs.cardInfo).addClass('hover');
	},
	handelMouseLeave: function(){
		if(!isMobileDevice())$(this.refs.cardInfo).removeClass('hover');
	},
	handleTouchStart: function(event){
		if(event.target.tagName != "A"){
			if(isMobileDevice())$(this.refs.cardInfo).addClass('hover');
		}
	},
	handleTouchEnd: function(event){
		if(event.target.tagName != "A") {
			if (isMobileDevice())$(this.refs.cardInfo).removeClass('hover');
		}
	},
	renderButton: function(){
		if (this.props.vote){

		}else return(
				<a type="button" className="btn btn-next"
					 href={"/restaurant/list/"+this.props.restaurant._id}
					 style={{width: "100%", marginTop: "8px"}}>자세히 보기</a>
		);

	},
	render: function(){
		var cancelEvent = (e)=>{e.preventDefault(); return false;};
		return (
			<div className="restaurant-card" ref="card">
				<p className="title">{this.props.restaurant.name}</p>
				<div className="restaurant-card--info" ref="cardInfo"
						 onMouseEnter={this.handelMouseEnter} onMouseLeave={this.handelMouseLeave}
						 onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}
						 onContextMenu={cancelEvent}>
					<div className="flipper">
						<div className="page1">
							<Page1 restaurant={this.props.restaurant}
										 getRestaurantInfo={this.props.getRestaurantInfo(1, this.props.restaurant)}
										 renderButton={isMobileDevice()? this.renderButton : null}/>
						</div>
						<div className="page2">
							<Page2 restaurant={this.props.restaurant}
										 getRestaurantInfo={this.props.getRestaurantInfo(2, this.props.restaurant)}
										 vote={this.props.vote}
										 renderButton={isMobileDevice()? null : this.renderButton}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});