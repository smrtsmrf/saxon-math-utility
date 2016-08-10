var express = require('express');
var session = require('express-session');
var config = require('./config.json');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var School = require('./models/School');
var User = require('./models/User');
var subjectCtrl = require('./controllers/subjectCtrl');
var userCtrl = require('./controllers/userCtrl');
var schoolCtrl = require('./controllers/schoolCtrl');

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
	User.findOne({username: username}, function(err, user) {
            if (err) {return done(err);}
            if (!user) {return done(null, false);}
            if (!bcrypt.compareSync(password, user.password)) {return done(null, false)}
            return done(null, user);
        });
    }
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
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

// ----------create school, admin, and student users - called in signupCtrl....................//
app.post('/api/schools', schoolCtrl.create);

// --------------- get all schools or one (query) NOT USED IN FRONT END...................//
app.get('/api/schools/', schoolCtrl.index);

// -------------- delete school & assoc. users NOT USED IN FRONT END..................//
app.delete('/api/schools/:name', schoolCtrl.destroy);



//-------------------------------- login - called in loginCtrl............................................//
app.post('/api/login', userCtrl.login);

// ------------ get all or one (query) users - called in signupCtrl..................................//
app.get('/api/users', userCtrl.index);

// ------------------------ delete user NOT USED IN FRONT END........................................//
app.delete('/api/schools/:id/users/:username', userCtrl.destroy);



// ----------------------- update school/subject - called in HW Ctrls.......................................//
app.put('/api/schools/:id/:subject', subjectCtrl.update)
// app.put('/api/schools/:name/:subject', subjectCtrl.update, subjectCtrl.index)

// -------------------- store school/subjectSkipped - called in subCtrls...................................//
app.put('/api/schools/:id/:subject/skipped', subjectCtrl.storeSkipped, subjectCtrl.update);

// ---------------------------------- get school/subjectSkipped............................................//
// app.get('/api/schools/:id/:subject/skipped', subjectCtrl.getSkipped);

app.get('/api/schools/:id/allHW', subjectCtrl.getAllHW);



// ---------------------------------- reset school/subject..............................................//


// app.put('/api/schools/:name/:subject/reset', subjectCtrl.reset)


// ---------------------------------- get school/subject..............................................//
// app.get('/api/schools/:id/:subject', subjectCtrl.index)
// app.get('/api/schools/:name/:subject', subjectCtrl.index)