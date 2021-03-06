const {PropTypes} = React;

//name space
Signup = React.createClass({
	render: function(){
		return false;
	}
});

//Signup Mixin
var SignupMixin = {
	checkInputValue: function(event){
		event.preventDefault();
		var inputName = $('input[name=signup-name]').val();
		var inputEmail = $('input[name=signup-email]').val();
		var inputPass = $('input[name=signup-pass]').val();

		var isEmail = ()=>{
			var format = /^[a-zA-Z0-9\-_]+(\.[a-zA-Z0-9\-_]+)*@[a-z0-9]+(\-[a-z0-9]+)*(\.[a-z0-9]+(\-[a-z0-9]+)*)*\.[a-z]{2,4}$/;
			return inputEmail.match(format)
		};

		if(!this.props.teamId){
			history.back();
		}else if (!inputName){
			$('.warn').text("이름을 입력해 주세요");
		}else if (!inputEmail){
			$('.warn').text("이메일을 입력해 주세요");
		}else if(!isEmail()){
			$('.warn').text("이메일 형식이 맞지 않습니다");
		}else if(!inputPass){
			$('.warn').text("비밀번호를 입력해 주세요");
		}else{
			var team = Teams.findOne({_id:this.props.teamId});
			var signupInfo={
				profile:{
					teamId: this.props.teamId,
					team: team? team._id: -1,
					teamName: team? team.name: null,
					name: inputName,
					notiSetting: {  recvStart: 1, recvResult: 1  }
				},
				username: "",
				email: inputEmail,
				password: inputPass
			};
			this.signup(signupInfo);
		}
	},
	signup: function(userInfo){
		var $onprogress = $(this.refs.progress);
		$onprogress.removeClass("hide");
		Accounts.createUser(userInfo, (err)=>{
			if (err) {
				$onprogress.addClass("hide");
				if (err.error == 403) $('.warn').text("이미 존재하는 계정입니다.");
				else if(err.error == 100002) this.signupCallBack();
				else console.log(err);
			}
		});
	},
	renderForm: function(){
		return(
				<div>
					<form>
						<p className="warn" ref="formError"></p>
						<div className="form-group">
							<input type="text" placeholder="name"
										 className="form-control" ref="signupName" name="signup-name" />
						</div>
						<div className="form-group">
							<input type="text" placeholder="you@domain.com"
										 className="form-control" ref="signupEmail" name="signup-email"/>
						</div>
						<div className="form-group">
							<input type="password" placeholder="password"
										 className="form-control" ref="signupPass" name="signup-pass" />
						</div>
					</form>
					<div ref="progress" className="hide" style={{position:"fixed", left:"0", top:"0", width:"100%", height:"100%"}}>
						<PolyhyComponent.OnProgress />
					</div>
				</div>
		)
	}
};

/******************************************************************************
 *
 *	Sign form
 *
 ******************************************************************************/
Signup.SignupForm = React.createClass({
	render: function(){
		return(
				<div>
					<form>
						<p className="warn" ref="formError"></p>
						<div className="form-group">
							<input type="text" placeholder="name"
										 className="form-control" ref="signupName" name="signup-name" />
						</div>
						<div className="form-group">
							<input type="text" placeholder="you@domain.com"
										 className="form-control" ref="signupEmail" name="signup-email"/>
						</div>
						<div className="form-group">
							<input type="password" placeholder="password"
										 className="form-control" ref="signupPass" name="signup-pass" />
						</div>
					</form>
					<div id="progress" className="hide" style={{position:"fixed", left:"0", top:"0", width:"100%", height:"100%"}}>
						<PolyhyComponent.OnProgress />
					</div>
				</div>
		)
	}
});

/******************************************************************************
 *
 *	Sign page 1
 *
 ******************************************************************************/
var SignupForm = Signup.SignupForm;
Signup.SignPage1 = React.createClass({
	propTypes:{
		teamId: PropTypes.string.isRequired
	},
	mixins: [SignupMixin],
	subItems: {},
	componentWillMount: function(){
		if (!this.props.teamId) FlowRouter.redirect('/');
		this.subItems.teamNames = Meteor.subscribe("team-names");
	},
	componentWillUnmount: function(){
		for (var key in this.subItems){
			this.subItems[key].stop();
		}
	},
	signupCallBack: function(){
		FlowRouter.setQueryParams({verify:""});
	},
	render: function(){
		return (
				<div id="signup--page-1">
					<p className="tip">사용할 이메일과 비밀번호, 이름을 입력해 주세요.</p>
					{/*<SignupForm />*/}
					{this.renderForm()}
					<button type="button" className="btn btn-ok" onClick={this.checkInputValue}>계정 만들기</button>
				</div>
		)
	}
});


/******************************************************************************
 *
 *	Verify
 *
 ******************************************************************************/
