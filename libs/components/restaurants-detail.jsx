RestaurantDetail = React.createClass({
	subItems: [],
	mixins: [ReactMeteorData],
	restaurant: null,
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
	componentWillMount: function(){
		this.restaurant = this.data.restaurant? this.data.restaurant: this.state.restaurant;
	},
	componentWillUnmount: function(){
		for(var i=0; i<this.subItems.length; i++){
			this.subItems[i].stop();
		}
	},
	getImageURL: function(imageId){
		var image = RestaurantImages.findOne({_id: imageId});
		return image? image.url(): "";
	},
	renderHeaderImage: function(restaurnatImages){
		var index = 0, tempW = 1, tempH = 1;
		return restaurnatImages.map(image=>{
			index += 1;
			if(index<restaurnatImages.length)index%2==0? tempH *= 2: tempW *= 2;
			return (
				<div className="responsive-image head-images" key={"img-"+image}
						 style={{	backgroundImage: "url("+this.getImageURL(image)+")",
						 				 	width: (100/tempW)+"%",
						 				 	height: (100/tempH)+"%"}}></div>
			)
		});
	},
	render: function(){
		return (
				<div id="restaurant-detail">
					<h1 className="title">
						<i className="fa fa-chevron-circle-left" onClick={()=>history.back()}
							 style={{cursor:"pointer"}}/>
						{this.restaurant.name}
					</h1>
					<div className="head-images-container">
						{this.renderHeaderImage(this.restaurant.images)}
						<div></div>
					</div>
					<div className="article article-1"></div>
				</div>
		)
	}
});