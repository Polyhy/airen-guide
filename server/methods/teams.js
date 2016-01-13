var TeamController = function(){

	var validateTeam = function(teamInfo, verifyToken){
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

		return errors
	};

	this.createTeam = function(teamInfo, verifyToken){
		var errors = validateTeam(teamInfo, verifyToken);
		if (Object.keys(errors).length > 0)
			throw new Meteor.Error('invalid-team', errors);

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
		//console.log(user._id);
		//console.log(verifyToken)
		var team = _.extend(teamInfo, {
			createdAt: new Date(),
			createdBy: user._id,
			votes: []
		});
		//console.log(team);
		var teamId = Teams.insert(team);

		return {
			status: "success",
			result: {
				teamId: teamId,
				userId: user._id
			}
		}

	};


	return this;
};


Meteor.methods(new TeamController());

