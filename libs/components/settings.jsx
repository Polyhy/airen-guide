const {PropTypes} = React;

var Accordion = React.createClass({
	prpoTypes: {
		title: PropTypes.string.isRequired,
		renderMenu: PropTypes.object.isRequired
	},
	hideContext: function(){
		var $context = $(this.refs.context);
		if($context.hasClass('closed')){
			$context.removeClass('closed');
			$context.addClass('show');
			$(this.refs.btn).css("transform", "rotate(-180deg)");
		}
		else {
			$context.removeClass('show');
			$context.addClass('closed');
			$(this.refs.btn).css("transform", "rotate(-0deg)");
		}
	},
	render: function(){
		return (
				<div className="accordian-container">
					<p className="title">{this.props.title}</p>
					{/*<button type="button" className="btn btn-default" ref="btn" onClick={this.hideContext}>더보기</button>*/}
					<span ref="btn" onClick={this.hideContext} className="btn-show-more"><i className="fa fa-chevron-down"></i></span>
					<div className="polyhy-collapse closed" ref="context">
						{this.props.renderMenu}
					</div>
				</div>
		)
	}
});





var PersonSetting = React.createClass({
	render: function(){
		return false;
	}
});

PersonSetting.Profile = React.createClass({
	getInitialState: function(){
		var {user} = this.props;
		return {user: user};
	},
	render: function(){
		return(
				<div>
					<form id="add-restaurant-form" ref="profileForm" style={{width: "200px", margin: "0 auto"}}>
						<div className="form-group profile-image"
								 style={{backgroundImage: "url("+this.state.user.profile.profileURL+")"}}></div>
						<input type="file" ref="inputTag" accept="image/*"
									 className="" name="profile" />
						<PolyhyComponent.InputText name="user-name" label="이름" value={this.state.user.profile.name}/>
						<button type="button" style={{width:"100%"}} className="btn btn-ok">확인</button>
					</form>
				</div>
		);
	}
});

PersonSetting.EmailAlarm = React.createClass({
	getInitialState: function(){
		var {user} = this.props;
		return {user: user};
	},
	render: function(){
		return(
				<div>
					<form id="add-restaurant-form" ref="profileForm">
						<div className="form-group">
							<label htmlFor="recv-before">투표 <strong>시작시</strong> 이메일 알림 수신</label>
							<input type="checkbox" name="recv-before" className="sliding-switch" />
						</div>
						<div className="form-group">
							<label htmlFor="recv-after">투표 <strong>종료시</strong> 이메일 알림 수신</label>
							<input type="checkbox" name="recv-after" className="sliding-switch" />
						</div>
						{/*<button type="button" style={{float:"right"}} className="btn btn-ok">확인</button>*/}
					</form>
				</div>
		);
	}
});

PersonSetting.DeleteAccount = React.createClass({
	getInitialState: function(){
		var {user} = this.props;
		return {user: user};
	},
	render: function(){
		return <button type="button" className="btn btn-danger" style={{width:"100%"}}>회원 탈퇴</button>;
	}
});





var TeamSetting = React.createClass({
	render: function(){
		return false;
	}
});

TeamSetting.EditAddress = React.createClass({
	getInitialState: function(){
		var {user, team} = this.props;
		return {user: user, team: team};
	},
	changeAddress: function(){
		var $form = $(this.refs.addressForm);
		$form.find("[for=address]").text("");
		if (!$form.find("[name=address]").val() ||
				!$form.find("[name=address-lat]").val() || !$form.find("[name=address-lng]").val())
			$form.find("[for=address]").text("잘못된 주소입니다");
		else {
			var newAddress={latlng:{}};
			newAddress.address = $form.find("[name=address]").val();
			newAddress.latlng.lat = Number($form.find("[name=address-lat]").val());
			newAddress.latlng.lng = Number($form.find("[name=address-lng]").val());
			Meteor.call("editTeamAddress", newAddress, this.state.team._id, function(err, res){
				if (!err){
					console.log(res);
				}
			});
		}
	},
	render: function(){
		return(
				<form id="edit-team-address" ref="addressForm">
					<PolyhyComponent.InputAddressWithMap
							label="" name={"address"} detail={false}
							placeholder="" width={"100%"} height={"300px"}
							address={this.state.team.address}
							lat={this.state.team.latlng.lat} lng={this.state.team.latlng.lng}
							/>
					<button type="button" className="btn btn-ok" onClick={this.changeAddress}>확인</button>
				</form>
		)
	}
});

