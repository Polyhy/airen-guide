const {PropTypes} = React;

RestaurantElement = React.createClass({
	render: function(){
		return false;
	}
});

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
						<td className="value">{i[1]}</td>
					</tr>
			)
		})
	},
	render: function(){
		return (
				<div>
					<div className="image-wrapper">
						<img src={this.getImageURL()} />
					</div>
					<table className="info">
						<tbody>
							{this.renderTableRow()}
						</tbody>
					</table>
				</div>
		)
	}
});


RestaurantElement.Page2 = React.createClass({
	render: function(){
		return (
			<div></div>
		);
	}
});


const {Page1, Page2} = RestaurantElement;
RestaurantCard = React.createClass({
	propTypes: {
		getRestaurantInfo: PropTypes.func.isRequired
	},
	handleMouseIn: function(event){
		//$(this.refs.page1).animate({
		//	opacity: "0"
		//}, 300, "swing");
		//
		//$(this.refs.page2).animate({
		//	opacity: "1"
		//}, 300, "swing");
	},
	handleMouseOut: function(event){
		//$(this.refs.page1).animate({
		//	opacity: "1"
		//}, 300, "swing");
		//
		//$(this.refs.page2).animate({
		//	opacity: "0"
		//}, 300, "swing");
	},
	render: function(){
		return (
			<div className="restaurant-card" ref="card">
				<p className="title">{this.props.restaurant.name}</p>
				<div className="restaurant-card--info"
						 style={{height: "300px"}}
						 onMouseEnter={this.handleMouseIn} onMouseLeave={this.handleMouseOut}>
					<div className="filpper">
						<div ref="page1">
							<Page1 restaurant={this.props.restaurant}
										 getRestaurantInfo={this.props.getRestaurantInfo(1, this.props.restaurant)}/>
						</div>
						<div ref="page2">
							<Page2 restaurant={this.props.restaurant}
										 getRestaurantInfo={this.props.getRestaurantInfo(2, this.props.restaurant)}/>
						</div>
					</div>
				</div>
			</div>
		);
	}
});