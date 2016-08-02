var GeoProblem = require('../models/GeoProblem');

module.exports = {
	index: function(req, res, next) {
		GeoProblem.find({})
		.sort([['assigned', 'ascending']])
		.exec(function(err, result) {
			err ? res.status(500).send(err) : res.send(result);
		})
	}, 

	reset: function(req, res, next) {
		GeoProblem.update({assigned: false}, {assigned: true}, {multi: true}, function(err, result) {
			next();
		})
	},

	update: function(req, res, next) {
		var skippedLessons = req.query.lessonRef ? JSON.parse(req.query.lessonRef) : [];
		GeoProblem.update({lessonRef: {"$in": skippedLessons}}, {assigned:false}, {multi: true}, function(err, result) {
			next();
		})
	},

	destroy: function(req, res, next) {
		
	}, 

	create: function(req, res, next) {
		
	}
}


// GeoProblem.find({lessonRef: {"$nin" : skippedLessons}})
		// .sort([['lessonNum', 'ascending']])
		// .exec(function(err, result) {
		// 	err ? res.status(500).send(err) : res.send(result);
		// })