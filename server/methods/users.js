Meteor.methods({
	registerAtTeam: function(userId, teamId){
		var teamName = Teams.findOne({_id: teamId}).name;
		console.log(teamName);
		Meteor.users.update(
				{_id: userId},
				{$set: {"profile.teamId": teamId, "profile.teamName": teamName}}
		)
	}
});