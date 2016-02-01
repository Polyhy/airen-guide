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
		var {team} = this.props;
		return {team: team};
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
	componentWillReceiveProps(nextProps){
		this.setState({team:nextProps.team})
	},
	appendVote: function(){
		$(this.refs.warn).text("");
		if (!this.refs['time-start-h'].value)
			$(this.refs.warn).text("투표 시작 시간을 입력해 주세요");
		else if (!this.refs['time-start-m'].value)
			$(this.refs.warn).text("투표 시작 시간을 입력해 주세요");
		else if (!this.refs['time-end-h'].value)
			$(this.refs.warn).text("투표 종료 시간을 입력해 주세요");
		else if (this.refs['time-end-h'].value < 0 || this.refs['time-end-h'].value > 23)
			$(this.refs.warn).text("잘못된 값입니다");
		else if (!this.refs['time-end-m'].value)
			$(this.refs.warn).text("투표 종료 시간을 입력해 주세요");
		else if (!this.refs["max-price"].value)
			$(this.refs.warn).text("최대 가격을 입력해 주세요");
		else if (!this.refs["min-member"].value)
			$(this.refs.warn).text("최소 인원을 입력해 주세요");
		else if (this.refs['time-start-m'].value < 0 || this.refs['time-start-m'].value > 59)
			$(this.refs.warn).text("잘못된 값입니다");
		else if (this.refs['time-end-m'].value < 0 || this.refs['time-end-m'].value > 59)
			$(this.refs.warn).text("잘못된 값입니다");
		else if (this.refs['time-start-h'].value < 0 || this.refs['time-start-h'].value > 23)
			$(this.refs.warn).text("잘못된 값입니다");
		else if (Number(this.refs['time-start-h'].value) > Number(this.refs['time-end-h'].value))
			$(this.refs.warn).text("투표 종료시간이 시작시간보다 빠를 수 없습니다.");
		else if ( Number(this.refs['time-start-h'].value) == Number(this.refs['time-end-h'].value) &&
							Number(this.refs['time-start-m'].value) >= Number(this.refs['time-end-m'].value))
			$(this.refs.warn).text("투표 종료시간이 시작시간보다 빠를 수 없습니다.");
		else if ( this.refs['time-start-h'].value == this.refs['time-end-h'].value &&
				this.refs['time-start-m'].value == this.refs['time-end-m'].value)
			$(this.refs.warn).text("투표 시작 시간과 종료시간이 같을 수 없습니다.");
		else{
			var newVote = {
				startAt: {
					h: Number(this.refs['time-start-h'].value),
					m: Number(this.refs['time-start-m'].value)
				},
				endAt: {
					h: Number(this.refs['time-end-h'].value),
					m: Number(this.refs['time-end-m'].value)
				},
				minMember: Number(this.refs["min-member"].value),
				maxPrice: Number(this.refs["max-price"].value)
			};
			var that = this;
			Meteor.call("addNewVote", newVote, function (err, res) {
				if(err){
					if(err.error==10004)$(that.refs.warn).text("시간이 중복되는 투표가 있습니다");
					else console.log(err);

				}else{
					that.refs['time-start-h'].value = "";
					that.refs['time-start-m'].value = "";
					that.refs['time-end-h'].value = "";
					that.refs['time-end-m'].value = "";
					that.refs["min-member"].value = "";
					that.refs["max-price"].value = "";
				}
			});
		}
	},
	deleteVote: function(event){
		var $target = $(event.target);
		Meteor.call("removeVote", $target.data("timestamp"), this.state.team._id)
	},
	renderVotes: function(){
		var votes = this.state.team.votes.slice().sort(
			(i, j)=>i.startAt.h==j.startAt.h? i.startAt.m-j.startAt.m: i.startAt.h-j.startAt.h
		);
		return votes.map(
				v=>(
						<li key={v.timestamp}>
							{v.startAt.h+"시 "+v.startAt.m+"분 ~ "+v.endAt.h+"시 "+v.endAt.m+"분"}
							<span className="delete-tooltip" onClick={this.deleteVote} data-timestamp={v.timestamp}>이 투표 삭제</span>
						</li>
				)
		)
	},
	render: function(){
		return(
				<div>
					<p className="warn" ref="warn"></p>
					<form id="voteForm">
						<div className="form-group">
							<label htmlFor="time-start">시작 시간</label>
							<input type="text" className="form-control time-h" ref="time-start-h"/>시
							<input type="text" className="form-control time-m" ref="time-start-m"/>분
						</div>
						<div className="form-group">
							<label htmlFor="time-end">종료 시간</label>
							<input type="text" className="form-control time-h" ref="time-end-h"/>시
							<input type="text" className="form-control time-m" ref="time-end-m"/>분
						</div>
						<div className="form-group">
							<label htmlFor="max-price">1인당 최대 가격</label>
							<input type="text" className="form-control" ref="max-price"/>원
						</div>
						<div className="form-group">
							<label htmlFor="max-people">밥집당 최소 인원</label>
							<input type="text" className="form-control" ref="min-member"/>명
						</div>
						<button type="button" className="btn btn-ok" onClick={this.appendVote}>추가하기</button>
					</form>
					<div id="vote-list">
						<ul>
							{this.renderVotes()}
						</ul>
					</div>
				</div>
		)
	}
});

