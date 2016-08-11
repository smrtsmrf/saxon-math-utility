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
// var TempUser = require('./models/TempUser');
var subjectCtrl = require('./controllers/subjectCtrl');
var userCtrl = require('./controllers/userCtrl');
var schoolCtrl = require('./controllers/schoolCtrl');
var nev = require('email-verification')(mongoose);

var port = 3000;
var corsOptions = {
    origin: 'http://localhost:' + port
    // origin: 'http://127.0.0.1:8080/#/'
};


// var myHasher = function(password, tempUserData, insertTempUser, callback) {
//   var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
//   return insertTempUser(hash, tempUserData, callback);
// };

// nev.configure({
//     verificationURL: 'http://localhost:3000/email-verification/${URL}',
//     // verificationURL: 'http://myawesomewebsite.com/email-verification/${URL}',
//     persistentUserModel: User,
//     tempUserCollection: 'temporary_users',
 
//     transportOptions: {
//         service: 'Gmail',
//         auth: {
//             user: 'smrtsmrf@gmail.com',
//             pass: 'Jonathan2'
//             // user: 'myawesomeemail@gmail.com',
//             // pass: 'mysupersecretpassword'
//         }
//     },
//     hashingFunction: myHasher,
//     verifyMailOptions: {
//         from: 'Do Not Reply <myawesomeemail_do_not_reply@gmail.com>',
//         subject: 'Please confirm account',
//         html: 'Click the following link to confirm your account:</p><p>${URL}</p>',
//         text: 'Please confirm your account by clicking the following link: ${URL}'
//     }
// }, function(err, options) {
//   if (err) {
//     console.log(err);
//     return;
//   }

//   console.log('configured: ' + (typeof options === 'object'));
// });

// nev.generateTempUserModel(User, function(err, tempUserModel) {
// 	if (err) {
// 		console.log(err);
// 		return
// 	}
// });


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

// passport.serializeUser(function(user, done) {
//     done(null, user._id);
// });
passport.serializeUser(function(user, done) {
    done(null, {
    	_id: user._id,
    	school_id: user.school_id,
    	username: user.username,
    	type: user.type
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

app.get('/email-verification/:URL', function(req, res, next) {
	var url = req.params.URL;
	nev.confirmTempUser(url,function(err, user) {
		if (user) {
			nev.sendConfirmationEmail(user.email, function(err, info) {
				if (err) {
					return res.status(404).send('ERROR: sending confirmation email FAILED')
				}
				res.json({
					msg: 'CONFIRMED!',
					info: info
				})
			})
		} else {
			return res.status(404).send('ERROR: confirming temp user FAILED');
		}
	})
})




app.get('/api/test', function(req, res, next) {
	// console.log(req);
	// res.send(Object.keys(req))
	res.send(req._passport.session)
})

// ----------create school, admin, and student users - called in signupCtrl....................//
app.post('/api/schools', schoolCtrl.create);

// --------------- get all schools or one (query) NOT USED IN FRONT END...................//
app.get('/api/schools/', schoolCtrl.index);

// -------------- delete school & assoc. users NOT USED IN FRONT END..................//
app.delete('/api/schools/:name', schoolCtrl.destroy);


//-------------------------------- login - called in loginCtrl............................................//
app.post('/api/login', userCtrl.login);

app.get('/api/logout', userCtrl.logout);

app.get('/api/isAuthed', userCtrl.isAuthed);

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

