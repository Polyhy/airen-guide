RestaurantList = React.createClass({
	subItems: [],
	mixins: [ReactMeteorData],
	getMeteorData: function(){
		return {
			restaurants: Restaurants.find({}).fetch()
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
		//var restaurants = this.data.restaurants;
		console.log(this.data.restaurants.map(i=>i._id));
		return (
				<div>{
					this.data.restaurants.map(restaurant=>(
						<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={restaurant._id}>
							<RestaurantCard restaurant={restaurant} vote={false} />
						</div>
					))
				}</div>
		)
	}
});