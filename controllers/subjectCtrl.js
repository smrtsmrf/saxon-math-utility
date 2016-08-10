var mongoose = require('mongoose');
var ObjectId = mongoose.Types.ObjectId;
var School = require('../models/School');

module.exports = {
	update: function(req, res, next) {
		// var skippedLessons = req.query.lessonRef ? JSON.parse(req.query.lessonRef) : [];
		
		School.findById({_id: req.params.id}, function(err, school) {
			switch (req.params.subject) {
				case 'alg':
					var problems = school.algProblems;
					var skippedLessons = school.algSkipped;
					break;
				case 'geo':
					var problems = school.geoProblems;
					var skippedLessons = school.geoSkipped;
					break;
				case 'alg2':
					var problems = school.alg2Problems;
					var skippedLessons = school.alg2Skipped;
					break;
			}
			console.log(skippedLessons);
			problems.forEach(function(el, idx) {
				// also el.subject === req.params.subject
				if (skippedLessons.indexOf(el.lessonRef) < 0 && el.assigned == false) {
					el.assigned = true;
				}
				else if (skippedLessons.indexOf(el.lessonRef) > -1 && el.assigned == true) {
					el.assigned = false;
				}
			})
			school.save(function(err, resp) {
				console.log('update');
				// err ? res.status(500).send(err) : res.send(resp[req.params.subject+'Problems']);
				res.send('updated')
				// next()
			});
		})
	}, 

	storeSkipped: function(req, res, next) {
		var update = {};
		update[req.params.subject+'Skipped'] = req.body.skipped;
		School.findByIdAndUpdate({_id: req.params.id}, update, function(err, school) {
			// err ? res.status(500).send(err) : res.send(req.body.skipped);
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
	}

		// School.aggregate(
		//       {$match: {_id: ObjectId(req.params.id)}}, 
		//       {$unwind: '$algproblems'},
		//       {$match: {'algproblems.subject': req.params.subject}}
		//       )
		//       .exec(function(err, result) {
		//       	console.log('index');
		// 		err ? res.status(500).send(err) : res.send(result);
		// })
	// }, 

	// reset: function(req, res, next) {
		
	// 	// maybe an aggregate here? 
	// 	// some way to make this faster, and only loop over the subject
	// 	// maybe have geoproblems, algproblems, alg2problems subdocs
	// 	School.findOne({name: req.params.name}, function(err, result) {
	// 		result.problems.forEach(function(el, idx) {
	// 			if (el.subject === req.params.subject && el.assigned == false) {
	// 				el.assigned = true;
	// 			}
	// 		})
	// 		result.save(function(err, resp) {
	// 			console.log('reset');
	// 			res.send(resp)
	// 			// next();
	// 		});
	// 	})
	// }
}