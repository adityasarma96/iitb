var LocalStrategy    = require('passport-local').Strategy;
var models 			 = require('../models/mailme_model')

module.exports = function(app, passport) {
	passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('local-signup', new LocalStrategy({
    	usernameField 	  : 'mailmeid',
    	passwordField 	  : 'password',
    	passReqToCallback : true
    },
    function(req, mailmeid, password, done) {
    	process.nextTick(function() {
    		if(!req.user)
    		{
    			models.User.findOne({'mailmeid': mailmeid}, function(err,user)
    			{
    				if(err) return done(err);
    				if(user) return done(null, false, req.flash('signupMessage', 'The mailme id is already Taken'));
      				else
      				{
      					var newUser      = new models.User(req.body);
      					var newProfile   = new models.Profile(req.body);
                var inboxMessage = new models.Inbox();
                var sentMessage  = new models.Sentbox();
      					newUser.save().then(function (user) {
      						console.log(user);
      						  newProfile._id  = user._id;
                  inboxMessage._id  = user._id;
                   sentMessage._id  = user._id;

                   inboxMessage.mailmeid = req.body.mailmeid;
                   sentMessage.mailmeid = req.body.mailmeid;

      						newProfile.save().then( function(profile){ 
                      inboxMessage.save().then( function(inbox){
                          sentMessage.save().then( function(sentbox)
                          {
                            return done(null, profile);
                          });
                      });
                  });
                 

    
      				});

      			}
    		});
    	}
    });
    }));

    passport.use('local-login', new LocalStrategy({    
        usernameField : 'mailmeid',
        passwordField : 'password',
        passReqToCallback : true
    },
    function(req, mailmeid, password, done) {
        process.nextTick(function() {
            if (!req.user)
            {   
             	models.Profile.findOne({'mailmeid' : mailmeid}, function(err,profile) {
             		if(err) return done(err);
             		if(profile) return done(null, profile);
             	});
            }
        });
    }));
}