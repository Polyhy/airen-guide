const {PropTypes} = React;

//name space
Login = React.createClass({
	render: function(){
		return false;
	}
});

/******************************************************************************
 *
 *	login step 1
 *
 ******************************************************************************/
Login.LoginPage1 = React.createClass({
	componentDidMount: function(){
		$("#login-account--btn-back").addClass('hide');
	},
	nextStep: function(event){
		var inpputTeamName = ReactDOM.findDOMNode(this.refs.teamName).value;
		var team = Teams.findOne({name:inpputTeamName});
		if(Meteor.isClient && team){
			FlowRouter.setQueryParams({team: team._id});
		}else{
			$(ReactDOM.findDOMNode(this.refs.formError)).text("일치하는 팀이 없습니다");
		}
	},
	render: function(){
		return(
				<div id="login--page-1">
					<p className="tip">로그인 할 팀 이름을 입력해 주세요</p>
					<form>
						<p className="warn" ref="formError"></p>
						<div className="form-group">
							<input type="text"
										 className="form-control"
										 ref="teamName"
										 name="team-name"
										 placeholder="team name"/>
						</div>
					</form>
					<button type="button"
									className="btn btn-next"
									onClick={this.nextStep}>계속 하기 ></button>
					<div className="divide"><hr/><span>또는</span><hr/></div>
					<a type="button" className="btn btn-ok" href="/user/createteam">새로운 팀 만들기</a>
				</div>
		);
	}
});

/******************************************************************************
 *
 *	login step 2
 *
 ******************************************************************************/
Login.LoginPage2 = React.createClass({
	subItems: {},
	getInitialState: function(){
		var team = Teams.findOne({_id: this.props.teamId});
		return {team: team}
	},
	login: function(event){
		var teamId = this.props.teamId;
		var inputEmail = this.refs.loginEmail.value;
		var inputPass = this.refs.loginPass.value;
		if(teamId && inputEmail && inputPass){
			Meteor.loginWithPassword(inputEmail, inputPass, (err)=>{
				if(!err){
					if(Meteor.user().profile.teamId == teamId){
						Session.set('teamId', null);
						FlowRouter.redirect('/');
					}else {
						$(".warn").text("해당 팀에 일치하는 정보가 없습니다")
					}
				}else{
					console.log(err);
					$(".warn").text("이메일 또는 비밀번호가 일치하지 않습니다")
				}
			});
		}else if(!teamId){
			$(".warn").text("팀 정보가 없습니다")
		}else if(!inputEmail){
			$(".warn").text("이메일을 입력해 주세요")
		}else{
			$(".warn").text("비밀번호를 입력해 주세요")
		}
	},
	goSignup: function(e){
		Session.set('teamId', this.state.team._id);
		FlowRouter.redirect('/user/signup?team='+FlowRouter.getQueryParam('team'));
	},
	render: function(){
		//if (!this.state.team) return false;
		return(
				<div id="login--page-2">
					<p className="tip">이메일과 비밀번호를 입력해 주세요</p>
					<form>
						<p className="warn" ref="formError"></p>
						<div className="form-group">
							<input type="text" placeholder="you@domain.com"
										 className="form-control" ref="loginEmail" name="login-email"/>
						</div>
						<div className="form-group">
							<input type="password" placeholder="password"
										 className="form-control" ref="loginPass" name="team-login-pass" />
						</div>
						{/*<div className="checkbox">
						 <p id="remember-me">
						 <input type="checkbox" ref="loginRememberMe" name="team-login-remember-me"/>
						 로그인 상태 유지
						 </p>
						 </div>*/}
					</form>
					<button type="button" className="btn btn-ok" onClick={this.login}>로그인</button>
					<div id="signup-tip">
						{this.state.team.domain ? this.state.team.domain+"이메일 계정을 가지고 있다면," : ""}
						{this.state.team.name}팀에 새로운 계정을 만들 수 있습니다.
						<a onClick={this.goSignup}>계정 만들기</a>
					</div>
				</div>
		);
	}
});