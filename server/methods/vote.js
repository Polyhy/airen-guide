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
				minMember:minMember
			}
		};
		var closeVoteCron = {
			createdAt: now,
			teamId: teamId,
			type: 0,
			startAt: voteOption.endAt,
			name: teamId+"%"+voteOption.timestamp+"%0"
		};

		Crons.insert(makeVoteCron);
		Crons.insert(closeVoteCron);

		this.startVoteCron(makeVoteCron);
		this.startVoteCron(closeVoteCron);
	},

	deleteVote: function(voteTimeStamp, teamId){
		console.log("=================================================");
		console.log(voteCron.teamId+"팀의 실행 중인 투표를 삭제 합니다");
		console.log("timestamp : "+ voteTimeStamp);
		var jobName = teamId+"%"+voteTimeStamp;
		SyncedCron.remove(jobName+"%1");
		SyncedCron.remove(jobName+"%0");
		console.log(voteCron.teamId+"팀의 실행 중인 투표를 성공적으로 삭제했습니다");
		console.log("=================================================");
	},

	startVoteCron: function(voteCron){
		SyncedCron.add({
			name: voteCron.name,
			schedule: function(parser) {
				return parser.text("at "+voteCron.startAt.h+":"+voteCron.startAt.m);
			},
			job: function(){
				if(voteCron.type == 1){
					this.makeNewVote(voteCron);
				}else if(voteCron.type == 1){
					this.closeVote(voteCron);
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
			//Todays.update({_id: ongoingVote._id}, {$set: {status:0}});
		}

		var todays = {
			createdAt: new Date(),
			teamId: voteCron.teamId,
			restaurants: [],
			status: 1
		};

		var memberCount = Meteor.user.find({"profile.teamId":voteCron.teamId}).count();
		var restaurants = Restaurants.find({"menus.price":{$lte:voteCron.option.maxPrice}}).fetch().slice();

		console.log(voteCron.teamId+"팀의 새로운 투표를 만드는 중입니다");
		while (memberCount>0){
			var index = Math.floor(Math.random()*restaurants.length);
			var tempRestaurant = restaurants.splice(index, 1);
			todays.restaurants.push({
				restaurantsId: tempRestaurant._id,
				partyMember: [],
				maxMember: tempRestaurant.maxMember
			});
			memberCount -= tempRestaurant.maxMember;
		}
		//send email
		var res = Todays.insert(todays);
		console.log(voteCron.teamId+"팀의 새로운 투표를 성공적으로 만들었습니다");
		console.log("Vote Id : "+res);
		console.log("=================================================");
	},

	closeVote: function(voteCron){
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
});