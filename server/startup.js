Meteor.startup(function (){
	console.log(Meteor.absoluteUrl());
	process.env.MAIL_URL = "smtp://airensoft:dkdlfps12!@@smtp.gmail.com:465";

});

WebApp.connectHandlers.use("/restaurant/list", function(req, res, next) {
	//res.setHeader("access-control-allow-origin", "*");
	return next();
});