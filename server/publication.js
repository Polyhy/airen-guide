Meteor.publish('teams', function(){
	//return Teams.find({}, {fields: {name: 1, _id:1, domain: 1}});
	return Teams.find({});
});

Meteor.publish('team-members', function(teamId){
	return Meteor.users.find(
			{
				"profile.teamId": teamId,
				"emails.verified": true
			},
			{
				fields: {
					"_id": 1,
					"profile": 1,
					"emails": 1
				}
			});
});

Meteor.publish('restaurants', function(){
	return Restaurants.find({});
});
Meteor.publish('restaurants-image', function(){
	return RestaurantImages.find({});
});
Meteor.publish('today', function(teamId){
	return Todays.find({teamId:teamId, status:1})
});
Meteor.publish('voteLog', function(userId){
	return VoteLog.find({userId:userId}, {sort: {createdAt: -1}})
});

