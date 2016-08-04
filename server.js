var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var session = require('express-session');
var config = require('./config.json');
var algCtrl = require('./controllers/algCtrl');
var geoCtrl = require('./controllers/geoCtrl');
var alg2Ctrl = require('./controllers/alg2Ctrl');

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

 // need endpoint that returns skipped lessons
 // findById


var School = require('./models/School');
var alg = require('./data/saxon_alg.js');
var geo = require('./data/saxon_geo.js');
var alg2 = require('./data/saxon_alg2.js');
var subjectCtrl = require('./controllers/subjectCtrl');

// ---------------------------------- school endpoints..............................................//
app.get('/api/schools', function(req, res, next) {
 	School.find({}, function (err, result) {
 		err ? res.status(500).send(err) : res.send(result);
 	})
 })

app.get('/api/schools/:name', function(req, res, next) {
 	School.find({name: req.params.name}, function (err, result) {
 		err ? res.status(500).send(err) : res.send(result);
 	})
 })

app.post('/api/schools', function(req, res, next) {
	var newSchool = new School(req.body);

	function ProblemConstructor(subject, lessonNum, problemNum, lessonRef) {
	    this.subject = subject;
	    this.lessonNum = lessonNum; 
	    this.problemNum = problemNum;
	    this.lessonRef = lessonRef;
	    this.assigned = true;
	}

	var subjectNames = ['alg', 'geo', 'alg2'];
	var subjects = [alg, geo, alg2];
	// var problems = [];
	for (var i = 0; i < subjectNames.length; i++) {
	    var subjectName = subjectNames[i];
	    var subject = subjects[i];
	    for (var j = 1; j<= 20; j++) {
	        for (var k = 1; k <= 30; k++) {
	            var problem = new ProblemConstructor(subjectName, j, k, subject[Object.keys(subject)[j-1]][k]);
	            newSchool.problems.push(problem)
	            // problems.push(problem);  
	        }
	    }
	}
	// newSchool.problems = problems;
	newSchool.save();

	newSchool.save(function(err, result) {
		err ? res.status(500).send(err) : res.send(result);
	})
})

app.delete('/api/schools/:name', function(req, res, next) {
	School.remove({name: req.params.name}, function(err, result) {
		err ? res.status(500).send(err) : res.send(result);
	})
})

// ---------------------------------- get school/subject..............................................//
app.get('/api/schools/:name/:subject', subjectCtrl.index)

// ---------------------------------- update school/subject..............................................//
app.put('/api/schools/:name/:subject', subjectCtrl.update, subjectCtrl.index)

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