Verify = React.createClass({
	componentDidMount: function(){
		$("#login-account--btn-back").addClass('hide');
		if ($(document).width() >= 768)
			$(document.body).css("background-color", "#eee");
	},
	componentWillUnmount: function(){
		$(document.body).css("background-color", "#fff");
	},
	verifyEmail: function(event){
		event.preventDefault();
		Accounts.verifyEmail(Session.get('verifyEmailToken'), function(err, data) {
			if (err) {
				console.log(err.reason);
			} else {
				Session.set('verifyEmailToken', null);
				FlowRouter.redirect('/');
			}
		});
	},
	render: function(){
		return (
				<div id="verify--page">
					<p className="tip">이메일 인증을 완료해 주세요</p>
					<p id="signup-tip">아래의 버튼을 눌러 이메일 인증을 완료해 주세요. 이메일 인증을 완료하면 회원 가입이 모두 완료됩니다.</p>
					<a type="button" className="btn btn-next" onClick={this.verifyEmail}>확인</a>
				</div>
		)
	}
});



//name space
CreateTeam = React.createClass({
	render: function(){
		return false;
	}
});

/******************************************************************************
 *
 *	Create team page 1
 *
 ******************************************************************************/
CreateTeam.CreateTeamPage1 = React.createClass({
	mixins: [SignupMixin],
	signupCallBack: function(){
		var tip = "입력하신 이메일로 링크를 보냈습니다. 이메일로 받은 링크를 클릭해 이메일 주소를 인증해 주세요. 이메일 인증을 완료하면 팀 생성을 진행합니다.";
		Session.set("create-team--tip", tip);
		FlowRouter.setQueryParams({verify:""});
	},
	componentDidMount: function(){
		$("#login-account--btn-back").removeClass('hide');
	},
	render: function(){
		return (
				<div id="create-team--page-1">
					<p className="tip">
						이메일과 비밀번호, 이름을 입력해 주세요.<br/>
						입력하신 이메일과 비밀번호는 로그인시 사용합니다
					</p>
					{this.renderForm(-1)}
					<button type="button" className="btn btn-next" onClick={this.checkInputValue}>계속하기</button>
				</div>
		);
	}
});

/******************************************************************************
 *
 *	Create team page 2
 *
 ******************************************************************************/
CreateTeam.CreateTeamPage2 = React.createClass({
	googleMap: null,
	propTypes:{
		verifyEmailToken: PropTypes.string.isRequired
	},
	//findAddress: function(){
	//	var googleMap = this.googleMap;
	//	new daum.Postcode({
	//		oncomplete: function(data) {
	//			var teamAddress ={
	//				address: data.address,
	//				addressEnglish: data.addressEnglish,
	//				latlng: getLatLng(data.addressEnglish)
	//			};
	//			if (teamAddress.latlng){
	//				$('.warn').text("");
	//				googleMap.drawMap(teamAddress.latlng.lat, teamAddress.latlng.lng, 18, true);
	//				$('input[name=create-team-address]').val(data.address);
	//			}
	//			else $('.warn').text("잘못된 주소 입니다");
	//		}
	//	}).open();
	//},
	createTeam: function(){
		var $form = $(this.refs.createTeamForm);
		var inputTeamName = $form.find("[name='create-team-name']").val();
		var inputAddress = $form.find("[name='address']").val();
		var latlng = {
			lat: Number($form.find("[name='address-lat']").val()),
			lng: Number($form.find("[name='address-lng']").val())
		};

		if (!inputTeamName){
			$form.find(".warn").text("팀 이름을 입력해 주세요");
		} else if (!inputAddress){
			$form.find(".warn").text("팀 주소를 입력해 주세요");
		} else if (!latlng.lat || !latlng.lng){
			$form.find(".warn").text("잘못된 주소입니다");
		} else {
			var teamInfo = {
				name: inputTeamName,
				address: inputAddress,
				latlng: latlng
			};
			var token = this.props.verifyEmailToken;
			var callback = this.verifyUser;
			Meteor.call("createTeam", teamInfo, token, function(err, res){
				if(err){
					console.error(err)
				}else{
					console.log(res);
					Meteor.call("registerAtTeam", res.result.userId, res.result.teamId, true, function(error, result){
						if(!error) callback(token);
					});
				}
			});
		}
	},
	verifyUser: function(token){
		Accounts.verifyEmail(token, function(err) {
			if (err) {
				console.log(err.reason);
			} else {
				Meteor.logout(function(){
					var tip = "팀과 계정이 성공적으로 만들어졌습니다. 가입해 주셔서 감사합니다.";
					Session.set("create-team--tip", tip);
					FlowRouter.setQueryParams({verify:""});
				});
			}
		});
	},
	//componentDidMount: function(){
	//	this.googleMap = GoogleMapBuilder(document.getElementById("create-team--map"), 37.5506241, 126.9192726, 18);
	//},
	render: function(){
		return (
				<div id="create-team--page-1">
					<p className="tip">팀정보를 입력해 주세요</p>
					<form ref="createTeamForm">
						<p className="warn" ref="formError"></p>
						<PolyhyComponent.InputText name="create-team-name" placeholder="teamname" />
						<PolyhyComponent.InputAddressWithMap
								label="" name={"address"} detail={false}
								placeholder="address" width={"100%"} height={"300px"}
								hideWarn={true}/>
					</form>
					<button type="button" className="btn btn-ok" onClick={this.createTeam}>팀 만들기 ></button>
				</div>
		);
	}
});


