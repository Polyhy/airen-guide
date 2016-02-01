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
			return RestaurantImages.findOne({_id: imageId}).url().split("?")[0];
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
					<div className="image-wrapper" style={{backgroundImage: "url("+this.getImageURL()+")"}}/>
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
		var {restaurant, vote, voteLog, getRestaurantInfo} = this.props;
		return {
			restaurant: restaurant,
			vote:vote,
			voteLog: voteLog,
			getRestaurantInfo:getRestaurantInfo
		}
	},
	componentWillReceiveProps: function(nextProps){
		return {
			restaurant: nextProps.restaurant,
			vote: nextProps.vote,
			voteLog: nextProps.voteLog,
			getRestaurantInfo: nextProps.getRestaurantInfo
		}
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
				{/*<hr/>*/}
				<div className="restaurant-card--info" ref="cardInfo"
						 onMouseEnter={this.handelMouseEnter} onMouseLeave={this.handelMouseLeave}
						 onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}
						 onContextMenu={cancelEvent}>
					<div className="flipper">
						<div className="page1">
							<Page1 restaurant={this.state.restaurant}
										 getRestaurantInfo={this.state.getRestaurantInfo(1, this.state.restaurant)}
										 renderButton={Meteor.isClient&&isMobileDevice()? this.renderButton: null}/>
						</div>
						<div className="page2">
							<Page2 restaurant={this.state.restaurant}
										 getRestaurantInfo={this.state.getRestaurantInfo(2, this.state.restaurant)}
										 vote={this.state.vote}
										 renderButton={Meteor.isClient&&isMobileDevice()? null : this.renderButton}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});