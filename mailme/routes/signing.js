module.exports = function(app, passport) {

	app.get('/', isLoggedIn, (req,res)=> {
            res.render('signin');
    });
    app.get('/signup', isLoggedIn, (req,res)=> {
			res.render('signup');
	});

	app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/mail', 
            failureRedirect : '/signup', 
            failureFlash : true
    }));

	app.get('/signin', isLoggedIn, (req,res)=> {
		res.render('signin');
	});

    app.post('/signin', passport.authenticate('local-login', {
            successRedirect : '/mail',
            failureRedirect : '/signin',
            failureFlash : true
    }));

    app.get('/logout', (req,res)=> {
        req.logout();
        res.redirect('/');
    });
}

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
    	res.redirect('/mail');
    return next();
}