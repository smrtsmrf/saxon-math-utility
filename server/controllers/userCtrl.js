var mongoose = require('mongoose');
var School = require('../models/School');
var User = require('../models/User');
var passport = require('passport');
var alg = require('../data/saxon_alg.js');
var geo = require('../data/saxon_geo.js');
var alg2 = require('../data/saxon_alg2.js');

module.exports = {
    login: function(req, res, next) {
        passport.authenticate('local', function(err, user, info) {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.send({
                    userFound: false
                });
            }
            req.logIn(user, function(err) {
                if (err) {
                    return next(err);
                }
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
        var query = req.query.username ? {
            username: req.query.username
        } : {}

        User.find(query, function(err, users) {
            var allUsers = [];
            users.length == 0 ? allUsers.push({
                available: true
            }) : users.forEach(function(user, index) {
                allUsers.push({
                    username: user.username,
                    school_id: user.school_id,
                    type: user.type,
                    email: user.email,
                    available: false
                })
            });

            var result = req.query.school_id ? allUsers.filter(function(user) {
                return user.school_id == req.query.school_id
            }) : allUsers;

            err ? res.status(500).send(err) : res.send(result);
        })
    },

    destroy: function(req, res, next) {
        User.findOneAndRemove({
            username: req.params.username
        }, function(err, user) {
            err ? res.status(500).send(err) : res.send(user);
        })
    },

}