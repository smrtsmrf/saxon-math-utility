var mongoose = require('mongoose');
var School = require('../models/School');
var User = require('../models/User');
var passport = require('passport');
var bcrypt = require('bcrypt');

module.exports = {
	login: function(req, res, next) {
		passport.authenticate('local', function(err, user, info) {
			if (err) {return next(err);}
			if (!user) {return res.send({userFound: false});}
			req.logIn(user, function(err) {
				if (err) {return next(err);}
				return res.send({
					username: user.username,
					school_id: user.school_id,
					type: user.type
				})
			});
		})(req, res, next);
	},

	index: function(req, res, next) {
		var query = req.query.username ? {username: req.query.username} : {}

		User.find(query, function(err, users) {
			console.log(users);
			var allUsers = [];
			users.length == 0 ? allUsers.push({available: true}) :
			users.forEach(function(user, index) {
				allUsers.push({username: user.username, school_id: user.school_id, type: user.type, available: false})
			});

			err ? res.status(500).send(err) : res.send(allUsers);
    		})
	}, 

	destroy: function(req, res, next) {
		User.findOneAndRemove({username: req.params.username}, function(err, user) {
			err ? res.status(500).send(err) : res.send(user);
		})
	}
}