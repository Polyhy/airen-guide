Meteor.startup(function (){
	console.log(Meteor.absoluteUrl());
	process.env.MAIL_URL = "smtp://airensoft:dkdlfps12!@@smtp.gmail.com:465";

	Crons.find().fetch().map(cron=>SyncedCron.remove(cron.name));
	Crons.find().fetch().map(cron=>voteHelper.startVoteCron(cron));
	SyncedCron.start();

});
