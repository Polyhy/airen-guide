RestaurantDetail = React.createClass({
	subItems: [],
	mixins: [ReactMeteorData],
	getMeteorData: function(){

		return {
			restaurant: Restaurants.findOne({_id: this.props.restaurantId})
		}
	},
	getInitialState: function(){
		this.subItems.push(Meteor.subscribe('restaurants'));
		this.subItems.push(Meteor.subscribe('restaurants-image'));
		return {
			restaurant: Restaurants.findOne({_id: this.props.restaurantId})
		}
	},
	componentWillUnmount: function(){
		for(var i=0; i<this.subItems.length; i++){
			this.subItems[i].stop();
		}
	},
	render: function(){
		var restaurant = this.data.restaurant? this.data.restaurant: this.state.restaurant;
		return (
				<div>
					<p className="title">
						<i className="fa fa-chevron-circle-left" onClick={()=>history.back()}></i>
						{restaurant.name}
					</p>
				</div>
		)
	}
});