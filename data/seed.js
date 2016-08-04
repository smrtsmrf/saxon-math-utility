var alg = require('./saxon_alg.js');
var geo = require('./saxon_geo.js');
var alg2 = require('./saxon_alg2.js');
var mongoose = require('mongoose');
var School = require('../models/School');

mongoose.connect('mongodb://localhost:27017/saxon', function (err) {
	if (err) throw err;
});

// var newSchool = new School({name: "ALA"})
// var newSchool2 = new School({name: "Ironwood"})

// var subjectNames = ['alg', 'geo', 'alg2'];
// var subjects = [alg, geo, alg2];
// var problems = [];
// for (var i = 0; i < subjectNames.length; i++) {
//     var subjectName = subjectNames[i];
//     var subject = subjects[i];
//     for (var j = 1; j<= 20; j++) {
//         for (var k = 1; k <= 30; k++) {
//             var problem = new ProblemConstructor(subjectName, j, k, subject[Object.keys(subject)[j-1]][k]);
//             problems.push(problem);  
//         }
//     }
// }
// newSchool.problems = problems;
// newSchool.save();
// newSchool2.problems = problems;
// newSchool2.save();

// function ProblemConstructor(subject, lessonNum, problemNum, lessonRef) {
//     this.subject = subject;
//     this.lessonNum = lessonNum; 
//     this.problemNum = problemNum;
//     this.lessonRef = lessonRef;
//     this.assigned = true;
// }