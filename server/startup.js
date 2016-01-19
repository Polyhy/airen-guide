Meteor.startup(function (){
	console.log(Meteor.absoluteUrl());
	process.env.MAIL_URL = "smtp://airensoft:dkdlfps12!@@smtp.gmail.com:465";

	//WebApp.connectHandlers.use("/restaurant/list", function(req, res, next) {
	//	//console.log(res);
	//	//res.setHeader("Access-Control-Allow-Origin", "https://maps.googleapis.com");
	//	//return next();
	//});
});