sendEmail = function(mailTemplate, emailForm, user){
	var renderedEmailTemplate = React.createElement(mailTemplate, {emailForm: emailForm});
	//return ReactDOMServer.renderToStaticMarkup(renderedEmailTemplate);
	return  Email.send({
		subject: '[AirenGuide] 투표가 시작되었습니다',
		to: user.emails[0].address,
		from: "AirenGuide",
		html: renderedEmailTemplate
	})
};