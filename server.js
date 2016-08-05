var express = require('express');
var session = require('express-session');
var config = require('./config.json');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var School = require('./models/School');
var User = require('./models/User');
var alg = require('./data/saxon_alg.js');
var geo = require('./data/saxon_geo.js');
var alg2 = require('./data/saxon_alg2.js');
var subjectCtrl = require('./controllers/subjectCtrl');

var port = 3000;
var corsOptions = {
	origin: 'http://localhost:' + port
};

var app = express();
app.use(bodyParser.json());
app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public/'));
// app.use(session({secret: config.sessionSecret}))
app.use(session({
  secret: config.sessionSecret,
  saveUninitialized: true,
  resave: true
}));

app.listen(port, function () {
	console.log('server running on port', port);
})

mongoose.connect('mongodb://localhost:27017/saxon', function (err) {
	if (err) throw err;
});

// ---------------------------------- login.............................................//
app.post('/api/login', function(req, res, next) {
	User.findOne({username: req.body.username, password: req.body.password}, function(err, result) {
		req.session.currentUser = result;
		console.log('session', req.session);
		// req.session.currentUser ? res.send({userFound : true}) : res.send({userFound : false}) 
		req.session.currentUser ? res.send(req.session) : res.send({userNotFound : true}) 
	})
})


// ---------------------------------- get schools..............................................//
app.get('/api/schools', function(req, res, next) {
 	School.find({}, function (err, result) {
 		err ? res.status(500).send(err) : res.send(result);
 	})
 })

// ---------------------------------- get one school..............................................//
app.get('/api/schools/:id', function(req, res, next) {
 	School.findById({_id: req.params.id}, function (err, result) {
 		err ? res.status(500).send(err) : res.send(result);
 	})
 })

// ---------------------------- create school, admin, and student users..................................//
app.post('/api/schools', function(req, res, next) {

	School.findOne({name: req.body.school.name}, function(err, school) {
		if (!school) {
			var newSchool = new School(req.body.school);

			function ProblemConstructor(subject, lessonNum, problemNum, lessonRef) {
			    this.subject = subject;
			    this.lessonNum = lessonNum; 
			    this.problemNum = problemNum;
			    this.lessonRef = lessonRef;
			    this.assigned = true;
			}

			var subjectNames = ['alg', 'geo', 'alg2'];
			var subjects = [alg, geo, alg2];
			for (var i = 0; i < subjectNames.length; i++) {
			    var subjectName = subjectNames[i];
			    var subject = subjects[i];
			    for (var j = 1; j<= 20; j++) {
			        for (var k = 1; k <= 30; k++) {
			            var problem = new ProblemConstructor(subjectName, j, k, subject[Object.keys(subject)[j-1]][k]);
			            newSchool.problems.push(problem)
			        }
			    }
			}

			newSchool.save(function(err, new_school) {
				var users = [req.body.user, req.body.alg, req.body.geo, req.body.alg2];

				for (var i = 0; i < users.length; i++) {
					var newUser = new User(users[i]);
					newUser.school_id = new_school._id;
					newUser.save(function(err, result) {
						if (err) console.log(err);
					})
				};

				err ? res.status(500).send(err) : res.send(new_school);
			})
		}
		else {
			var newUser = new User(req.body.user)
			newUser.school_id = school._id;
			newUser.save(function(err, result) {
				err ? res.status(500).send(err) : res.send(result);
			})
		}	
	})
})

// ---------------------------------- delete school and assoc. users............................................//
app.delete('/api/schools/:name', function(req, res, next) {
	// School.remove({name: req.params.name}, function(err, result) {
	// 	console.log(result);
	// 	err ? res.status(500).send(err) : res.send(result);
	// })
	
	School.findOneAndRemove({name: req.params.name}, function(err, result) {
		User.remove({school_id: result._id}, function(err, resp) {
			err ? res.status(500).send(err) : res.send(resp);
		})
	})
})


// ---------------------------------- create user.............................................//
// app.post('/api/schools/:name/users', function(req, res, next) {
// 	console.log('req.body', req.body);
// 	// req.body.school
// 	var newUser = new User(req.body)
// 	newUser.save(function(err, result) {
// 		err ? res.status(500).send(err) : res.send(result);
// 	})
// })

// ---------------------------------- get users.............................................//
app.get('/api/schools/:name/users', function(req, res, next) {
	User.find({}, function(err, result) {
		err ? res.status(500).send(err) : res.send(result);
	})
})

// ---------------------------------- delete user.............................................//
app.delete('/api/schools/:name/users/:username', function(req, res, next) {
	User.findOneAndRemove({username:req.params.username}, function(err, result) {
		err ? res.status(500).send(err) : res.send(result);
	})
})


// ---------------------------------- get school/subject..............................................//
app.get('/api/schools/:id/:subject', subjectCtrl.index)
// app.get('/api/schools/:name/:subject', subjectCtrl.index)

// ---------------------------------- update school/subject..............................................//
app.put('/api/schools/:id/:subject', subjectCtrl.update, subjectCtrl.index)
// app.put('/api/schools/:name/:subject', subjectCtrl.update, subjectCtrl.index)

// ---------------------------------- reset school/subject..............................................//
app.put('/api/schools/:name/:subject/reset', subjectCtrl.reset)

// app.put('/api2/schools/:name/:subject', function(req, res, next) {
// 	var skippedLessons = req.query.lessonRef ? JSON.parse(req.query.lessonRef) : [];
	
// 	School.aggregate(
// 		{$match: {	name: req.params.name}},
// 		{$unwind: "$problems"}, 
// 		{$match: {"problems.subject": req.params.subject, "problems.lessonRef": {"$in": skippedLessons}}}
// 		)

// 	.exec(function(err, result) {
// 		var count=0;
// 		result.forEach( function(element, index) {
// 			School.findOneAndUpdate(
// 			{
// 				name: req.params.name, "problems._id": element.problems._id
// 			},
// 			{"$set": {"problems.$.assigned": false}}, {new: true}, function(err, resp) {
// 				count++;
// 				console.log(count);
// 				if (count === result.length) {
// 					res.send(resp)
// 				}
// 			})

// 		});
// 		console.log('...updating...');
// 	})
// })


// var algCtrl = require('./controllers/algCtrl');
// var geoCtrl = require('./controllers/geoCtrl');
// var alg2Ctrl = require('./controllers/alg2Ctrl');
// mongoose.set('debug', true)

// // get requests - A/T/S 
// app.get('/api/alg', algCtrl.index)
// app.get('/api/geo', geoCtrl.index)
// app.get('/api/alg2', alg2Ctrl.index)

// // put requests - A/(T)
// app.put('/api/alg', algCtrl.reset, algCtrl.update, algCtrl.index)
// app.put('/api/geo', geoCtrl.reset, geoCtrl.update, geoCtrl.index)
// app.put('/api/alg2', alg2Ctrl.reset, alg2Ctrl.update, alg2Ctrl.index)
// // app.put('/api/alg', algCtrl.reset)
// // app.put('/api/geo', geoCtrl.reset)
// // app.put('/api/alg2', alg2Ctrl.reset)

// // delete requests - A/(T)
// app.delete('/api/alg', algCtrl.destroy)
// app.delete('/api/geo', geoCtrl.destroy)
// app.delete('/api/alg2', alg2Ctrl.destroy)

// // post requests - A/(T)
// app.post('/api/alg', algCtrl.create)
// app.post('/api/geo', geoCtrl.create)
// app.post('/api/alg2', alg2Ctrl.create)

// inside endpoint do req.session.skipped = req.body
// store session data in database? how?