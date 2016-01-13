Meteor.publish('teams', function(){
	//return Teams.find({}, {fields: {name: 1, _id:1, domain: 1}});
	return Teams.find({});
});

Meteor.publish('team-members', function(teamId){
	return Meteor.users.find({"profile.teamId" :teamId}, {fields: {name: 1, _id:1}});
});

//Meteor.publish('team-info', function(teamId){
//	return Teams.find({_id: teamId});
//});