const {PropTypes} = React;

Layout = React.createClass({
	render: function(){
		return false;
	}
});

Layout.Logo = React.createClass({
	render: function(){
		return (
				<div className="logo" onClick={()=>{FlowRouter.redirect("/")}}>
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
					<button type="button" onClick={this.logout}
									className="btn btn-ok profile--btn-logout-mobile" >로그아웃</button>
				</div>
		);
	}
});

Layout.Sidebar = React.createClass({
	propTypes:{
		menuItems: PropTypes.arrayOf(PropTypes.object).isRequired
	},
	componentDidMount: function(){
		var $sidebar = $((ReactDOM.findDOMNode(this.refs.sidebar)));
		var that = this;
		$(document.body).on('click', function(event){
			$target = $(event.target);
			if(!$target.parents(".logo").length && $target.parents(".sidebar").length)
				$target = $sidebar;
			if($target.hasClass("sidebar") ||  $target.hasClass("btn-show-sidebar"))return;
			if (!$sidebar.hasClass('closed'))that.showMenu();
		});

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
		return this.props.menuItems.map(
				item => <li key={i++}><a href={item.link} onClick={this.showMenu}>{item.label}</a></li>
		);
	},
	render: function(){
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
		var {team} = this.props;
		return{  time: new Date(), team:team  };
	},
	componentDidMount: function(){
		this.timer = setInterval(()=>this.setState({time: new Date()}), 100);
	},
	componentWillReceiveProps(nextProps){
		this.setState({team:nextProps.team})
	},
	componentWillUnmount: function(){
		clearInterval(this.timer);
	},
	getVotes: function(){
		var now =  {h :this.state.time.getHours(), m: this.state.time.getMinutes()};
		if (this.state.team.votes.length < 0) return "-";
		for (var j in this.state.team.votes){
			var i = this.state.team.votes[j];
			if(i.startAt.h<now.h || (i.startAt.h==now.h && i.startAt.m <= now.m)){
				if(i.endAt.h>now.h || (i.endAt.h==now.h && i.endAt.m >= now.m)){
					return i.startAt.h+" : "+i.startAt.m+" ~ "+i.endAt.h+" : "+i.endAt.m;
				}
			}
		}
		return "-";
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
											<td className="key">주소</td>
											<td className="value">{this.state.team.address}</td>
										</tr>
										<tr>
											<td className="key">인원</td>
											<td className="value">{Meteor.users.find().count()} 명</td>
										</tr>
									</tbody>
								</table><br/>
								<div style={{marginLeft: "5%"}}>
									<span>진행 중인 투표</span><br/>
									<strong>{this.getVotes()}</strong>
								</div>
								<a className="btn btn-default" id="btn-add-restaurant" href="/restaurant/add">밥집등록 <i className="fa fa-pencil"/></a>
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
	subItem: [],
	mixins: [ReactMeteorData],
	getData: function(){
		var user = Meteor.user();
		if (user){
			this.subItem.push(Meteor.subscribe('teams'));
			this.subItem.push(Meteor.subscribe('team-members', user.profile.teamId));
			return {
				user: user,
				team: Teams.findOne({_id: Meteor.user().profile.teamId})
			};
		}
		else return {};
	},
	getMeteorData: function(){
		return this.getData();
	},
	getInitialState: function() {
		return this.getData();
	},
	componentWillMount: function(){
		if(Meteor.isClient && !Meteor.user())FlowRouter.redirect('/user/login');
	},
	componentDidMount:function(){
		$(".sidebar--menu-items>nav>a.active").removeClass("active");
		$('.sidebar--menu-items>nav>a[href=\''+FlowRouter.current().path+'\']').addClass('active');
	},
	componentWillUnmount: function(){
		for (var i in this.subItem)this.subItem[i].stop();
	},
	shouldComponentUpdate: function(){
		if(Meteor.isClient && !Meteor.user())FlowRouter.redirect('/user/login');
		return true;
	},
	render: function(){
		if (!this.state.user)return false;

		var menuItems = [];
		menuItems.push({label: "오늘의 밥집", link: "/restaurant/vote"});
		menuItems.push({label: "밥집 리스트", link: "/restaurant/list"});
		menuItems.push({label: "설정", link: "/setting"});
		return(
				<div id="root">
					<Sidebar menuItems={menuItems} user={this.state.user}/>
					<Map user={this.state.user} team={this.data.team}/>
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
	getInitialState: function(){
		this.subItems.teamNames = Meteor.subscribe("teams");
		return null;
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