TeamSetting.Vote = React.createClass({
	getInitialState: function(){
		var {user, team} = this.props;
		return {user: user, team: team};
	},
	render: function(){
		return(
				<div>
					<form id="voteForm">
						<div className="form-group">
							<label htmlFor="time-start">시작 시간</label>
							<input type="text" className="form-control time-h" name="time-start-h"/>시
							<input type="text" className="form-control time-m" name="time-start-m"/>분
						</div>
						<div className="form-group">
							<label htmlFor="time-end">시작 시간</label>
							<input type="text" className="form-control time-h" name="time-end-h"/>시
							<input type="text" className="form-control time-m" name="time-end-m"/>분
						</div>
						<div className="form-group">
							<label htmlFor="max-price">1인당 최대 가격</label>
							<input type="text" className="form-control" name="max-price"/>원
						</div>
						<div className="form-group">
							<label htmlFor="max-people">밥집당 최소 인원</label>
							<input type="text" className="form-control" name="max-price"/>명
						</div>
						<button type="button" className="btn btn-ok">추가하기</button>
					</form>
					<div id="vote-list">
						<ul>
							{this.state.team.votes.map(
									v=>(
											<li>
												{v.startAt+" ~ "+v.endAt}
												<button type="button" className="btn btn-sm btn-danger">삭제</button>
											</li>
									)
							)}
						</ul>
					</div>
				</div>
		)
	}
});

TeamSetting.Member = React.createClass({
	subItem: [],
	getInitialState: function(){
		var {user, team} = this.props;
		this.subItem.push(Meteor.subscribe('team-members', team._id));
		return {user: user, team: team, members: Meteor.users.find().fetch()};
	},
	componentWillUnmount: function(){
		for (var i in this.subItem)this.subItem[i].stop();
	},
	renderMember: function(){
		var i = 0;
		return this.state.members.map(
						m =>(
								<li key={i++}>
									<p>{m.profile.name}</p>
									<select className="form-control" defaultValue={m.profile.userType? "admin": "member"}>
										<option value="admin">관리자</option>
										<option value="member">멤버</option>
									</select>
								</li>
						)
		);
	},
	render: function(){
		return(
				<div id="members">
					<ul className="team-member">
						{this.renderMember()}
					</ul>
				</div>
		)
	}
});





Settings = React.createClass({
	getInitialState: function(){
		Meteor.subscribe('teams');
		return {
			user: Meteor.user(),
			team: Teams.findOne({_id: Meteor.user().profile.teamId})
		}
	},
	componentDidMount: function () {
		if(this.state.user.profile.userType){
			$(this.refs.btnTeam).addClass("active");
			$(this.refs.setTeam).removeClass("hide");
		}else{
			$(this.refs.btnPerson).addClass("active");
			$(this.refs.setPerson).removeClass("hide");
		}
		$(".sliding-switch").bootstrapSwitch();
	},
	changeShow: function (event) {
		var $target = $(event.target).parent('li');
		if (!$target.hasClass("active")){
			$target.parent().find('.active').removeClass("active");
			$target.addClass("active");
			$(this.refs.settingViews).find('div.setting-view').addClass("hide");
			$(this.refs[$target.data("target")]).removeClass("hide");
		}
	},
	render: function(){
		return (
				<div id="setting">
					<ul className="nav nav-tabs">
						{this.state.user.profile.userType?(
								<li ref="btnTeam" data-target="setTeam">
									<a href="#" onClick={this.changeShow}>팀 설정</a>
								</li>
						):""}
						<li ref="btnPerson" data-target="setPerson">
							<a href="#" onClick={this.changeShow} >개인설정</a>
						</li>
					</ul>
					<div className="setting-views" ref="settingViews">
						<div ref="setPerson" className="setting-view hide">
							<Accordion title="프로필 수정"
												 renderMenu={ <PersonSetting.Profile user={this.state.user}/> }/>
							<Accordion title="이메일 알림 설정"
												 renderMenu={ <PersonSetting.EmailAlarm user={this.state.user}/> }/>
							<Accordion title="회원 탈퇴"
												 renderMenu={ <PersonSetting.DeleteAccount user={this.state.user}/> }/>
						</div>
						<div ref="setTeam" className="setting-view hide">
							<Accordion title="주소 수정"
												 renderMenu={ <TeamSetting.EditAddress user={this.state.user} team={this.state.team}/> }/>
							<Accordion title="투표 관리"
												 renderMenu={ <TeamSetting.Vote user={this.state.user} team={this.state.team}/> }/>
							<Accordion title="팀원 관리"
												 renderMenu={ <TeamSetting.Member user={this.state.user} team={this.state.team}/> }/>
						</div>
					</div>
				</div>
		);
	}
});