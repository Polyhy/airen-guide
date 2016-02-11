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
			return RestaurantImages.findOne({_id: imageId}).url()
		else
			return null;
	},
	render: function(){
		var restaurant = this.props.restaurant;
		var avgPrice = restaurant.menus.reduce((p1, p2)=> p1+parseInt(p2.price), 0);
		avgPrice /= restaurant.menus.length;
		return (
				<div>
					<div className="image-wrapper" style={{backgroundImage: "url("+this.getImageURL()+")"}}/>
					<table className="info">
						<tbody>
							<tr>
								<td className="key">대표메뉴</td>
								<td >:</td>
								<td className="value">{restaurant.menus.map((i)=> {return i.menu}).join(", ")}</td>
							</tr>
							<tr>
								<td className="key">가격</td>
								<td >:</td>
								<td className="value">{String.fromCharCode(8361)+" "+avgPrice}</td>
							</tr>
							<tr>
								<td className="key">오픈~마감</td>
								<td >:</td>
								<td className="value">{restaurant.openTime + "시  ~  " + restaurant.closeTime+"시"}</td>
							</tr>
							<tr>
								<td className="key">아이렝스타</td>
								<td >:</td>
								<td className="value">{
									_.range(3).map(i=><i className={i<restaurant.rating?"fa fa-star":"fa fa-star-o"} key={"star"+i}/>)
								}</td>
							</tr>
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
							<tr>
								<td className="key">주소</td>
								<td >:</td>
								<td className="value">{restaurant.address}</td>
							</tr>
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
		vote: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.bool
		]).isRequired
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
	voteRestaurant: function(event){
		$target = $(event.target);
		var voteId = $target.data("vote");
		var restaurantId = $target.data("restaurant");
		Meteor.call("voteRestaurant", restaurantId, voteId, function(err, res){
			console.log(err);
			console.log(res);
		});
	},
	getInitialState: function(){
		var {restaurant, vote, voteLog} = this.props;
		return {
			restaurant: restaurant,
			vote:vote,
			voteLog: voteLog
		}
	},
	componentWillReceiveProps: function(nextProps){
		this.setState({
			restaurant: nextProps.restaurant,
			vote: nextProps.vote,
			voteLog: nextProps.voteLog
		});
	},
	renderButton: function(){
		if (this.state.vote){
			var className = "btn btn-ok";
			className += this.state.voteLog? " disabled": "";
			return (
					<div style={{position: "absolute", bottom:"4px", width: "100%"}}>
						<a type="button" className="btn btn-next"
							 href={"/restaurant/list/"+this.state.restaurant._id}
							 style={{width: "49%", float:"left"}}>자세히 보기</a>
						<a type="button" className={className}
							 data-restaurant={this.state.restaurant._id}
							 data-vote={this.state.vote}
							 onClick={this.voteRestaurant}
							 style={{width: "49%", float:"right"}}>먹으러 가기</a>
					</div>
			)
		}else return(
				<div style={{position: "absolute", bottom:"4px", width: "100%"}}>
					<a type="button" className="btn btn-next"
						 href={"/restaurant/list/"+this.state.restaurant._id}
						 style={{width: "100%"}}>자세히 보기</a>
				</div>
		);
	},
	renderVotedMark: function(){
		var {voteLog, restaurant} = this.state;
		if (voteLog && restaurant._id == voteLog.restaurantId)
			return (<span className="voted-mark"/>);
		else return false;
	},
	render: function(){
		var cancelEvent = (e)=>{e.preventDefault(); return false;};
		return (
			<div className="restaurant-card" ref="card">
				{this.renderVotedMark()}
				<p className="title"><i className="fa fa-map-marker"/> {this.state.restaurant.name}</p>
				<div className="restaurant-card--info" ref="cardInfo"
						 onMouseEnter={this.handelMouseEnter} onMouseLeave={this.handelMouseLeave}
						 onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}
						 onContextMenu={cancelEvent}>
					<div className="flipper">
						<div className="page1">
							<Page1 restaurant={this.state.restaurant}
										 renderButton={Meteor.isClient&&isMobileDevice()? this.renderButton: null}/>
						</div>
						<div className="page2">
						</div>
						<div className="page2">
							<Page2 restaurant={this.state.restaurant}
										 vote={this.state.vote}
										 renderButton={Meteor.isClient&&isMobileDevice()? null : this.renderButton}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});
