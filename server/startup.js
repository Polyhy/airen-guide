Meteor.startup(function (){
	console.log(Meteor.absoluteUrl());
	process.env.MAIL_URL = "smtp://airensoft:dkdlfps12!@@smtp.gmail.com:465";
});