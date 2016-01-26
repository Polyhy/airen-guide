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
	return errors;
};

var validateVote = function(voteOption){
 var error = [];
	if (voteOption.startAt.h==="")
		error.push("투표 시작 시간을 입력해 주세요");
	if (voteOption.startAt.m==="")
		error.push("투표 시작 시간을 입력해 주세요");
	if (voteOption.endAt.h==="")
		error.push("투표 종료 시간을 입력해 주세요");
	if (voteOption.endAt.m==="")
		error.push("투표 종료 시간을 입력해 주세요");
	if (!voteOption.maxPrice)
		error.push("최대 가격을 입력해 주세요");
	if (!voteOption.minMember)
		error.push("최소 인원을 입력해 주세요");
	if (voteOption.startAt.m < 0 || voteOption.startAt.m > 59)
		error.push("잘못된 값입니다");
	if (voteOption.endAt.m < 0 || voteOption.endAt.m > 59)
		error.push("잘못된 값입니다");
	if (voteOption.startAt.h < 0 || voteOption.startAt.h > 23)
		error.push("잘못된 값입니다");
	if (voteOption.endAt.h < 0 || voteOption.endAt.h > 23)
		error.push("잘못된 값입니다");
	if (voteOption.startAt.h > voteOption.endAt.h)
		error.push("투표 종료시간이 시작시간보다 빠를 수 없습니다.");
	if ( voteOption.startAt.h == voteOption.endAt.h && voteOption.startAt.m > voteOption.endAt.m)
		error.push("투표 종료시간이 시작시간보다 빠를 수 없습니다.");
	if ( voteOption.startAt.h == voteOption.endAt.h && voteOption.startAt.m == voteOption.endAt.m)
		error.push("투표 시작 시간과 종료시간이 같을 수 없습니다.");

	console.log(voteOption.endAt);
	console.log(error)
	return error;
};

Meteor.methods({
	createTeam: function(teamInfo, verifyToken){
		var errors = validateTeam(teamInfo, verifyToken);
		if (_.keys(errors).length > 0)throw new Meteor.Error(10003, "잘못된 값입니다", errors);

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

	},
	changeUserType: function(target, value) {
		if (Meteor.user().profile.userType != 1)
			throw new Meteor.Error(10002, "Access denied", "팀 관리자 권한이 필요힙니다");
		if (Meteor.users.find({"profile.userType": 1}).count() < 2 && value == 0)
			throw new Meteor.Error(10003, "Error", "한 팀에는 최소한 한명 이상의 관리자가 필요합니다");

		var res = Meteor.users.update({_id: target}, {$set: {"profile.userType": value}});
	},
	addNewVote:function(voteOption) {
		check(voteOption, {
			startAt: {
				h: Number,
				m: Number
			},
			endAt: {
				h: Number,
				m: Number
			},
			minMember: Number,
			maxPrice: Number
		});

		if (Meteor.user().profile.userType != 1)
			throw new Meteor.Error(10002, "Access denied", "팀 관리자 권한이 필요힙니다");

		var error = validateVote(voteOption);
		if (error.length)throw new Meteor.Error(10003, "잘못된 값입니다", error);

		var overlapVote = Teams.findOne({_id: Meteor.user().profile.teamId}).votes.filter(
				vote=>(
						(voteOption.startAt.h < vote.endAt.h && voteOption.endAt.h > vote.startAt.h) ||
						(
								(voteOption.startAt.h == vote.endAt.h && voteOption.startAt.m <= vote.endAt.m) &&
								(voteOption.endAt.h == vote.startAt.h && voteOption.endAt.m >= vote.startAt.m)
						)
				)
		);
		console.log(overlapVote.length);
		if (overlapVote.length) throw new Meteor.Error(10004, "중복된 투표가 있습니다", error);

		var newVote = _.extend(voteOption, {
			createdAt: new Date(),
			timestamp: new Date().getTime()
		});

		var res = Teams.update(
				{_id: Meteor.user().profile.teamId},
				{
					$push:{
						"votes": newVote
					}
				}
		);
		return res;
	}
});

