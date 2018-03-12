var mongoose = require('mongoose');
var bcrypt   = require('bcrypt-nodejs');

var userSchema = new mongoose.Schema({
	mailmeid : String,
	password : String
});

var profileSchema = new mongoose.Schema({
	name   	 : String,
	age    	 : Number,
	gender 	 : String,
	phone  	 : Number,
	mailmeid : String
});

var messageSchema = new mongoose.Schema({
	from 	: String,
	to   	: [String],
	cc	 	: [String],
	bcc  	: [String],
	subject : String,
	message : String,
	time    : { type: Date, default: Date.now },
});

var inboxSchema = new mongoose.Schema({
	mailmeid : String,
	messages : 
	[
		{
			msgid	  : String,			
			replies   : [String],
			isread	  : String,
			important : String,
			starred   : String,
		}
	]
});

var sentboxSchema = new mongoose.Schema({
	mailmeid : String,
	messages :
	[
		{
			msgid	  : String,			
			replies   : [String],
			isread	  : String,
			important : String,
			starred   : String
		}
	]
});


User 			= mongoose.model('User',userSchema);
Profile 		= mongoose.model('Profile', profileSchema);
Message 		= mongoose.model('Message', messageSchema);
Inbox 			= mongoose.model('Inbox', inboxSchema);
Sentbox 		= mongoose.model('Sentbox', sentboxSchema);

module.exports = {
	User 	: User,
	Profile : Profile,
	Message : Message,
	Inbox 	: Inbox,
	Sentbox : Sentbox
}