RestaurantDetail = React.createClass({
	subItems: [],
	mixins: [ReactMeteorData],
	getMeteorData: function(){
		return {
			restaurant: Restaurants.findOne({_id: this.props.restaurantId})
		}
	},
	componentWillMount: function(){
		this.subItems.push(Meteor.subscribe('restaurants'));
		this.subItems.push(Meteor.subscribe('restaurants-image'));
	},
	componentWillUnmount: function(){
		for(var i=0; i<this.subItems.length; i++){
			this.subItems[i].stop();
		}
	},
	render: function(){
		return (
				<div>{this.data.restaurant._id}</div>
		)
	}
});