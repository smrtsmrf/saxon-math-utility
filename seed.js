// var alg = require('./saxon_alg.js');
var geo = require('./saxon_geo.js');
var alg2 = require('./saxon_alg2.js');
var mongojs = require("mongojs");
var db = mongojs("saxon"); 
var algCollection = db.collection('alg');
var geoCollection = db.collection('geo');
var alg2Collection = db.collection('alg2');

function Problem(lessonNum, problemNum, lessonRef) {
	this.lessonNum = lessonNum; 
	this.problemNum = problemNum;
	this.lessonRef = lessonRef;
	this.assigned = true;
}

var subjects = [alg2, geo, alg2];
var subjectCollections = [algCollection, geoCollection, alg2Collection];

// for (var n = 1; n < subjects.length; n++) {
// 	var subject = subjects[n]; var subjectCollection = subjectCollections[n];
// 	for(var i = 0; i <= 19; i++) {
// 		for(var j = 1; j <= 30; j++) {
// 			var problem = new Problem(Object.keys(subject)[i], j, subject[Object.keys(subject)[i]][j]);
// 			subjectCollection.insert(problem);
// 		}
// 	}
// }


geoCollection.find({lessonRef: 8}, function(err, geo) {
	console.log(geo);
})