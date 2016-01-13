const {PropTypes} = React;

Layout = React.createClass({
	render: function(){
		return false;
	}
});

Layout.Logo = React.createClass({
	render: function(){
		return (
				<div className="logo">
				<span className="logo-circle">
					<i className="fa fa-cutlery logo-icon"></i>
				</span>
					<div className="logo-ribbon"></div>
				</div>
		);
	}
});

Layout.Profile = React.createClass({
	propTypes: {
		user: PropTypes.object.isRequired
	},
	logout: function(){
		Meteor.logout(()=>{location.href="/"});
	},
	render: function () {
		return (
				<div className="profile">
					<div className="profile--image"></div>
					<div className="profile--info">
						<p className="profile--user-name">{this.props.user.profile.name}</p>
						<a className="profile--btn-logout" onClick={this.logout}>로그아웃</a>
						<p className="profile--team-name">{this.props.user.profile.teamName}</p>
					</div>
				</div>
		);
	}
});

Layout.Sidebar = React.createClass({
	propTypes:{
		menuItems: PropTypes.arrayOf(PropTypes.object).isRequired
	},
	showMenu: function(event){
		var moveTo = $((ReactDOM.findDOMNode(this.refs.sidebarMenu))).width();
		var $sidebar = $((ReactDOM.findDOMNode(this.refs.sidebar)));
		if ($sidebar.hasClass('closed')) {
			$('.sidebar--menu, .btn-show-sidebar').animate({
				left: "+="+moveTo
			}, 250,  ()=>{
				$sidebar.removeClass('closed');
			});
		}else{
			$('.sidebar--menu, .btn-show-sidebar').animate({
				left: "-="+moveTo
			}, 250, ()=>{
				$sidebar.addClass('closed');
			});

		}
	},
	renderMenus: function () {
		var i = 0;
		return this.props.menuItems.map((item)=>{
			return <a href={item.link} key={"menu" + i++}>{item.label}</a>
		});
	},
	render: function(){
		//if (!this.props.user)return false;
		return (
				<div className="sidebar closed" ref="sidebar">
					<div className="sidebar--menu" ref="sidebarMenu">
						<Layout.Logo />
						<Layout.Profile user={this.props.user}/>
						<div className="sidebar--menu-items">
							<nav className="">
								{this.renderMenus()}
							</nav>
						</div>
					</div>
					<span className="btn-show-sidebar" onClick={this.showMenu}>menu</span>
				</div>
		)
	}
});

Layout.Modal = React.createClass({
	render: function(){
		return (
				<p>asdfadf</p>
		)
	}
});

Layout.Map = React.createClass({
	getInitialState: function(){
		return{
			team: Teams.findOne({_id: this.props.user.profile.teamId})
		}
	},
	componentDidMount: function(){
		if(this.state.team.name == 'airensoft')
			$("#btn-add-restaurant").removeClass('hide');
	},
	getVotes: function(){
		var votes = this.state.team.votes;
		if (votes.length > 0){
			var votesStr = "";
			for (var i in votes){
				votesStr += votes[i].start+" ~ "+votes[i].end+"\n";
			}
			return votesStr;
		}else return "-";
	},
	render: function(){
		return (
				<div className="container" id="team-view">
					<div className="row">
						<div className="col-xs-12">
							<div id="team-view--map-box" >
								<PolyhyComponent.Map width={"100%"} height={"100%"}
																		 lat={this.state.team.latlng.lat}
																		 lng={this.state.team.latlng.lng}
																		 zoom={18} marker={true}/>
							</div>
							<div id="team-view--team-info">
								<h4 className="title">{this.state.team.name}</h4>
								<hr/>
								<table>
									<tbody>
									<tr>
										<td className="key">투표시간</td>
										<td className="value">
											{this.getVotes()}
										</td>
									</tr>
									<tr>
										<td className="key">인원</td>
										<td className="value">{Meteor.users.find({}).count()}</td>
									</tr>
									<tr>
										<td className="key">주소</td>
										<td className="value">{this.state.team.address}</td>
									</tr>
									</tbody>
								</table>
								<a className="btn btn-default hide" id="btn-add-restaurant" href="/restaurant/add">밥집등록</a>
							</div>
						</div>
					</div>
				</div>
		)
	}
});

const {Sidebar, Map, ...other} = Layout;
AppLayout = React.createClass({
	propTypes:{
		components: PropTypes.func.isRequired
	},
	subItem: {},
	getInitialState: function() {
		var user = Meteor.user();
		//var team = null;
		//if(user){
		//	this.subItem.team = Meteor.subscribe('teams', user.profile.teamId);
		//	this.subItem.teamMember = Meteor.subscribe('team-members', user.profile.teamId);
		//
		//	team = Teams.findOne({_id: user.profile.teamId});
		//}
		return {user: user};
	},
	componentWillMount: function(){
		if(Meteor.isClient && !this.state.user)FlowRouter.redirect('/user/login');
		this.subItem.team = Meteor.subscribe('teams');
		//this.subItem.teamMember = Meteor.subscribe('team-members', user.profile.teamId);
		//if(!this.state.team.latang)FlowRouter.reload();
	},
	componentWillUnmount: function(){
		for(k in this.subItem){
			this.subItem[k].stop()
		}
	},
	render: function(){
		if (!this.state.user)return false;

		var menuItems = [];
		menuItems.push({label: "오늘의 밥집", link: "#"});
		menuItems.push({label: "밥집 리스트", link: "#"});
		menuItems.push({label: "설정", link: "#"});
		return(
				<div id="root">
					<Sidebar menuItems={menuItems} user={this.state.user}/>
					<Map user={this.state.user}/>
					<div className="container contents-block">
						{this.props.components()}
					</div>
				</div>
		);
	}
});




AccountNoti = React.createClass({
	componentWillMount: function(){
		if (!this.props.teamId){
			FlowRouter.redirect('/');
		}
	},
	componentDidMount: function(){
		$("#login-account--btn-back").addClass('hide');
	},
	render: function(){
		return (
				<div id="signup--page-2">
					<p id="signup-tip">{this.props.tip}</p>
					<a type="button" className="btn btn-next" href="/">확인</a>
				</div>
		)
	}
});



LoginAccountLayout = React.createClass({
	subItems: {},
	componentWillMount: function(){
		this.subItems.teamNames = Meteor.subscribe("teams");
	},
	componentDidMount: function(){
		if ($(document).width() >= 768)
			$(document.body).css("background-color", "#eee");
	},
	componentWillUnmount: function(){
		$(document.body).css("background-color", "#fff");
		for (var key in this.subItems){
			this.subItems[key].stop();
		}
	},
	prevStep: function(){
		FlowRouter.redirect('/user/login');
	},
	render: function(){
		return (
				<div id="login" className="login-account">
					<div id="login--wrapper" className="login-account--wrapper">
						<div id="login--row" className="login-account--row">
							<i className="fa fa-arrow-circle-o-left" id="login-account--btn-back"
								 onClick={this.prevStep}></i>
							<h1 className="text-title">{this.props.title}</h1>
							<div ref="loginAccountView">
								{this.props.components()}
							</div>
						</div>
					</div>
				</div>
		)
	}
});