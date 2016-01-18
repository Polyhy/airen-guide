const {PropTypes} = React;

RestaurantElement = React.createClass({
	render: function(){
		return false;
	}
});

RestaurantElement.Page1 = React.createClass({
	propTypes: {
		getRestaurantInfo: PropTypes.func.isRequired
	},
	getImageURL: function(){
		var imageId = this.props.restaurant.images[0];
		return RestaurantImages.findOne({_id: imageId}).url();
	},
	renderTableRow: function() {
		var restaurantInfo = this.props.getRestaurantInfo(1, this.props.restaurant);
		return restaurantInfo.map((i)=>{
			return (
					<tr>
						<td>{i[0]}</td>
						<td>{i[1]}</td>
					</tr>
			)
		})
	},
	render: function(){
		return (
				<div>
					<img src={this.getImageURL()} alt="" style={{width: "100%"}}/>
					<table>
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
		return false;
	}
});


const {Page1, Page2} = RestaurantElement;
RestaurantCard = React.createClass({
	render: function(){
		return (
			<div className="restaurant-card" ref="card">
				<p className="title restaurant-card--title">{this.props.restaurant.name}</p>
				<div className="restaurant-card--info">
					<Page1 restaurant={this.props.restaurant} getRestaurantInfo={this.props.getRestaurantInfo}/>
				</div>
			</div>
		);
	}
});