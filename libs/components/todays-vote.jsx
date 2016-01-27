const {PropTypes} = React;

TodaysVote = React.createClass({
	subItems: [],
	mixins: [ReactMeteorData],
	getMeteorData: function(){
		var teamId = Meteor.user().profile.teamId;
		return {
			//restaurants: Restaurants.find({}).fetch()
			todaysRestaurants: Todays.findOne({teamId:teamId, status:1})
		}
	},
	componentWillMount: function(){
		this.subItems.push(Meteor.subscribe('restaurants'));
		this.subItems.push(Meteor.subscribe('restaurants-image'));
		this.subItems.push(Meteor.subscribe('today', Meteor.user().profile.teamId));
	},
	componentWillUnmount: function(){
		for(var i=0; i<this.subItems.length; i++){
			this.subItems[i].stop();
		}
	},
	render: function(){
		return false;
	}
});