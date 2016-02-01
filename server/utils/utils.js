sendEmail = function(subject, mailTemplate, emailForm, user){
	var emailComponent = React.createElement(mailTemplate, {emailForm: emailForm});
	//return ReactDOMServer.renderToStaticMarkup(renderedEmailTemplate);
	var renderedEmailTemplate = ReactDOMServer.renderToStaticMarkup(emailComponent);
	return  Email.send({
		subject: subject,
		to: user.emails[0].address,
		from: "AirenGuide",
		html: renderedEmailTemplate
	})
};