var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var session = require('express-session');
var config = require('./config.json');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var mongoose = require('mongoose');
var School = require('./models/School');
var User = require('./models/User');

var subjectCtrl = require('./controllers/subjectCtrl');
var userCtrl = require('./controllers/userCtrl');
var schoolCtrl = require('./controllers/schoolCtrl');
var emailVerifyCtrl = require('./controllers/emailVerifyCtrl');
var emailCtrl = require('./controllers/emailCtrl');

var alg = require('./data/saxon_alg.js');
var geo = require('./data/saxon_geo.js');
var alg2 = require('./data/saxon_alg2.js');

var bcrypt = require('bcrypt');

var nev = require('email-verification')(mongoose);
var nodemailer = require("nodemailer");

var port = config.serverPort;
var corsOptions = {
    origin: 'http://localhost:' + port
};

var app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/../public/'));
app.use(session({
    secret: config.sessionSecret,
    saveUninitialized: true,
    resave: true
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done) {
    User.findOne({
        username: username
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        if (!user) {
            return done(null, false);
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return done(null, false)
        }
        return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, {
        _id: user._id,
        school_id: user.school_id,
        school_name: user.school_name,
        school_city: user.school_city,
        school_state: user.school_state,
        username: user.username,
        type: user.type,
        email: user.email
    });
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

app.listen(port, function() {
    console.log('server running on port', port);
})

mongoose.connect('mongodb://localhost:27017/saxon', function(err) {
    if (err) throw err;
});

// ------------------------- loginService ------------------------- //
// login
app.post('/api/login', userCtrl.login);

// remove unused admin keys if they're a week old
app.delete('/api/schools/:id/removeOldKeys/:today', schoolCtrl.removeOldKeys)
// ------------------------- loginService ------------------------- //



// ------------------------- modifyService ------------------------- //
// get admin key info when submitting admin key
app.get('/api/schools/:id/:subject/adminKeys/:key', schoolCtrl.getKeys);

// delete admin key after it's been used
app.delete('/api/schools/:id/adminKeys/:key', schoolCtrl.deleteKey);

// send email to admin requesting update
app.post('/api/email', emailCtrl.sendEmail);

// store skipped lessons, update HW, and retrieve (1 subject)
app.put('/api/schools/:id/:subject/skipped', subjectCtrl.storeSkipped, subjectCtrl.update);
// ------------------------- modifyService ------------------------- //



// ------------------------- adminService ------------------------- //
// delete user
app.delete('/api/users/:username', userCtrl.destroy);

// reset all HW
app.put('/api/schools/:id/reset', schoolCtrl.update)
// ------------------------- adminService ------------------------- //



// ------------------------- mainService ------------------------- //
// check if user is authenticated
app.get('/api/isAuthed', userCtrl.isAuthed);

// get all or one (query) users
app.get('/api/users', userCtrl.index);

// create school, admin, and student users
app.post('/api/schools', emailVerifyCtrl.create);

// get session data
app.get('/api/session', function(req, res, next) {
    res.send(req._passport.session)
});

// get all HW
app.get('/api/schools/:id/allHW', subjectCtrl.getAllHW);

// logout
app.get('/api/logout', userCtrl.logout);

// redirect after verify email
app.get('/email-verification/:URL', emailVerifyCtrl.emailLinkRedirect)
// ------------------------- mainService ------------------------- //



// ------------------------- Not used in front end ------------------------- //

// get all schools or one (query)
app.get('/api/schools/', schoolCtrl.index);

// delete school and associated users
app.delete('/api/schools/:name', schoolCtrl.destroy);
// ------------------------- Not used in front end ------------------------- //