Accounts.emailTemplates.from = 'AirenGuide';
Accounts.emailTemplates.siteName = 'AirenGuide';


Accounts.emailTemplates.verifyEmail.subject = function(user) {
	return '[AirenGuide] ' + user.profile.name + '님, 이메일을 인증해 주세요.';
};

Accounts.emailTemplates.verifyEmail.html = function(user, url){
	//console.log(user);
	var emailForm = {
		userName: user.profile.name,
		hostUrl: Meteor.absoluteUrl(),
		url: user.profile.team != -1? url : url + "???createteam",
		teamId: user.profile.team
	};
	var emailTemplate = React.createElement(Emails.VerifyUser, {emailForm: emailForm});
	return ReactDOMServer.renderToStaticMarkup(emailTemplate);
};

Accounts.config({
	sendVerificationEmail: true
});

Accounts.validateLoginAttempt(function(type){
	if(type.user && type.user.emails && !type.user.emails[0].verified )
		throw new Meteor.Error(100002, "email not verified" );
	return true;
});