TeamSetting.Member = React.createClass({
	subItem: [],
	mixins: [ReactMeteorData],
	getMeteorData: function(){
		return{
			members: Meteor.users.find().fetch()
		}
	},
	getInitialState: function(){
		var {user, team} = this.props;
		this.subItem.push(Meteor.subscribe('team-members', team._id));
		return {user: user, team: team};
	},
	componentWillUnmount: function(){
		for (var i in this.subItem)this.subItem[i].stop();
	},
	updateUserType: function(event){
		var $target = $(event.target);
		var selected = Number(event.target.value);
		var selectBox = event.target;
		var targetUserId = $target.data('user');
		var that = this;
		Meteor.call("changeUserType", targetUserId, selected, function(err, res) {
			if (err) {
				if (err.error == 10002)$(that.refs.warn).text("권한이 없습니다");
				if (err.error == 10003)$(that.refs.warn).text("팀에는 최소 한명의 관리자가 필요힙니다");
				selectBox.value = Number(!selected);
			} //else if (targetUserId == that.props.user._id && selected == 0)FlowRouter.reload();
		})
	},
	renderMember: function(){
		var i = 0;
		return this.data.members.map(
				m =>(
						<tr key={m._id}>
							<td>{m.profile.name}</td>
							<td>{m.emails[0].address}</td>
							<td>
								<select className="form-control" defaultValue={m.profile.userType? "1": "0"}
												onChange={this.updateUserType} data-user={m._id}>
									<option value="1">관리자</option>
									<option value="0">멤버</option>
								</select>
							</td>
						</tr>
				)
		);
	},
	render: function(){
		return(
				<div id="members">
					<p className="warn" ref="warn"></p>
					<table className="team-member">
						<tbody>
							{this.renderMember()}
						</tbody>
					</table>
				</div>
		)
	}
});





Settings = React.createClass({
	mixins: [ReactMeteorData],
	getMeteorData: function(){
		return {
			user: Meteor.user(),
			team: Teams.findOne({_id: Meteor.user().profile.teamId})
		}
	},
	componentWillMount: function(){
		Meteor.subscribe('teams');
	},
	componentDidMount: function () {
		if(this.data.user.profile.userType){
			$(this.refs.btnTeam).addClass("active");
			$(this.refs.setTeam).removeClass("hide");
		}else{
			$(this.refs.btnPerson).addClass("active");
			$(this.refs.setPerson).removeClass("hide");
		}
		$(".sliding-switch").bootstrapSwitch();
	},
	componentDidUpdate: function(prevProps, prevState){
		if(!this.data.user.profile.userType){
			$(this.refs.btnPerson).addClass("active");
			$(this.refs.setPerson).removeClass("hide");
			$(this.refs.setTeam).addClass("hide");
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
		if(!this.data.user.profile.userType) return <h1>준비 중 입니다</h1>;
		return (
				<div id="setting">
					<ul className="nav nav-tabs">
						{this.data.user.profile.userType?(
								<li ref="btnTeam" data-target="setTeam">
									<a href="#" onClick={this.changeShow}>팀 설정</a>
								</li>
						):""}
						{/*<li ref="btnPerson" data-target="setPerson">*/}
						{/*	<a href="#" onClick={this.changeShow} >개인설정</a>*/}
						{/*</li>*/}
					</ul>
					<div className="setting-views" ref="settingViews">
						{/*<div ref="setPerson" className="setting-view hide">*/}
						{/*	<Accordion title="프로필 수정"*/}
						{/*						 renderMenu={ <PersonSetting.Profile user={this.data.user}/> }/>*/}
						{/*	<Accordion title="이메일 알림 설정"*/}
						{/*						 renderMenu={ <PersonSetting.EmailAlarm user={this.data.user}/> }/>*/}
						{/*	<Accordion title="회원 탈퇴"*/}
						{/*						 renderMenu={ <PersonSetting.DeleteAccount user={this.data.user}/> }/>*/}
						{/*</div>*/}
						<div ref="setTeam" className="setting-view hide">
							<Accordion title="주소 수정"
												 renderMenu={ <TeamSetting.EditAddress user={this.data.user} team={this.data.team}/> }/>
							<Accordion title="투표 관리"
												 renderMenu={ <TeamSetting.Vote user={this.data.user} team={this.data.team}/> }/>
							<Accordion title="팀원 관리" user={this.data.user}
												 renderMenu={ <TeamSetting.Member user={this.data.user} team={this.data.team}/> }/>
						</div>
					</div>
				</div>
		);
	}
});