var mongoose = require('mongoose');
var School = require('../models/School');
var User = require('../models/User');
var passport = require('passport');
var alg = require('../data/saxon_alg.js');
var geo = require('../data/saxon_geo.js');
var alg2 = require('../data/saxon_alg2.js');
var bcrypt = require('bcrypt');
// var saltRounds = 10;
// var nev = require('email-verification')(mongoose);

module.exports = {
	login: function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {return next(err);}
			if (!user) {return res.send({userFound: false});}
			req.logIn(user, function(err) {
				if (err) {return next(err);}
				return res.send(req._passport.session.user)
			});
		})(req, res, next);
	},

	logout: function(req, res, next) {
		req.logout();
		res.redirect('/')
	},

	isAuthed: function(req, res, next) {
		req.isAuthenticated() ? res.send(req.user.type) : res.send(null)
	},

	index: function(req, res, next) {
		var query = req.query.username ? {username: req.query.username} : {}

		User.find(query, function(err, users) {
			var allUsers = [];
			users.length == 0 ? allUsers.push({available: true}) : users.forEach(function(user, index) {
				allUsers.push({username: user.username, school_id: user.school_id, type: user.type, email: user.email, available: false})
			});

			var result = req.query.school_id ? allUsers.filter(function(user) {
				return user.school_id == req.query.school_id
			}) : allUsers;

			err ? res.status(500).send(err) : res.send(result);
    		})
	}, 

	destroy: function(req, res, next) {
		User.findOneAndRemove({username: req.params.username}, function(err, user) {
			err ? res.status(500).send(err) : res.send(user);
		})
	}, 

	create: function(req, res, next) {
        School.findOne({
            name: req.body.school.name,
            city: req.body.school.city,
            state: req.body.school.state
        }, function(err, existingSchool) {
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
                    users = users.filter(function(el, idx) {
                        return users[idx] !== undefined
                    });
                    for (var i = 0; i < users.length; i++) {
                        var user = users[i];
                        user.school_id = new_school._id;
                        // user.password = bcrypt.hashSync(user.password, saltRounds);
                        user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10), null);
                        var newUser = new User(user);
                        newUser.save(function(err, result) {
                            if (err) console.log(err);
                        })
                    };

                    err ? res.status(500).send(err) : res.send(new_school);
                })
            } else {
                // req.body.user.password = bcrypt.hashSync(req.body.user.password, saltRounds);
                req.body.user.password = bcrypt.hashSync(req.body.user.password, bcrypt.genSaltSync(10), null);
                var newUser = new User(req.body.user)
                newUser.school_id = existingSchool._id;
                newUser.save(function(err, user) {
                    err ? res.status(500).send(err) : res.send(user);
                })
            }
        })
    },
}