var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var School = require('../models/School');

module.exports = {
	update: function(req, res, next) {
		School.findById({_id: req.params.id}, function(err, school) {
			var problems = school[req.params.subject+'Problems'];
			var skippedLessons = school[req.params.subject+'Skipped'];

			problems.forEach(function(el, idx) {
				if (skippedLessons.indexOf(el.lessonRef) < 0 && el.assigned == false) {
					el.assigned = true;
				}
				else if (skippedLessons.indexOf(el.lessonRef) > -1 && el.assigned == true) {
					el.assigned = false;
				}
			})

			school.save();

			var sub = req.params.subject, subSkipped = sub+'Skipped', result = {};
			result[sub] = school[sub+'Problems'];
			result[subSkipped] = school[subSkipped];
			res.send(result)
			
		})
	}, 

	storeSkipped: function(req, res, next) {
		var update = {};
		update[req.params.subject+'Skipped'] = req.body.skipped;
		School.findByIdAndUpdate({_id: req.params.id}, update, function(err, school) {
			next();
		})
	},

	getAllHW: function(req, res, next) {
		School.findById({_id: req.params.id}, function(err, school) {
			err ? res.status(500).send(err) : res.send(
				{alg: school.algProblems,
					algSkipped: school.algSkipped,
					geo: school.geoProblems,
					geoSkipped: school.geoSkipped,
					alg2: school.alg2Problems,
					alg2Skipped: school.alg2Skipped,}
			);
		})
	}, 
	
}