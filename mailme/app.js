var express  = require('express');
var app      = express();
var mongoose = require('mongoose');
var passport = require('passport');
var flash    = require('connect-flash');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(bodyParser.json());

var keys = require('./config/keys');

// configuration ===============================================================
mongoose.connect(keys.mongodb.dbURI); // connect to our database


// set up our express application
app.use(express.static(__dirname + '/public'));
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs'); // set up ejs for templating

// required for passport
app.use(session({
    secret: 'dattugvs', // session secret
    resave: true,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./routes/signing')(app,passport); // load our routes and pass in our app and fully configured passport
require('./routes/mails')(app);
require('./config/passport')(app,passport); // pass passport for configuration

app.listen(3000);
console.log('port:3000');
