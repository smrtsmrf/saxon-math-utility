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

var port = 3000;
var corsOptions = {
    origin: 'http://localhost:' + port
};

var app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public/'));
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


app.get('/email-verification/:URL', emailVerifyCtrl.emailLinkRedirect)

// ----------create school, admin, and student users - called in signupCtrl....................//
app.post('/api/schools', emailVerifyCtrl.create);

// -----------------------send email to admin requesting an update................................//
app.post('/api/email', emailCtrl.sendEmail);


// --------------- get all schools or one (query) NOT USED IN FRONT END...................//
app.get('/api/schools/', schoolCtrl.index);

// -------------- delete school & assoc. users NOT USED IN FRONT END..................//
app.delete('/api/schools/:name', schoolCtrl.destroy);


// ---------------------------------- get specific admin keys for school....................................//
app.get('/api/schools/:id/:subject/adminKeys/:key', schoolCtrl.getKeys);

// ---------------------------------- delete admin key for school....................................//
app.delete('/api/schools/:id/adminKeys/:key', schoolCtrl.deleteKey);

// -------------------------------- delete unused/old admin keys for school.................................//
app.delete('/api/schools/:id/removeOldKeys/:today', schoolCtrl.removeOldKeys)


//-------------------------------- login - called in loginCtrl............................................//
app.post('/api/login', userCtrl.login);

app.get('/api/session', function(req, res, next) {
    res.send(req._passport.session)
});

app.get('/api/isAuthed', userCtrl.isAuthed);

app.get('/api/logout', userCtrl.logout);



// ------------ get all or one (query) users - called in signupCtrl..................................//
app.get('/api/users', userCtrl.index);

// ------------------------ delete user NOT USED IN FRONT END........................................//
app.delete('/api/users/:username', userCtrl.destroy);



// ----------------------- update school/subject - called in HW Ctrls.......................................//
// app.put('/api/schools/:id/:subject', subjectCtrl.update)
// app.put('/api/schools/:name/:subject', subjectCtrl.update, subjectCtrl.index)

// -------------------- store school/subjectSkipped - called in subCtrls...................................//
app.put('/api/schools/:id/:subject/skipped', subjectCtrl.storeSkipped, subjectCtrl.update);

// ---------------------------------- get school/subjectSkipped............................................//
// app.get('/api/schools/:id/:subject/skipped', subjectCtrl.getSkipped);

app.get('/api/schools/:id/allHW', subjectCtrl.getAllHW);



// ---------------------------------- reset school/subject..............................................//


app.put('/api/schools/:id/reset', schoolCtrl.update)


// ---------------------------------- get school/subject..............................................//
// app.get('/api/schools/:id/:subject', subjectCtrl.index)
// app.get('/api/schools/:name/:subject', subjectCtrl.index)