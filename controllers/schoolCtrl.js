var mongoose = require('mongoose');
var School = require('../models/School');
var User = require('../models/User');
var alg = require('../data/saxon_alg.js');
var geo = require('../data/saxon_geo.js');
var alg2 = require('../data/saxon_alg2.js');
var bcrypt = require('bcrypt');
var saltRounds = 10;

module.exports = {
	index: function(req, res, next) {
		var query = req.query.id ? {_id: req.query.id} : {};
		School.find(query, function(err, schools) {
			err ? res.status(500).send(err) : res.send(schools);
		})
	}, 

	create: function(req, res, next) {
		School.findOne({name: req.body.school.name, city: req.body.school.city, state: req.body.school.state}, function(err, existingSchool) {
			if (!existingSchool) {
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
					for (var j = 1; j <= 20; j++) {
						for (var k = 1; k <= 30; k++) {
							var problem = new ProblemConstructor(subjectName, j, k, subject[Object.keys(subject)[j - 1]][k]);
							switch (subjectName) {
								case 'alg':
									newSchool.algProblems.push(problem)
									break;
								case 'geo':
									newSchool.geoProblems.push(problem)
									break;
								case 'alg2':
									newSchool.alg2Problems.push(problem)
									break;
							}
						}
					}
				}

				newSchool.save(function(err, new_school) {
					var users = [req.body.user, req.body.alg, req.body.geo, req.body.alg2];

					for (var i = 0; i < users.length; i++) {
						var user = users[i];
						user.password = bcrypt.hashSync(user.password, saltRounds);
						var newUser = new User(user);
						newUser.school_id = new_school._id;
						newUser.save(function(err, result) {
							if (err) console.log(err);
						})
					};

					err ? res.status(500).send(err) : res.send(new_school);
				})
			} else {
				req.body.user.password = bcrypt.hashSync(req.body.user.password, saltRounds);
				var newUser = new User(req.body.user)
				newUser.school_id = existingSchool._id;
				newUser.save(function(err, user) {
					err ? res.status(500).send(err) : res.send(user);
				})
			}
		})
	}, 

	destroy: function(req, res, next) {
		School.findOneAndRemove({name: req.params.name},function(err, school){
			User.remove({school_id: school._id}, function(err, user) {
				err ? res.status(500).send(err) : res.send(user);
			})
		})
	}, 

	update: function(req, res, next) {
		School.findByIdAndUpdate({_id: req.params.id}, req.body, function(err, school) {
			school.algProblems.forEach( function(elem, idx) {
				if (elem.assigned == false) {
					elem.assigned = true;
				}
			});
			school.geoProblems.forEach( function(elem, idx) {
				if (elem.assigned == false) {
					elem.assigned = true;
				}
			});
			school.alg2Problems.forEach( function(elem, idx) {
				if (elem.assigned == false) {
					elem.assigned = true;
				}
			});
			school.save()

			err ? res.status(500).send(err) : res.send(school);
		})
	}

	// storeSkipped: function(req, res, next) {
	// 	var update = {};
	// 	update[req.params.subject+'Skipped'] = req.body.skipped;
	// 	School.findByIdAndUpdate({_id: req.params.id}, update, function(err, school) {
	// 		// err ? res.status(500).send(err) : res.send(req.body.skipped);
	// 		next();
	// 	})
	// },



		// getOne: function(req, res, next) {
	// 	School.findById({_id: req.params.id}, function(err, school) {
	// 		err ? res.status(500).send(err) : res.send(school);
	// 	})
	// },


}