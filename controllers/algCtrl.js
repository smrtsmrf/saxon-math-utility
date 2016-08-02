var AlgProblem = require('../models/AlgProblem');

module.exports = {
	index: function(req, res, next) {
		var skippedLessons = req.query.lessonRef ? JSON.parse(req.query.lessonRef) : [];

		AlgProblem.find({lessonRef: {"$nin" : skippedLessons}})
		.sort([['lessonNum', 'ascending']])
		.exec(function(err, result) {
			err ? res.status(500).send(err) : res.send(result);
		})
		
	}, 

	update: function(req, res, next) {
		
	}, 

	destroy: function(req, res, next) {
		
	}, 

	create: function(req, res, next) {
		
	}
}