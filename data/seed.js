var alg = require('./saxon_alg.js');
var geo = require('./saxon_geo.js');
var alg2 = require('./saxon_alg2.js');
var mongoose = require('mongoose');
var AlgProblem = require('../models/AlgProblem');
var GeoProblem = require('../models/GeoProblem');
var Alg2Problem = require('../models/Alg2Problem');

mongoose.connect('mongodb://localhost:27017/saxon', function (err) {
	if (err) throw err;
});

function Problem(lessonNum, problemNum, lessonRef) {
	this.lessonNum = lessonNum; 
	this.problemNum = problemNum;
	this.lessonRef = lessonRef;
	this.assigned = true;
}

var subjects = [alg, geo, alg2];
for (var i = 0; i < subjects.length; i++) {
	var sub = subjects[i];
	for (var j = 1; j <= 20; j++) {
		for (var k = 1; k <= 30; k++) {
			var problem = new Problem(j, k, sub[Object.keys(sub)[j-1]][k]);
			switch (sub) {
				case alg:
					var newAlgProblem = new AlgProblem(problem);
					newAlgProblem.save()					
					break;
				case geo:
					var newGeoProblem = new GeoProblem(problem);
					newGeoProblem.save()
					break;
				case alg2:
					var newAlg2Problem = new Alg2Problem(problem);
					newAlg2Problem.save()
					break;
				default:
					break;
			}
		}
	}
}

// with j from 0, use this for first param and change j-1 to just j in last param
// Object.keys(sub)[j]