Tracker.autorun(function(){
	if (Accounts._verifyEmailToken) {
		var token = Accounts._verifyEmailToken;
		if (token.indexOf("???createteam")+13 == token.length){
			token = token.split("???createteam")[0];
			Session.set('verifyEmailToken', token);
			FlowRouter.redirect('/user/createteam');
		}
		else{
			Session.set('verifyEmailToken', token);
			FlowRouter.redirect('/user/verify');
		}
	}
});

FlowRouter.route('/', {
	action: function() {
		ReactLayout.render(AppLayout, {
			components: function() {
				return null;
			}
		});
	}
});





userAccountRouter = FlowRouter.group({
	prefix: '/user',
	name: 'userAccount',
	triggersEnter: [function(){
		if (Meteor.isClient && Meteor.user())FlowRouter.redirect('/');
	}]
});

userAccountRouter.route('/', {
	action: function(){
		if(Meteor.isClient)FlowRouter.redirect('/user/login');
	}
});

userAccountRouter.route('/login', {
	action: function(params, queryParams) {
		const {LoginPage1, LoginPage2} = Login;
		if (queryParams.team){
			ReactLayout.render(LoginAccountLayout, {
				title: "Sing in",
				components: function(){
					return <LoginPage2 teamId={queryParams.team}/>;
				}
			});
		}else{
			ReactLayout.render(LoginAccountLayout, {
				title: "Sing in",
				components: function(){
					return <LoginPage1 />;
				}
			});
		}
	}
});

userAccountRouter.route('/signup', {
	action: function(params, queryParams) {
		const{SignPage1} = Signup;
		if(queryParams.verify==="" && queryParams.team){
			var tip= "입력하신 이메일로 링크를 보냈습니다. 이메일로 받은 링크를 클릭해 이메일 주소를 인증해 주세요. 이메일 인증을 완료하면 계정 생성이 완료됩니다.";
			ReactLayout.render(LoginAccountLayout, {
				title: "Create account",
				components: function(){
					return <AccountNoti tip={tip} teamId={queryParams.team}/>;
				}
			});
		} else if(queryParams.team){
			ReactLayout.render(LoginAccountLayout, {
				title: "Create account",
				components: function(){
					return <SignPage1 teamId={queryParams.team}/>;
				}
			});
		}
	}
});

userAccountRouter.route('/createteam', {
	action: function(params, queryParams) {
		const {CreateTeamPage1, CreateTeamPage2} = CreateTeam;
		if(queryParams.verify===""){
			var tip= Session.get("create-team--tip");
			Session.set("create-team--tip", null);
			ReactLayout.render(LoginAccountLayout, {
				title: "Create team",
				components: function(){
					return <AccountNoti tip={tip} teamId={-1}/>;
				}
			});
		}else{
			ReactLayout.render(LoginAccountLayout, {
				title: "Create team",
				components: function(){
					if(Meteor.isClient && Session.get('verifyEmailToken')){
						var verifyEmailToken = Session.get('verifyEmailToken');
						Session.set('verifyEmailToken', null);
						return <CreateTeamPage2 verifyEmailToken={verifyEmailToken}/>;
					}
					else return <CreateTeamPage1 teamId="-1"/>;
				}
			});
		}
	}
});

userAccountRouter.route('/verify', {
	action: function(params, queryParams) {
		ReactLayout.render(Verify, {});
		ReactLayout.render(LoginAccountLayout, {
			title: "Verify email",
			components: function(){
				return <Verify />;
			}
		});
	}
});





restaurantRoutes = FlowRouter.group({
	prefix: '/restaurant',
	name: 'restaurant',
	triggersEnter: [function(){
		if (Meteor.isClient && !Meteor.user())FlowRouter.redirect('/user');
	}]
});

restaurantRoutes.route('/add', {
	action: function(){
		ReactLayout.render(AppLayout, {
			components: function() {
				return <AddRestaurant />;
			}
		});

	}
});

restaurantRoutes.route('/vote', {
	action: function(){
		ReactLayout.render(AppLayout, {
			components: function() {
				return <TodaysVote />;
			}
		});
	}
});

restaurantRoutes.route('/list', {
	action: function(){
		ReactLayout.render(AppLayout, {
			components: function() {
				return <RestaurantList />;
			}
		});
	}
});

restaurantRoutes.route('/list/:restaurantId', {
	action: function(params){
		ReactLayout.render(AppLayout, {
			components: function() {
				return <RestaurantDetail restaurantId={params.restaurantId}/>;
			}
		});
	}
});





settingRoutes = FlowRouter.group({
	prefix: '/setting',
	name: 'setting',
	triggersEnter: [function(){
		if (Meteor.isClient && !Meteor.user())FlowRouter.redirect('/user');
	}]
});

settingRoutes.route('/', {
	action: function(){
		ReactLayout.render(AppLayout, {
			components: function() {
				return <Settings />;
			}
		});
	}
});