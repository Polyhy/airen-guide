voteHelper = {
	startVoteCron: function(voteCron){
		var that = this;
		SyncedCron.pause();
		SyncedCron.add({
			name: voteCron.name,
			schedule: function(parser) {
				return parser.text("at "+voteCron.startAt.h+":"+voteCron.startAt.m);
			},
			job: function(){
				if(voteCron.type == 1){
					that.makeNewVote(voteCron);
				}else if(voteCron.type == 1){
					that.closeVote(voteCron);
				}
			}
		});
		SyncedCron.start();
	},

	makeNewVote: function(voteCron){
		console.log("=================================================");
		console.log("[[[[[ Run make new vote cron ]]]]]");
		console.log("Team Id : "+voteCron.teamId);
		var ongoingVote = Todays.find({teamId: voteCron.teamId, status: 1}).fetch();
		if (ongoingVote.length){
			console.log("해당 팀에 실행 중인 투표가 "+ongoingVote.length+"개 있습니다");
			console.log(voteCron.teamId+"팀의 실행 중인 투표를 종료합니다");
			ongoingVote.map(
							i=>Todays.update({_id: i._id}, {$set: {status:0}})
			);
			console.log(voteCron.teamId+"팀의 실행 중인 투표가 모두 종료되었습니다");
		}

		var todays = {
			createdAt: new Date(),
			teamId: voteCron.teamId,
			restaurants: [],
			status: 1
		};

		var memberCount = Meteor.users.find({"profile.teamId":voteCron.teamId}).count();
		var teamLatLng = Teams.findOne({_id: voteCron.teamId}).latlng;
		var restaurants = Restaurants.find({
			"menus.price":{$lte: voteCron.option.maxPrice},
			"latlng": {$near: [teamLatLng.lat, teamLatLng.lng], $maxDistance: 1/111.12}
		}).fetch().slice();

		console.log(voteCron.teamId+"팀의 새로운 투표를 만드는 중입니다");
		while (memberCount>0){
			var index = Math.floor(Math.random()*restaurants.length);
			var tempRestaurant = restaurants.splice(index, 1)[0];
			todays.restaurants.push({
				restaurantsId: tempRestaurant._id,
				partyMember: [],
				maxMember: tempRestaurant.maxMember
			});
			memberCount -= tempRestaurant.maxMember;
		}
		//send email
		console.log(voteCron.teamId+"팀의 유저들에게 이메일을 보냅니다");
		var userRecvEmail = Meteor.users.find({
			"profile.teamId":voteCron.teamId,
			"profile.notiSetting.recvStart": 1
		}).fetch();
		userRecvEmail.map( user=> {
			var emailForm = {
				url: Meteor.absoluteUrl()+"restaurant/vote",
				userName: user.profile.name,
				teamName: user.profile.teamName,
				hostUrl: Meteor.absoluteUrl()
			};
			return sendEmail(MakeVoteAlarm, emailForm, user);
		});

		var res = Todays.insert(todays);
		console.log(voteCron.teamId+"팀의 새로운 투표를 성공적으로 만들었습니다");
		console.log("Vote Id : "+res);
	},

	closeVote: function(voteCron){
		console.log("=================================================");
		console.log("[[[[[          Run Close Vote Cron          ]]]]]");
		var today = Todays.findOne({teamId: voteCron.teamId, status: 1});
		if (today){
			Todays.update({_id: today._id}, {$set: {status:0}});

			var member = Meteor.user.find({"profile.teamId":voteCron.teamId}).fetch();
			member.map(i=>{
				var temp = today.restaurants.find(j=>j.partyMember.indexOf(i._id)>=0);
				if(!temp){
					var index = today.restaurants.reduce((p, n, i, arr)=>{
								var prev = arr[p].maxMember-arr[p].partyMember.length;
								var next = n.maxMember-n.partyMember.length;
								return next>prev? i: p
							}, 0
					);
					var key = "restaurants."+index+".partyMember";
					var updateObject = {};
					updateObject[key] = i._id;
					Todays.update(
							{_id: today._id},
							{$push:updateObject}
					)
				}
			});

			//send email
		}
	}
};



Meteor.methods({
	addNewVoteCron: function(voteOption, teamId){
		var now = new Date();
		var makeVoteCron = {
			createdAt: now,
			teamId: teamId,
			type: 1,
			startAt: voteOption.startAt,
			name: teamId+"%"+voteOption.timestamp+"%1",
			option: {
				maxPrice: voteOption.maxPrice,
				minMember:voteOption.minMember
			}
		};
		var closeVoteCron = {
			createdAt: now,
			teamId: teamId,
			type: 0,
			startAt: voteOption.endAt,
			name: teamId+"%"+voteOption.timestamp+"%0"
		};
		console.log("=================================================");
		console.log(teamId+"팀의 새로운 투표를 추가 합니다");
		Crons.insert(makeVoteCron);
		Crons.insert(closeVoteCron);

		console.log(teamId+"투표 시작 크론을 스케줄링 합니다");
		voteHelper.startVoteCron(makeVoteCron);
		console.log(teamId+"투표 종료 크론을 스케줄링 합니다");
		voteHelper.startVoteCron(closeVoteCron);

		console.log(teamId+"팀의 새로운 투표를 성공적으로 추가했습니다");
	},

	deleteVote: function(voteTimeStamp, teamId){
		console.log("=================================================");
		console.log(teamId+"팀의 투표를 삭제 합니다");
		var jobName = teamId+"%"+voteTimeStamp;
		Crons.remove({  name:jobName+"%0", teamId: teamId  });
		Crons.remove({  name:jobName+"%1", teamId: teamId  });
		SyncedCron.remove(jobName+"%1");
		SyncedCron.remove(jobName+"%0");
		console.log("job name : "+ jobName);
		console.log(teamId+"팀의 투표를 성공적으로 삭제했습니다");
	},

	voteRestaurant: function(restaurantId, voteId){
		var vote = Todays.findOne({_id: voteId});
		if(!vote) throw new Meteor.Error(10003, "잘못된 값입니다", "잘못된 투표 Id 입니다");
		if (Meteor.user().profile.teamId != vote.teamId) throw new Meteor.Error(10002, "다른 팀의 투표에는 참여할 수 없습니다");
		if (vote.status == 0) throw new Meteor.Error(10004, "투표에 실패했습니다", "이미 종료된 투표입니다");

		var index = vote.restaurants.reduce((p, n, i)=>n.restaurantsId == restaurantId? i: p, -1);
		if(index == -1) throw new Meteor.Error(10003, "잘못된 값입니다", "잘못된 식당 Id 입니다");

		if (vote.restaurants[index].partyMember.length >= vote.restaurants[index].maxMember)
			throw new Meteor.Error(10004, "투표에 실패했습니다", "해당 밥집은 모집 인원이 다 찼습니다");

		var temp = vote.restaurants.find(i=>i.partyMember.indexOf(Meteor.userId())>=0);
		if(temp) throw new Meteor.Error(10004, "투표에 실패했습니다", "이미 투표하셨습니다");

		var updateObject = {};
		updateObject["restaurants."+index+".partyMember"] = Meteor.userId();
		Todays.update(
				{_id: vote._id},
				{$push: updateObject}
		);
		var res = VoteLog.insert({
			createdAt: new Date(),
			userId: Meteor.userId(),
			restaurantId: restaurantId,
			voteId: vote._id
		});
		return res;
	}
});