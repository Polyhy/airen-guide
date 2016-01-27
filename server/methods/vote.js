Meteor.methods({
	addNewVoteCron: function(voteOption, teamId){
		var now = new Date();
		var makeVoteCron = {
			createdAt: now,
			teamId: teamId,
			type: 1,
			startAt: voteOption.startAt,
			name: teamId+"%"+voteOption.startAt.h+"%"+voteOption.startAt.m+"%1",
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
			name: teamId+"%"+voteOption.startAt.h+"%"+voteOption.startAt.m+"%0",
		};

		Crons.insert(makeVoteCron);
		Crons.insert(closeVoteCron);

		startVoteCron(makeVoteCron);
		startVoteCron(closeVoteCron);
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
		var ongoingVote = Todays.findOne({teamId: voteCron.teamId, status: 1});
		if (ongoingVote){
			Todays.update({_id: ongoingVote._id}, {$set: {status:0}});
		}

		var todays = {
			createdAt: new Date(),
			teamId: voteCron.teamId,
			restaurants: [],
			status: 1
		};

		var memberCount = Meteor.user.find({"profile.teamId":voteCron.teamId}).count();
		var restaurants = Restaurants.find({"menus.price":{$lte:voteCron.option.maxPrice}}).fetch().slice();

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
		Todays.insert(todays);
	},
	closeVote: function(voteCron){
		var ongoingVote = Todays.findOne({teamId: voteCron.teamId, status: 1});
		if (ongoingVote){
			Todays.update({_id: ongoingVote._id}, {$set: {status:0}});
			//send email
		}
	}
});