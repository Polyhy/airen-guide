Meteor.publish('teams', function(){
	//return Teams.find({}, {fields: {name: 1, _id:1, domain: 1}});
	return Teams.find({});
});

Meteor.publish('team-members', function(teamId){
	return Meteor.users.find({"profile.teamId" :teamId}, {fields: {name: 1, _id:1}});
});

Meteor.publish('restaurants', function(){
	return Restaurants.find({});
});
Meteor.publish('restaurants-image', function(){
	return RestaurantImages.find({});
});


