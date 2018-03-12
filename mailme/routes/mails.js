var models = require('../models/mailme_model');

module.exports = function (app) {
	app.get('/mail', isLoggedIn, (req,res)=> {
		var prom = models.Inbox.findById({_id : req.user._id});
		prom.then(function(inbox) {
			if(inbox.messages.length == 0)
				res.render('mail', {user: req.user, mailDetails: false, mail : false});
			else
			{
				for(var i=0; i<inbox.messages.length; i++)
				{
					var mail = inbox.messages[i];
					var arr=[];
					var promise = models.Message.findById({_id : mail.msgid});
					promise.then(function(newMail) { 
						arr.push(newMail);
						//console.log(inbox.messages.length+" "+arr.length+"\n");
						if(arr.length  == inbox.messages.length)
							//console.log(arr);
							res.render('mail', {user:req.user, mail : inbox.messages, mailDetails : arr});
					});
				}
			}
		});		
	});

	app.get('/compose', isLoggedIn, (req,res)=> {
		res.render('compose', {user:req.user});
	});

	app.post('/compose', isLoggedIn, (req,res)=> {
		
		var newMessage = models.Message(req.body);
		newMessage.save().then(function(message) {
				req.body['msgid'] = message._id;
				var time = new Date().toLocaleString();
				console.log("\n\ntime:\n"+time);
				req.body['time']  = time;
				console.log(req.body);
				models.Inbox.findOne({mailmeid : req.body.from}, function(err,inbox) {
					inbox.messages.push(req.body);
					inbox.save().then( function(inboxMessage) {
						console.log(inboxMessage);
						models.Sentbox.findOne({mailmeid:req.body.to}, function(err,sentbox) {
							console.log(sentbox);
							sentbox.messages.push(req.body);
							sentbox.save().then( function(sentboxMessage) {
								console.log(sentboxMessage);
							});
						});	
					});
				});
		});
		res.redirect('/mail');
	});
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
    	return next();
    res.redirect('signin');
}