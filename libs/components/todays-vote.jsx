const {PropTypes} = React;

TodaysVote = React.createClass({
	subItems: [],
	mixins: [ReactMeteorData],
	getMeteorData: function(){
		var teamId = Meteor.user().profile.teamId;
		var todaysVote = Todays.findOne({teamId:teamId, status:1});
		if (!todaysVote) return {};

		var restaurantsIds = todaysVote? todaysVote.restaurants.map(i=>i.restaurantsId): [];
		return {
			restaurants: Restaurants.find({_id:{$in:restaurantsIds}}).fetch(),
			todaysVote: todaysVote,
			voteLog: VoteLog.findOne({voteId: todaysVote._id, userId: Meteor.userId()})
		};
	},
	componentWillMount: function(){
		this.subItems.push(Meteor.subscribe('restaurants'));
		this.subItems.push(Meteor.subscribe('restaurants-image'));
		this.subItems.push(Meteor.subscribe('today', Meteor.user().profile.teamId));
		this.subItems.push(Meteor.subscribe('voteLog', Meteor.userId()));
	},
	componentWillUnmount: function(){
		for(var i=0; i<this.subItems.length; i++){
			this.subItems[i].stop();
		}
	},
	//		else if (page == 2) return [
	//			["주소", restaurant.address],
	//			["인원", (voteRestaurant.partyMember.length)+"/"+voteRestaurant.maxMember]
	//		];
	//	};
	notEat: function(){
		Meteor.call("voteRestaurant", -1, this.data.todaysVote._id, function(err, res){
			console.log(err);
			console.log(res);
		});

	},
	render: function(){
		//var data = this.data.restaurants? this.data: this.state;
		return this.data.todaysVote?(
				<div id="today-vote-page">
					<div className="header">
						<h1><i className="fa fa-cutlery"></i> 오늘의 밥집</h1>
						<h3 className={this.data.voteLog?"":"hide"}>이번 투표를 완료하셨습니다</h3>
						<button type="button"
										className={"btn btn-danger"+(this.data.voteLog?" hide":"")}
										onClick={this.notEat}>안먹어요</button>
					</div>
					<div className="article">
						{this.data.restaurants.map(restaurant=>(
								<div className="col-xs-12 col-sm-6 col-md-4 col-lg-3" key={restaurant._id}>
									<RestaurantCard restaurant={restaurant} vote={this.data.todaysVote._id} voteLog = {this.data.voteLog}/>
								</div>
						))}
					</div>
				</div>
		): (
				<div><h1>현재 진행 중인 투표가 없습니다</h1></div>
		);
	}
});