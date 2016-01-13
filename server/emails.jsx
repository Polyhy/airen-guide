const {PropTypes} = React;

Emails = React.createClass({
	render: function(){
		return false;
	}
});

Emails.VerifyUser = React.createClass({
	propTypes: {
		emailForm: PropTypes.shape({
			url: PropTypes.string.isRequired,
			userName: PropTypes.string.isRequired,
			hostUrl: PropTypes.string.isRequired
		}).isRequired
	},
	render: function(){
		var context = this.props.emailForm.teamId != -1 ? "이메일 인증을 완료하면, 회원 가입이 모두 완료됩니다." :"이메일 인증을 완료하면, 팀 만들기를 계속 진행합니다";
		return (
				<table align="center" border="0" width="630" cellPadding="0" cellSpacing="0">
					<tbody style={{backgroundColor:"#fff"}}>
					<tr style={{backgroundColor:"#fff", borderSpacing:"0"}} width="630" height="60">
						<td width="630" height="100" style={{lineHeight:"0",background:"#586064",borderRadius:"0px 0px 0px 0px"}}>
							<div style={{width:"100%",height:"100%"}}>
								<a href={this.props.emailForm.hostUrl} target="_blank">
                  <span style={{display:"inline-block",width:"60px",position:"relative",margin:"10px",height:"0px"}}>
                    <span style={{display:"table",backgroundColor:"#fff768",background:"linear-gradient(135deg, #fff876 50%, #ffe35a 50%)",borderRadius:"50%",position:"relative",zIndex:"5",width:"60px",height:"60px",display:"block"}}>
                      <span style={{fontSize:"80px",display:"tableCell",verticalAlign:"middle",textAlign:"center",color:"#FFD508",textShadow:"2px 0px #FFF876, 0px 2px #FFF876"}}></span>
                    </span>
                    <span style={{position:"absolute",WebkitTransform:"rotate(90deg)",MozTransform:"rotate(90deg)",MsTransform:"rotate(90deg)",OTransform:"rotate(90deg)",borderBottom:"30px solid #D04153",borderLeft:"20px solid transparent",borderRight:"20px solid transparent",bottom:"-70px",left:"8px"}}></span>
                    <span style={{position:"absolute",WebkitTransform:"rotate(-90deg)",MozTransform:"rotate(-90deg)",MsTransform:"rotate(-90deg)",OTransform:"rotate(-90deg)",borderBottom:"30px solid #D04153",borderLeft:"20px solid transparent",borderRight:"20px solid transparent",bottom:"-70px",right:"8px",}}></span>
                  </span>
									<p style={{display:"inline-block",position:"absolute",left:"70px",top:"70px",letterSpacing:"3px",color:"#FFF876",textShadow:"0.7px 0px #ffd508, 0px 0.7px #ffd508, -0.7px 0px #ffd508, 0px -0.7px #ffd508",fontSize:"18px"}}>Airenguide</p>
								</a>
							</div>
						</td>
					</tr>
					<tr>
						<td style={{borderLeft:"1px solid #d5d5d5",borderRight:"1px solid #d5d5d5"}}>
							<table align="center" border="0" width="628" cellPadding="0" cellSpacing="2"
										 style={{color:"#7d7d7d",fontSize:"12px"}}>
								<tbody>
								<tr height="60px">
									<td width="60px"></td>
									<td width="510px;"><p><b style={{color:"#545454"}}>{this.props.emailForm.userName}</b>님, 거의 다 되었어요!</p>
										<hr/>
									</td>
									<td width="60px;"></td>
								</tr>
								<tr>
									<td width="60px;"></td>
									<td width="510px;">
										<p>아래의 링크를 클릭해서 이메일 인증을 진행해  주세요.</p>
										<p>{context}</p>
										<p>{"가입해 주셔서 감사합니다 :)"}</p>
										<br/>
										<p><a href={this.props.emailForm.url}>{this.props.emailForm.url}</a></p>
									</td>
									<td width="60px;"></td>
								</tr>
								</tbody>
							</table>
						</td>
					</tr>
					<tr style={{backgroundColor:"#fff"}}>
						<td><div/></td>
					</tr>
					<tr style={{backgroundColor:"#fff"}} height="20">
						<td style={{borderLeft:"1px solid #d5d5d5",borderRight:"1px solid #d5d5d5"}}></td>
					</tr>
					<tr style={{backgroundColor:"#fff"}}>
						<td style={{borderLeft:"1px solid #d5d5d5",borderRight:"1px solid #d5d5d5",borderBottom:"1px solid #d5d5d5",borderRadius:"1px 1px 40px 0px"}}>
							<table align="center" border="0" width="628" cellPadding="0" cellSpacing="2"
										 style={{color:"#b5b5b5",fontSize:"10px"}}>
								<tbody>
								<tr height="60px">
									<td width="60px"></td>
									<td width="510px;">
										<div>상호 : (주)아이렌소프트 | 대표자 : 한제헌 | 주소 : 서울시 마포구 잔다리로3안길 5 5층 아이렌소프트 | 사업자 등록번호 :214-88-59388
										</div>
										<div>메일 : support@airensoft.com </div>
										<div>Copyright 아이렌소프트 @ All Rights Reserved.</div>
									</td>
									<td width="60px;"></td>
								</tr>
								</tbody>
							</table>
						</td>
					</tr>
					</tbody>
				</table>
		);
	}
});

Emails.VerifyTeamAndUser = React.createClass({
	render: function(){
		return false;
	}
});