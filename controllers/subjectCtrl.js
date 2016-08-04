var School = require('../models/School');

module.exports = {
	index: function(req, res, next) {
		console.log(req.session);
		School.aggregate(
		      {$match: {name: req.params.name}}, 
		      {$unwind: '$problems'},
		      {$match: {'problems.subject': req.params.subject}}
		      )
		      .exec(function(err, result) {
		      	console.log('index');
		      	// console.log(result);
				err ? res.status(500).send(err) : res.send(result);
				// result is an array of objects. result[0] gives back L1#1, result[1] gives back L1#2
		})
	}, 

	update: function(req, res, next) {
		var skippedLessons = req.query.lessonRef ? JSON.parse(req.query.lessonRef) : [];
		
		School.findOne({name: req.params.name}, function(err, result) {
			result.problems.forEach(function(el, idx) {
				if (el.subject === req.params.subject && skippedLessons.indexOf(el.lessonRef) < 0 && el.assigned == false) {
					el.assigned = true;
				}
				else if (el.subject === req.params.subject && skippedLessons.indexOf(el.lessonRef) > -1 && el.assigned == true) {
					el.assigned = false;
				}
			})
			result.save(function(err, resp) {
				console.log('update');
				// res.send(resp)
				next()
			});
		})
	},

	reset: function(req, res, next) {
		
		// maybe an aggregate here? 
		// some way to make this faster, and only loop over the subject
		// maybe have geoproblems, algproblems, alg2problems subdocs
		School.findOne({name: req.params.name}, function(err, result) {
			result.problems.forEach(function(el, idx) {
				if (el.subject === req.params.subject && el.assigned == false) {
					el.assigned = true;
				}
			})
			result.save(function(err, resp) {
				console.log('reset');
				res.send(resp)
				// next();
			});
		})
	}
}