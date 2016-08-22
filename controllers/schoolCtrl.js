var mongoose = require('mongoose');
var School = require('../models/School');
var User = require('../models/User');


module.exports = {
    index: function(req, res, next) {
        var query = req.query.id ? {
            _id: req.query.id
        } : {};
        School.find(query, function(err, schools) {
            err ? res.status(500).send(err) : res.send(schools);
        })
    },

    destroy: function(req, res, next) {
        School.findOneAndRemove({
            name: req.params.name
        }, function(err, school) {
            User.remove({
                school_id: school._id
            }, function(err, user) {
                err ? res.status(500).send(err) : res.send(user);
            })
        })
    },

    update: function(req, res, next) {
        School.findByIdAndUpdate({
            _id: req.params.id
        }, req.body, function(err, school) {
            school.algProblems.forEach(function(elem, idx) {
                if (elem.assigned == false) {
                    elem.assigned = true;
                }
            });
            school.geoProblems.forEach(function(elem, idx) {
                if (elem.assigned == false) {
                    elem.assigned = true;
                }
            });
            school.alg2Problems.forEach(function(elem, idx) {
                if (elem.assigned == false) {
                    elem.assigned = true;
                }
            });
            school.save()

            err ? res.status(500).send(err) : res.send(school);
        })
    },

    getKeys: function(req, res, next) {
        School.findOne({
            _id: req.params.id
        }, function(err, school) {
            var adminKey = school.adminKeys.filter(function(el, idx) {
                return el.key === req.params.key
            })[0];
            if (!adminKey) return res.send({
                failure: "Invalid key"
            })
            if (adminKey.subject != req.params.subject) return res.send({
                failure: "This key is not valid for " + req.params.subject
            })
            err ? res.status(500).send(err) : res.send(adminKey)
        })
    },

    deleteKey: function(req, res, next) {
        School.findByIdAndUpdate({
            _id: req.params.id
        }, {
            '$pull': {
                'adminKeys': {
                    'key': req.params.key
                }
            }
        }, function(err, school) {

            school.save(function(err, result) {
                err ? res.send(err) : res.send('key deleted')
            })
        })
    }, 

    removeOldKeys: function(req, res, next) {
        School.findByIdAndUpdate({
            _id: req.params.id
        }, {
            '$pull': {
                'adminKeys': {
                    'createdAt': {'$lt' : new Date(req.params.today) - 604800000}
                }
            }
        }, function(err, school) {

            school.save(function(err, result) {
                err ? res.send(err) : res.send('key deleted')
            })
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