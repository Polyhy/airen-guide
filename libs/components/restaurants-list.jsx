RestaurantList = React.createClass({
	subItems: [],
	mixins: [ReactMeteorData],
	getMeteorData: function(){
		return {
			restaurants: Restaurants.find({}).fetch()
		}
	},
	getInitialState: function() {
		this.subItems.push(Meteor.subscribe('restaurants'));
		this.subItems.push(Meteor.subscribe('restaurants-image'));
		return {
			restaurants: Restaurants.find({}).fetch()
		}
	},
	componentWillMount: function(){},
	componentWillUnmount: function(){
		for(var i=0; i<this.subItems.length; i++){
			this.subItems[i].stop();
		}
	},
	renderRestaurantItems: function(){
		var getRestaurantInfo= function(page, restaurant){
			if (page==1) return[
					["대표메뉴", restaurant.menus.map((i)=>{return i.menu}).join(", ")],
					["가격", String.fromCharCode(8361)+" "+restaurant.menus.reduce((m1, m2)=>{return m1+parseInt(m2.price)}, 0)],
					["오픈~마감", restaurant.openTime+"  ~  "+restaurant.closeTime],
					["아이렝스타", _.range(3).map(i=><i className={i<restaurant.rating?"fa fa-star":"fa fa-star-o"} key={"star"+i}/>)]
			];
			else if (page==2) return [
					["주소", restaurant.address],
					["소요시간", "x"]
			];
		};
		var restaurants = this.data.restaurants? this.data.restaurants: this.status.restaurants;
		return restaurants.map((restaurant)=>{
			return (
					<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={restaurant._id}>
						<RestaurantCard restaurant={restaurant} getRestaurantInfo={getRestaurantInfo} vote={false}/>
					</div>
			)
		});
	},
	render: function(){
		return (
				<div>{this.renderRestaurantItems()}</div>
		)
	}
});