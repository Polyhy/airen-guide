const {PropTypes} = React;

var Accordion = React.createClass({
	prpoTypes: {
		title: PropTypes.string.isRequired,
		renderMenu: PropTypes.func.isRequired
	},
	hideContext: function(){
		var $context = $(this.refs.context);
		if($context.hasClass('closed')){
			$context.removeClass('closed');
			$context.addClass('show');
		}
		else {
			$context.removeClass('show');
			$context.addClass('closed');
		}
	},
	render: function(){
		return (
				<div className="accordian-container">
					<p className="title">{this.props.title}</p>
					<button type="button" className="btn btn-default" onClick={this.hideContext}>더보기</button>
					<div className="polyhy-collapse closed" ref="context">
						{this.props.renderMenu()}
					</div>
				</div>
		)
	}
});

Settings = React.createClass({
	getInitialState: function(){
		return {user: Meteor.user()}
	},
	componentDidMount: function () {
		$(this.refs.btnPerson).addClass("active");
		$(this.refs.setPerson).removeClass("hide");
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
	renderProfile: function(){
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
	},
	renderAlarm: function(){
		return(
				<div>
					<form id="add-restaurant-form" ref="profileForm">
						<div className="form-group">
							<label htmlFor="recv-before">투표 <strong>시작시</strong> 이메일 알림 수신</label>
							<input type="checkbox" name="recv-before" />
						</div>
						<div className="form-group">
							<label htmlFor="recv-after">투표 <strong>종료시</strong> 이메일 알림 수신</label>
							<input type="checkbox" name="recv-after" />
						</div>
						<button type="button" style={{float:"right"}} className="btn btn-ok">확인</button>
					</form>
				</div>
		);
	},
	renderAccount: function(){
		return(
				<div>회원탈퇴<br/>회원탈퇴<br/>회원탈퇴<br/>회원탈퇴<br/>회원탈퇴<br/></div>
		);
	},
	render: function(){
		return (
				<div id="setting">
					<ul className="nav nav-tabs">
						<li ref="btnPerson" data-target="setPerson">
							<a href="#" onClick={this.changeShow} >개인설정</a>
						</li>
						{Meteor.user().profile.userType?(
								<li ref="btnTeam" data-target="setTeam">
									<a href="#" onClick={this.changeShow}>팀 설정</a>
								</li>
						):""}
					</ul>
					<div className="setting-views" ref="settingViews">
						<div ref="setPerson" className="setting-view hide">
							<Accordion title="프로필" renderMenu={this.renderProfile}/>
							<Accordion title="이메일 알림" renderMenu={this.renderAlarm}/>
							<Accordion title="회원 탈퇴" renderMenu={this.renderAccount}/>
						</div>
						<div ref="setTeam" className="setting-view hide">팀! 설! 정!</div>
					</div>
				</div>
		);
	}
});