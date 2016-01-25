var validateTeam= function(teamInfo, verifyToken){
	var errors = {};
	if(!teamInfo.name)
		errors.teamName = "team name is null";
	else if(Teams.find({name: teamInfo.name}).count() > 0)
		errors.teamName = "team name \'" + teamInfo.name + "\' is already exist";
	if(!teamInfo.address)
		errors.teamAdd = "team address is null";
	if(!teamInfo.latlng.lat || !teamInfo.latlng.lng)
		errors.teamAdd = "team latlng is null";
	if(!verifyToken)
		errors.userId = "verifyToken is null";
	return errors;
};


Meteor.methods({
	createTeam: function(teamInfo, verifyToken){
		var errors = validateTeam(teamInfo, verifyToken);
		if (_.keys(errors).length > 0)throw new Meteor.Error('invalid-input', errors);

		check(verifyToken, String);
		check(teamInfo, {
			name: String,
			address: String,
			latlng: {
				lat: Number,
				lng: Number
			}
		});

		var user = Meteor.users.findOne(
				{"services.email.verificationTokens.token":verifyToken}
		);
		var team = _.extend(teamInfo, {
			createdAt: new Date(),
			createdBy: user._id,
			votes: []
		});
		return {
			status: "success",
			result: {
				teamId: Teams.insert(team),
				userId: user._id
			}
		}
	},
	editTeamAddress: function (newAddress, teamId){
		if (newAddress.address && newAddress.latlng.lat && newAddress.latlng.lng && teamId){
			check(teamId, String);
			console.log(newAddress);
			check(newAddress, {
				address: String,
				latlng: {
					lat: Number,
					lng: Number
				}
			});
			var temp = Teams.update({_id: teamId}, {$set: {address: newAddress.address, latlng: newAddress.latlng}});
			return temp;
		} else throw new Meteor.Error("Invalid Input");

	}
});

